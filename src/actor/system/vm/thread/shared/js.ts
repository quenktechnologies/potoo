import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty } from '@quenk/noni/lib/data/array';
import {
    CaseFunction,
    Default,
    Case
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';
import { isFunction } from '@quenk/noni/lib/data/type';
import { Maybe } from '@quenk/noni/lib/data/maybe';

import {
    fromSpawnable,
    SharedCreateTemplate,
    SharedRunTemplate,
    SharedTemplate,
    Spawnable
} from '../../../../template';
import { Address, ADDRESS_DISCARD } from '../../../../address';
import {
    Task,
    TASK_TYPE_RECEIVE,
    TASK_TYPE_SPAWN,
    TASK_TYPE_TELL
} from '../../scheduler';
import { Actor, Message } from '../../../..';
import { VM } from '../../';
import { SharedThread, ThreadState } from '.';
import {
    EVENT_ACTOR_RECEIVE,
    EVENT_ACTOR_STOPPED,
    EVENT_MESSAGE_CONSUMED,
    EVENT_MESSAGE_DROPPED
} from '../../event';

const defaultCases = [new Default(identity)];

export const ERR_THREAD_INVALID = 'ERR_THREAD_INVALID';

/**
 * JSThread is used by actors that run in the same event loop as the VM.
 */
export class JSThread implements SharedThread {
    constructor(
        public vm: VM,
        public template: SharedTemplate,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE,
        public actor: Maybe<Actor> = Maybe.nothing()
    ) {}

    readonly self = this.address;

    _assertValid() {
        if (!this.isValid()) throw new Error(ERR_THREAD_INVALID);
    }

    isValid() {
        return (
            this.state !== ThreadState.INVALID &&
            this.state !== ThreadState.ERROR
        );
    }

    async start() {
        let { run } = <SharedRunTemplate>this.template;
        let { create } = <SharedCreateTemplate>this.template;

        if (isFunction(run)) {
            await run(this);
        } else if (isFunction(create)) {
            let actor = await create(this);
            this.actor = Maybe.just(actor);
            await actor.start();
        }
    }

    async notify(msg: Message) {
        this._assertValid();

        this.mailbox.push(msg);

        if (this.state === ThreadState.MSG_WAIT) this.resume();

        this.vm.scheduler.run();
    }

    async stop() {
        if (this.actor.isJust()) await this.actor.get().stop();
    }

    async watch<T>(task: () => Promise<T> | Promise<T>) {
        this._assertValid();
        await (isFunction(task) ? Future.do(task) : task).catch(err =>
            this.raise(err)
        );
    }

    async kill(address: Address): Promise<void> {
        this._assertValid();
        if (address === this.self) this.state = ThreadState.INVALID;
        await this.vm.sendKillSignal(this, address);
    }

    die() {
        this.state = ThreadState.INVALID;
        this.vm.scheduler.removeTasks(this);
        this.vm.events.dispatchActorEvent(
            this.address,
            this.address,
            EVENT_ACTOR_STOPPED
        );
    }

    /**
     * resume marks the Thread as ready to run again.
     */
    resume() {
        this._assertValid();
        this.state = ThreadState.IDLE;
    }

    async raise(e: Err) {
        this._assertValid();
        this.state = ThreadState.ERROR;
        await this.vm.errors.raise(this, e);
    }

    async spawn(tmpl: Spawnable): Promise<Address> {
        this._assertValid();
        let result = await Future.fromCallback<Address>(cb => {
            this.vm.scheduler.postTask(
                new Task(TASK_TYPE_SPAWN, this, cb, async () => {
                    let address = await this.vm.allocator.allocate(
                        this,
                        fromSpawnable(tmpl)
                    );
                    cb(null, address);
                })
            );
        });
        return result;
    }

    async tell(addr: Address, msg: Message): Promise<void> {
        this._assertValid();
        await Future.fromCallback(cb => {
            this.vm.scheduler.postTask(
                new Task(TASK_TYPE_TELL, this, cb, async () => {
                    await this.vm.sendMessage(this, addr, msg);
                    cb(null);
                })
            );
        });
    }

    async receive<T = Message>(cases: Case<T>[] = []): Promise<T> {
        this._assertValid();
        let msg = await Future.fromCallback<T>(cb => {
            this.vm.events.dispatchActorEvent(
                this.address,
                this.address,
                EVENT_ACTOR_RECEIVE
            );
            let matcher = new CaseFunction(empty(cases) ? defaultCases : cases);
            let task = new Task(TASK_TYPE_RECEIVE, this, cb, async () => {
                this._assertValid();
                if (!empty(this.mailbox)) {
                    let msg = this.mailbox.shift();
                    if (matcher.test(msg)) {
                        this.vm.events.dispatchMessageEvent(
                            this.address,
                            EVENT_MESSAGE_CONSUMED,
                            ADDRESS_DISCARD,
                            msg
                        );
                        //XXX: Setting the state to idle here allows for
                        // nested tasks.
                        this.resume();
                        let result = await matcher.apply(msg);
                        return cb(null, result);
                    }
                    this.vm.events.dispatchMessageEvent(
                        this.address,
                        EVENT_MESSAGE_DROPPED,
                        ADDRESS_DISCARD,
                        msg
                    );
                }
                this.state = ThreadState.MSG_WAIT;
                this.vm.scheduler.postTask(task, true);
            });

            this.vm.scheduler.postTask(task);
        });
        return msg;
    }
}

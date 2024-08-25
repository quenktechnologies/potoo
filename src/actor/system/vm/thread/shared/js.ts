import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty } from '@quenk/noni/lib/data/array';
import {
    CaseFunction,
    Default,
    Case
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Template } from '../../../../template';
import { Address, ADDRESS_DISCARD } from '../../../../address';
import { Task } from '../../scheduler';
import { Message } from '../../../..';
import { VM } from '../../';
import { SharedThread, ThreadState } from '.';
import { EVENT_ACTOR_RECEIVE, EVENT_MESSAGE_DROPPED } from '../../event';

const defaultCases = [new Default(identity)];

export const ERR_THREAD_INVALID = 'ERR_THREAD_INVALID';

/**
 * JSThread is used by actors that run in the same event loop as the VM.
 */
export class JSThread implements SharedThread {
    constructor(
        public vm: VM,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE
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

    async start() {}

    async notify(msg: Message) {
        this._assertValid();

        this.mailbox.push(msg);

        if (this.state === ThreadState.MSG_WAIT) this.resume();

        this.vm.scheduler.run();
    }

    async stop() {}

    async watch<T>(task: () => Promise<T>) {
        this._assertValid();
        await Future.do(task).catch(err => this.raise(err));
    }

    async kill(address: Address): Promise<void> {
        this._assertValid();
        this.state = ThreadState.INVALID;
        await this.vm.sendKillSignal(this, address);
    }

    die() {
        // TODO: dispatch event
        this.state = ThreadState.INVALID;
        this.vm.scheduler.removeTasks(this);
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

    async spawn(tmpl: Template): Promise<Address> {
        this._assertValid();
        let result = await Future.fromCallback<Address>(cb => {
            this.vm.scheduler.postTask(
                new Task(this, cb, async () => {
                    let address = await this.vm.allocator.allocate(this, tmpl);
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
                new Task(this, cb, async () => {
                    await this.vm.sendMessage(this, addr, msg);
                    cb(null);
                })
            );
        });
    }

    async receive<T = Message>(cases: Case<Message, T>[] = []): Promise<T> {
        this._assertValid();
        let msg = await Future.fromCallback<T>(cb => {
            this.vm.events.dispatchActorEvent(this, EVENT_ACTOR_RECEIVE);
            let matcher = new CaseFunction(empty(cases) ? defaultCases : cases);
            let task = new Task(this, cb, async () => {
                this._assertValid();
                if (!empty(this.mailbox)) {
                    let msg = this.mailbox.shift();
                    if (matcher.test(msg)) {
                        //XXX: Setting the state to idle here allows for
                        // nested tasks.
                        this.resume();
                        let result = await matcher.apply(msg);
                        return cb(null, result);
                    }
                    this.vm.events.dispatchMessageEvent(
                        this,
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

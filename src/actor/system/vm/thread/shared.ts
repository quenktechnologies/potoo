import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty } from '@quenk/noni/lib/data/array';
import {
    CaseFunction,
    Default,
    TypeCase
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Template } from '../../../template';
import { Address } from '../../../address';
import { Task } from '../scheduler';
import { Message } from '../../..';
import { Platform } from '../';
import { Thread, ThreadState } from './';

const defaultCases = [new Default(identity)];

export const E_INVALID = 'ERR_THREAD_INVALID';

/**
 * SharedThread is used by actors that run in the same event loop as the VM.
 *
 * Code execution takes place on the Scheduler using the Task type.
 */
export class SharedThread implements Thread {
    constructor(
        public vm: Platform,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE
    ) {}

    readonly self = this.address;

    _assertValid() {
        if (!this.isValid()) throw new Error(E_INVALID);
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
        await this.vm.killActor(this, address);
    }

    die() {
        // TODO: dispatch event
        this.state = ThreadState.INVALID;
        this.vm.scheduler.removeTasks(this);
    }

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
                    let address = await this.vm.allocateActor(this, tmpl);
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
                    await this.vm.sendActorMessage(this, addr, msg);
                    cb(null);
                })
            );
        });
    }

    async receive<T = Message>(cases: TypeCase<T>[] = []): Promise<T> {
        this._assertValid();
        let msg = await Future.fromCallback<T>(cb => {
            // TODO dispatch message received / wait event
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
                    // TODO: dispatch message dropped event
                }
                this.state = ThreadState.MSG_WAIT;
                this.vm.scheduler.postTask(task, true);
            });

            this.vm.scheduler.postTask(task);
        });
        return msg;
    }
}

import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty } from '@quenk/noni/lib/data/array';
import { isFunction } from '@quenk/noni/lib/data/type';
import {
    CaseFunction,
    Default,
    TypeCase
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Template } from '../../../template';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Task, Scheduler } from '../scheduler';
import { AsyncTask } from '../runtime';
import { Platform } from '../';
import { Thread, ThreadState } from './';

const defaultCases = [new Default(identity)];

/**
 * SharedThread is used by actors that run in the same event loop as the VM.
 *
 * Code execution takes place on the Scheduler using the Task type.
 */
export class SharedThread implements Thread {
    constructor(
        public vm: Platform,
        public scheduler: Scheduler,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE
    ) {}

    readonly self = this.address;

    _assertValid() {
        if (!this.isValid()) throw new Error('ERR_THREAD_INVALID');
    }

    isValid() {
        return (
            this.state !== ThreadState.INVALID &&
            this.state !== ThreadState.ERROR
        );
    }

    notify(msg: Message) {
        this._assertValid();

        this.mailbox.push(msg);

        if (this.state === ThreadState.MSG_WAIT) this.state = ThreadState.IDLE;

        this.scheduler.run();
    }

    watch<T>(task: AsyncTask<T>) {
        this._assertValid();

        let onError = (e: Error) => {
            this.raise(e);
        };

        let onSuccess = () => {
            this.state = ThreadState.IDLE;
            // Keep the Scheduler going.
            this.scheduler.run();
        };

        Future.do(async () => {
            await (isFunction(task) ? task() : task);
        }).fork(onError, onSuccess);
    }

    wait<T>(task: AsyncTask<T>) {
        this._assertValid();
        this.state = ThreadState.ASYNC_WAIT;
        this.watch(task);
    }

    exit() {
        this.state = ThreadState.INVALID;
        this.vm.kill(this, this.address).fork();
    }

    kill(address: Address): Future<void> {
        this._assertValid();
        return this.vm.kill(this, address);
    }

    die(): Future<void> {
        this._assertValid();

        // TODO: dispatch event
        return Future.do(async () => {
            this.state = ThreadState.INVALID;
            this.scheduler.removeTasks(this);
        });
    }

    raise(e: Err) {
        this._assertValid();
        this.state = ThreadState.ERROR;
        this.vm.raise(this, e).fork();
    }

    spawn(tmpl: Template): Future<Address> {
        return Future.fromCallback(cb => {
            this.scheduler.postTask(
                new Task(this, cb, async () => {
                    let address = await this.vm.allocate(this, tmpl);
                    cb(null, address);
                })
            );
        });
    }

    tell(addr: Address, msg: Message): Future<void> {
        return Future.fromCallback(cb => {
            this.scheduler.postTask(
                new Task(this, cb, async () => {
                    await this.vm.sendMessage(this, addr, msg);
                    cb(null);
                })
            );
        });
    }

    receive<T = Message>(cases: TypeCase<T>[] = []): Future<T> {
        return Future.fromCallback<T>(cb => {
            // TODO dispatch message received / wait event
            let matcher = new CaseFunction(empty(cases) ? defaultCases : cases);
            let task = new Task(this, cb, async () => {
                this._assertValid();
                if (!empty(this.mailbox)) {
                    let msg = this.mailbox.shift();
                    if (matcher.test(msg)) {
                        //XXX: Setting the state to idle here allows for
                        // nested tasks.
                        this.state = ThreadState.IDLE;
                        let result = await matcher.apply(msg);
                        return cb(null, result);
                    }
                    // TODO: dispatch message dropped event
                }
                this.state = ThreadState.MSG_WAIT;
                this.scheduler.postTask(task, true);
            });

            this.scheduler.postTask(task);
        });
    }
}

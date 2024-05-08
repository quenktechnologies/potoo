import { Err } from '@quenk/noni/lib/control/error';
import { Callback, Future } from '@quenk/noni/lib/control/monad/future';
import { empty } from '@quenk/noni/lib/data/array';
import { isFunction } from '@quenk/noni/lib/data/type';
import {
    CaseFunction,
    Default,
    TypeCase
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Platform } from '../';
import { Template } from '../../../template';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Thread, ThreadState } from './';
import { Scheduler } from '../scheduler';
import { AsyncTask } from '../runtime';

/**
 * Task represents a single unit of work the SharedThread is expected to execute.
 * @private
 */
export class Task {
    constructor(
        public exec: Future<void>,
        public onError: (err: Error) => void
    ) {}
}

/**
 * SharedThread is used by actors that run in the same event loop as the VM.
 *
 * Code execution takes place when the resume() method is invoked by the VM's
 * Scheduler.
 */
export class SharedThread implements Thread {
    constructor(
        public vm: Platform,
        public scheduler: Scheduler,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE,
        public queue: Task[] = []
    ) {}

    readonly self = this.address;

    _postTask<T>(task: (f: Callback<T>) => Task): Future<T> {
        return Future.fromCallback(cb => {
            this.queue.push(task(cb));
            this.scheduler.enqueue(this);
        });
    }

    _assertValid() {
        if (!this.isValid()) throw new Error('ERR_THREAD_INVALID');
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

    raise(e: Err) {
        this._assertValid();
        this.state = ThreadState.ERROR;
        this.vm.raise(this, e).fork();
    }

    spawn(tmpl: Template): Future<Address> {
        return this._postTask<Address>(
            cb =>
                new Task(
                    Future.do(async () => {
                        let result = await this.vm.allocate(this, tmpl);
                        cb(null, result);
                    }),
                    cb
                )
        );
    }

    tell(addr: Address, msg: Message): Future<void> {
        return this._postTask(
            cb =>
                new Task(
                    Future.do(async () => {
                        this.vm.sendMessage(this, addr, msg);
                    }),
                    cb
                )
        );
    }

    receive<T = Message>(cases: TypeCase<T>[] = []): Future<T> {
        // TODO dispatch message received / wait event
        let matcher = new CaseFunction(
            empty(cases) ? [new Default(identity)] : cases
        );
        return this._postTask<T>(cb => {
            let task = new Task(
                Future.do(async () => {
                    if (!empty(this.mailbox)) {
                        let msg = this.mailbox.shift();
                        if (matcher.test(msg)) {
                            //XXX: Setting the state to idle here allows for
                            // nested tasks.
                            this.state = ThreadState.IDLE;
                            let result = await matcher.apply(msg);
                            cb(null, result);
                            return;
                        }
                        // TODO: dispatch message dropped event
                    }

                    this.state = ThreadState.MSG_WAIT;
                    this.queue.unshift(task);
                    this.scheduler.enqueue(this);
                }),
                cb
            );

            return task;
        });
    }

    die(): Future<void> {
        this._assertValid();

        // TODO: dispatch event
        return Future.do(async () => {
            this.state = ThreadState.INVALID;
            this.scheduler.dequeue(this);

            let err = new Error('ERR_THREAD_ABORTED');

            while (!empty(this.queue)) (<Task>this.queue.shift()).onError(err);
        });
    }

    isValid() {
        return (
            this.state !== ThreadState.INVALID &&
            this.state !== ThreadState.ERROR
        );
    }

    resume() {
        this._assertValid();

        let task = this.queue.shift();
        if (task) {
            //TODO: dispatch event
            this.state = ThreadState.RUNNING;
            task.exec.fork(task.onError, () => {
                if (this.state === ThreadState.RUNNING)
                    this.state = ThreadState.IDLE;
            });
        }
    }
}

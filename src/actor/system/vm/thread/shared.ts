import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { empty, head } from '@quenk/noni/lib/data/array';
import { isFunction } from '@quenk/noni/lib/data/type';
import {
    CaseFunction,
    Default,
    TypeCase
} from '@quenk/noni/lib/control/match/case';
import { identity } from '@quenk/noni/lib/data/function';

import { Script } from '../script';
import { Platform } from '../';
import { Template } from '../../../template';
import { Address } from '../../../address';
import { Message } from '../../../message';
import { Thread, ThreadState } from './';
import { Job, JobType, JSJob } from '../scheduler';
import { AsyncTask } from '../runtime';

/**
 * SharedThread is used by actors that run in the same event loop as the VM.
 *
 * Code execution takes place when the resume() method is invoked by the VM's
 * Scheduler.
 */
export class SharedThread implements Thread {
    constructor(
        public vm: Platform,
        public script: Script,
        public address: Address,
        public mailbox: Message[] = [],
        public state: ThreadState = ThreadState.IDLE
    ) {}

    readonly self = this.address;

    notify(msg: Message) {
        this.mailbox.push(msg);

        if (this.state === ThreadState.MSG_WAIT) this.state = ThreadState.IDLE;

        this.vm.scheduler.run();
    }

    watch<T>(task: AsyncTask<T>) {
        let onError = (e: Error) => {
            this.raise(e);
        };
        let onSuccess = () => {
            this.state = ThreadState.IDLE;
            // Keep the Scheduler going.
            this.vm.scheduler.run();
        };
        Future.do(async () => {
            await (isFunction(task) ? task() : task);
        }).fork(onError, onSuccess);
    }

    wait<T>(task: AsyncTask<T>) {
        this.state = ThreadState.ASYNC_WAIT;
        this.watch(task);
    }

    exit() {
        this.state = ThreadState.INVALID;
        this.vm.kill(this, this.address).fork();
    }

    kill(address: Address): Future<void> {
        return this.vm.kill(this, address);
    }

    raise(e: Err) {
        this.state = ThreadState.ERROR;
        this.vm.raise(this, e).fork();
    }

    spawn(tmpl: Template): Future<Address> {
        return Future.fromCallback(cb => {
            this.vm.scheduler.postJob(
                new JSJob(
                    this,
                    async () => {
                        let result = await this.vm.allocate(this, tmpl);
                        cb(null, result);
                    },
                    cb
                )
            );
        });
    }

    tell(addr: Address, msg: Message): Future<void> {
        return Future.fromCallback(cb => {
            this.vm.scheduler.postJob(
                new JSJob(
                    this,
                    async () => {
                        this.vm.sendMessage(this, addr, msg);
                    },
                    cb
                )
            );
        });
    }

    receive<T = Message>(cases: TypeCase<T>[] = []): Future<T> {
        // TODO dispatch message received / wait event
        let match = new CaseFunction(
            empty(cases) ? [new Default(identity)] : cases
        );
        return Future.fromCallback(cb => {
            let job = new JSJob(
                this,
                () =>
                    Future.do(async () => {
                        if (empty(this.mailbox)) {
                            this.state = ThreadState.MSG_WAIT;
                            this.vm.scheduler.preemptJob(job);
                            return;
                        }

                        let msg = head(this.mailbox);
                        if (!match.test(msg)) {
                            //TODO dispatch message dropped event
                            this.state = ThreadState.MSG_WAIT;
                            this.vm.scheduler.preemptJob(job);
                            return;
                        }

                        let result = await match.apply(msg);
                        this.state = ThreadState.IDLE;
                        cb(null, result);
                    }),
                cb
            );
            this.vm.scheduler.postJob(job);
        });
    }

    die(): Future<void> {
        // TODO: dispatch event

        return Future.do(async () => {
            this.state = ThreadState.INVALID;

            this.vm.scheduler.dequeue(this);

            return Future.of(<void>undefined);
        });
    }

    isValid() {
        return (
            this.state !== ThreadState.INVALID &&
            this.state !== ThreadState.ERROR
        );
    }

    resume(job: Job) {
        //TODO: dispatch event
        this.state = ThreadState.RUNNING;
        if (job.type === JobType.JS) {
            this.wait((<JSJob>job).fun);
        }
    }
}

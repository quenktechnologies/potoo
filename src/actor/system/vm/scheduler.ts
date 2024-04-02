import { remove } from '@quenk/noni/lib/data/array';

import { AsyncTask } from '../../api';
import { FunInfo } from './script/info';
import { Thread, ThreadState } from './thread';
import { Data } from './frame';

/**
 * Job type represents an intial unit of work the Scheduler co-ordinates for a
 * thread.
 */
export type Job = VMJob | JSJob;

/**
 * JobType distinguishes between the VM and JS jobs.
 */
export enum JobType {
    VM = 'vm',
    JS = 'js'
}

/**
 * VMJob is a job that executes VM code.
 */
export class VMJob {
    type = JobType.VM;
    constructor(
        public thread: Thread,
        public fun: FunInfo,
        public args: Data[] = [],
        public onError: (err: Error) => void
    ) {}
}

/**
 * JSJob is a job that executes JavaScript code directly.
 */
export class JSJob {
    type = JobType.JS;
    constructor(
        public thread: Thread,
        public fun: AsyncTask<void>,
        public onError: (err: Error) => void
    ) {}
}

/**
 * Scheduler provides a mechanism for cooperative execution between VM threads.
 *
 * The main abstraction here is the Job which has two components:
 * 1. VMJobs which are used to kick start code execution.
 * 2. JSJobs which are used to schedule execution of JS code.
 *
 * In prior versions, VM threads executed code at will which made it possible
 * for actor state to be mutated  while still depended on. This created subtle,
 * hard to debug errors in large apps.
 *
 * By using a scheduler we can ensure that a thread does not preempt itself
 * causing issues. Due to the single threaded, event looped nature of JavaScript
 * engines, a single VM thread may have more than one Jobs scheduled at a time.
 * However, Jobs of a VM thread are not allowed to preempt each other or run in
 * parallel.
 *
 * Instead, execution is sequential with pending Jobs having to wait until their
 * thread is available to continue execution. This design is meant to simulate
 * the idea of each actor having its own thread (process) of execution where it
 * is ok to block without affecting other actors.
 *
 * In reality, only execution of the VM thread's code is blocked while other
 * VM thread code are allowed to execute.
 */
export class Scheduler {
    constructor(public queue: Job[] = []) {}

    _running = false;

    /**
     * postJob enqueues a Job for execution by the Scheduler.
     *
     * If no other Jobs are being executed, the Job will be executed immediately
     * provided the Thread is able to do so.
     */
    postJob(job: Job) {
        this.queue.push(job);
        this.run();
    }

    /**
     * preemptJob enqueues a Job at the head of the queue giving it priority over
     * any existing Jobs for a thread.
     */
    preemptJob(job: Job) {
        this.queue.unshift(job);
        this.run();
    }

    /**
     * dequeue all pending Jobs for a Thread, effectively ending its
     * execution.
     *
     * Any existing jobs for the thread will throw "ERR_THREAD_ABORTED".
     */
    dequeue(thread: Thread) {
        this.queue = this.queue.filter(job => {
            if (job.thread === thread)
                job.onError(new Error('ERR_THREAD_ABORTED'));
            return false;
        });
    }

    /**
     * run the Job processing loop until there are no more Jobs to process in
     * the queue.
     *
     * This method is idempotent and can be called as many times as needed.
     */
    run() {
        if (this._running) return;

        this._running = true;

        let job;
        while (
            (job = this.queue.find(
                ({ thread }) => thread.state === ThreadState.IDLE
            ))
        ) {
            let { thread } = job;

            thread.resume(job);

            // If the thread is waiting on async work to complete then do not
            // remove the Job.
            if (thread.state !== ThreadState.ASYNC_WAIT) {
                this.queue = remove(this.queue, job);
            }

            if (thread.state === ThreadState.ERROR) {
                // TODO: better error
                job.onError(new Error('VMError'));
            }
        }

        this._running = false;
    }
}

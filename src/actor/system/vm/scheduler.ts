import { remove } from '@quenk/noni/lib/data/array';

import { SharedThread } from './thread/shared';
import { ThreadState } from './thread';
import { Job } from './job';
import { Callback } from '@quenk/noni/lib/control/monad/future';

/**
 * Task is the type the scheduler knows how to execute.
 */
export type Task 
  = Job
  | Callback<void>
  ;

/**
 * Scheduler provides a mechanism for cooperative execution between VM threads.
 *
 * The main abstraction here is the Task which has two components:
 * 1. Jobs which are used to kick start code execution.
 * 2. Callbacks which are used to schedule execution of JS code.
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
    constructor(public queue: Task[] = []) {}

    _running = false;

    /**
     * post enqueues a Job for execution by the Scheduler.
     *
     * If no other Jobs are being executed, the Job will be executed immediately
     * provided the Thread is able to do so.
     */
    post(task: Task) {
        this.queue.push(task);
        this.run();
    }

    /**
     * dequeue all pending Jobs for a Thread, effectively ending its
     * execution.
     *
     * Any existing jobs for the thread will throw "ERR_THREAD_ABORTED".
     */
    dequeue(thread: SharedThread) {
        let queue = [];

        for (let job of this.queue) {
            if (job.thread === thread)
                job.handler(new Error('ERR_THREAD_ABORTED'));
            else queue.push(job);
        }

        this.queue = queue;
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

        let task;
        while (
            (task = this.queue.find(
                ({ thread }) => thread.state === ThreadState.READY
            ))
        ) {
            let { thread } = task;

            thread.resume(task);

            // If the thread is waiting on async work to complete then do not
            // remove the Job.
            if (thread.state !== ThreadState.WAITING) {
                this.queue = remove(this.queue, task);
            }

            if (thread.state === ThreadState.ERROR)
                task.handler(new Error('VMError'));
            else task.handler(null, thread.deref(thread.returnPointer));
        }

        this._running = false;
    }
}

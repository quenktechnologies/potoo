import { Platform } from '../../';
import { VMThread } from '../';
import { Job } from './';
/**
 * SharedScheduler allows SharedThreads to execute code sequentially and
 * cooperatively on the single JS event loop.
 *
 * In prior versions of the VM, threads executed their code on their own making
 * situations possible where internal actor state could be before a prior frame
 * completed leading to strange, hard to debug errors.
 *
 * To avoid a repeat of these, the SharedScheduler guarantees a SharedThread
 * will only execute one "job" at a time, only allowing another to start when
 * the thread is finished.
 */
export declare class SharedScheduler {
    vm: Platform;
    queue: Job[];
    constructor(vm: Platform, queue?: Job[]);
    _running: boolean;
    /**
     * postJob enqueues a Job for execution by the SharedScheduler.
     *
     * If no other Jobs are being executed, the Job will be executed immediately
     * provided the Thread is able to do so.
     */
    postJob(job: Job): void;
    /**
     * dequeue all Jobs for the provided thread, effectively ending its
     * execution.
     */
    dequeue(thread: VMThread): void;
    /**
     * run the Job processing loop until there are no more Jobs to process in
     * the queue.
     */
    run(): void;
}

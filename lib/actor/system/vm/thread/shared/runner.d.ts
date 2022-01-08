import { Platform } from '../../';
import { Data } from '../../runtime/stack/frame';
import { FunInfo } from '../../script/info';
import { VMThread } from '../';
/**
 * Job is a request by a thread to execute VM code on its behalf to
 * the SharedThreadRunner
 */
export declare class Job {
    thread: VMThread;
    fun: FunInfo;
    args: Data[];
    constructor(thread: VMThread, fun: FunInfo, args?: Data[]);
}
/**
 * SharedThreadRunner allows multiple Threads to execute their code sequentially
 * in a single JS event loop.
 *
 * In prior versions of the VM, threads executed their code in their own run
 * methods making it possible to have situations where actor state is being
 * mutated before a previous frame is complete.
 *
 * This was less of a problem due to the simplistic use of the VM to date and
 * the queuing done by the VM itself however it did introduce some heap
 * management related bugs due to the immediate execution of spawn scripts.
 *
 * By moving actual execution here and sharing an instance of this class between
 * threads we make it easier to keep execution sequential an reflect the reality
 * of a shared event loop.
 */
export declare class SharedThreadRunner {
    vm: Platform;
    jobs: Job[];
    constructor(vm: Platform, jobs?: Job[]);
    _running: boolean;
    /**
     * enqueue a Job for future execution.
     */
    enqueue(job: Job): this;
    /**
     * dequeue all Jobs for the provide thread effectively ending its
     * execution.
     */
    dequeue(thread: VMThread): void;
    /**
     * postJob enqueues a Job for execution triggering the run() loop immediately
     * if not already running.
     */
    postJob(job: Job): void;
    /**
     * run the Job processing loop until there are no more Jobs to process in
     * the queue.
     */
    run(): void;
}

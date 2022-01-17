"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedScheduler = void 0;
const array_1 = require("@quenk/noni/lib/data/array");
const __1 = require("../");
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
class SharedScheduler {
    constructor(vm, queue = []) {
        this.vm = vm;
        this.queue = queue;
        this._running = false;
    }
    /**
     * postJob enqueues a Job for execution by the SharedScheduler.
     *
     * If no other Jobs are being executed, the Job will be executed immediately
     * provided the Thread is able to do so.
     */
    postJob(job) {
        this.queue.push(job);
        this.run();
    }
    /**
     * dequeue all Jobs for the provided thread, effectively ending its
     * execution.
     */
    dequeue(thread) {
        this.queue = this.queue.filter(job => job.thread !== thread);
    }
    /**
     * run the Job processing loop until there are no more Jobs to process in
     * the queue.
     */
    run() {
        if (this._running)
            return;
        this._running = true;
        let job;
        while (job = this.queue.find(({ thread }) => (thread.state === __1.THREAD_STATE_IDLE))) {
            let { thread } = job;
            thread.resume(job);
            // If the thread is waiting on async work to complete then do not
            // remove the Job.
            if (thread.state !== __1.THREAD_STATE_WAIT)
                this.queue = (0, array_1.remove)(this.queue, job);
        }
        this._running = false;
    }
}
exports.SharedScheduler = SharedScheduler;
//# sourceMappingURL=scheduler.js.map
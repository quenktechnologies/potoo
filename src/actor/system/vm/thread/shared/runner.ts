import { empty, remove } from '@quenk/noni/lib/data/array';

import { Platform } from '../../';
import { Frame, Data } from '../../runtime/stack/frame';
import { handlers } from '../../runtime/op';
import { OPCODE_MASK, OPERAND_MASK } from '../../runtime';
import { FunInfo } from '../../script/info';
import {
    THREAD_STATE_IDLE,
    THREAD_STATE_RUN,
    THREAD_STATE_WAIT,
    VMThread
} from '../';

/**
 * Job is a request by a thread to execute VM code on its behalf to
 * the SharedThreadRunner
 */
export class Job {

    constructor(
        public thread: VMThread,
        public fun: FunInfo,
        public args: Data[] = []) { }

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
export class SharedThreadRunner {

    constructor(
        public vm: Platform,
        public jobs: Job[] = []) { }

    _running = false;

    /**
     * enqueue a Job for future execution.
     */
    enqueue(job: Job) {

        this.jobs.push(job);

        return this;

    }

    /**
     * dequeue all Jobs for the provide thread effectively ending its
     * execution.
     */
    dequeue(thread: VMThread) {

        this.jobs = this.jobs.filter(job => job.thread !== thread);

    }

    /**
     * postJob enqueues a Job for execution triggering the run() loop immediately
     * if not already running.
     */
    postJob(job: Job) {

        this.enqueue(job);

        this.run();

    }

    /**
     * run the Job processing loop until there are no more Jobs to process in 
     * the queue.
     */
    run() {

        if (this._running) return;

        this._running = true;

        let job;
        while (job = this.jobs.find(job =>
            job.thread.state === THREAD_STATE_IDLE)) {

            let thread = job.thread;

            thread.restore(job);

            while (!empty(thread.fstack)) {

                let sp = thread.fsp;

                let frame = <Frame>thread.fstack[sp];

                if (thread.rp != 0)
                    frame.data.push(thread.rp);

                while (!frame.isFinished() &&
                    (thread.state === THREAD_STATE_RUN)) {

                    //execute frame instructions
                    let pos = frame.getPosition();
                    let next = (frame.code[pos] >>> 0);
                    let opcode = next & OPCODE_MASK;
                    let operand = next & OPERAND_MASK;

                    this.vm.logOp(thread, frame, opcode, operand);

                    // TODO: Error if the opcode is invalid, out of range etc.
                    handlers[opcode](thread, frame, operand);

                    if (pos === frame.getPosition()) frame.advance();

                    // frame pointer changed another frame has been pushed
                    // and needs to be executed.
                    if (sp !== thread.fsp) break;

                }

                if (thread.state === THREAD_STATE_WAIT)
                    // Thread is waiting on an async task to complete break out
                    // and handle other threads.
                    break;

                if (sp === thread.fsp)
                    thread.nextFrame(<Data>frame.data.pop() || 0);

            }

            if (empty(thread.fstack))
                // The thread's frame stack is empty, meaning all execution is 
                // complete. Remove the job from the queue.
                this.jobs = remove(this.jobs, job);

        }

        this._running = false;

    }

}

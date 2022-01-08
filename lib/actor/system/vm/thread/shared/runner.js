"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedThreadRunner = exports.Job = void 0;
var array_1 = require("@quenk/noni/lib/data/array");
var op_1 = require("../../runtime/op");
var runtime_1 = require("../../runtime");
var __1 = require("../");
/**
 * Job is a request by a thread to execute VM code on its behalf to
 * the SharedThreadRunner
 */
var Job = /** @class */ (function () {
    function Job(thread, fun, args) {
        if (args === void 0) { args = []; }
        this.thread = thread;
        this.fun = fun;
        this.args = args;
    }
    return Job;
}());
exports.Job = Job;
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
var SharedThreadRunner = /** @class */ (function () {
    function SharedThreadRunner(vm, jobs) {
        if (jobs === void 0) { jobs = []; }
        this.vm = vm;
        this.jobs = jobs;
        this._running = false;
    }
    /**
     * enqueue a Job for future execution.
     */
    SharedThreadRunner.prototype.enqueue = function (job) {
        this.jobs.push(job);
        return this;
    };
    /**
     * dequeue all Jobs for the provide thread effectively ending its
     * execution.
     */
    SharedThreadRunner.prototype.dequeue = function (thread) {
        this.jobs = this.jobs.filter(function (job) { return job.thread !== thread; });
    };
    /**
     * postJob enqueues a Job for execution triggering the run() loop immediately
     * if not already running.
     */
    SharedThreadRunner.prototype.postJob = function (job) {
        this.enqueue(job);
        this.run();
    };
    /**
     * run the Job processing loop until there are no more Jobs to process in
     * the queue.
     */
    SharedThreadRunner.prototype.run = function () {
        if (this._running)
            return;
        this._running = true;
        var job;
        while (job = this.jobs.find(function (job) {
            return job.thread.state === __1.THREAD_STATE_IDLE;
        })) {
            var thread = job.thread;
            thread.restore(job);
            while (!array_1.empty(thread.fstack)) {
                var sp = thread.fsp;
                var frame = thread.fstack[sp];
                if (thread.rp != 0)
                    frame.data.push(thread.rp);
                while (!frame.isFinished() &&
                    (thread.state === __1.THREAD_STATE_RUN)) {
                    //execute frame instructions
                    var pos = frame.getPosition();
                    var next = (frame.code[pos] >>> 0);
                    var opcode = next & runtime_1.OPCODE_MASK;
                    var operand = next & runtime_1.OPERAND_MASK;
                    this.vm.logOp(thread, frame, opcode, operand);
                    // TODO: Error if the opcode is invalid, out of range etc.
                    op_1.handlers[opcode](thread, frame, operand);
                    if (pos === frame.getPosition())
                        frame.advance();
                    // frame pointer changed another frame has been pushed
                    // and needs to be executed.
                    if (sp !== thread.fsp)
                        break;
                }
                if (thread.state === __1.THREAD_STATE_WAIT)
                    // Thread is waiting on an async task to complete break out
                    // and handle other threads.
                    break;
                if (sp === thread.fsp)
                    thread.nextFrame(frame.data.pop() || 0);
            }
            if (array_1.empty(thread.fstack))
                // The thread's frame stack is empty, meaning all execution is 
                // complete. Remove the job from the queue.
                this.jobs = array_1.remove(this.jobs, job);
        }
        this._running = false;
    };
    return SharedThreadRunner;
}());
exports.SharedThreadRunner = SharedThreadRunner;
//# sourceMappingURL=runner.js.map
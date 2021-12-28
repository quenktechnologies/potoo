"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedThreadRunner = exports.ExecutionFrame = void 0;
var array_1 = require("@quenk/noni/lib/data/array");
var op_1 = require("../../runtime/op");
var runtime_1 = require("../../runtime");
var __1 = require("../");
/**
 * ExecutionFrame stores the state of the fstack for a VMThread.
 *
 * This is used to both trigger execution of an fstack as well as restore
 * execution in the shared environment. When a VMThread needs to perform an
 * async task for example, it's current state is saved an a new ExecutionFrame
 * is pushed to the runner to continue where it left off.
 */
var ExecutionFrame = /** @class */ (function () {
    function ExecutionFrame(thread, fstack, fsp, rp) {
        if (fstack === void 0) { fstack = []; }
        if (fsp === void 0) { fsp = 0; }
        if (rp === void 0) { rp = 0; }
        this.thread = thread;
        this.fstack = fstack;
        this.fsp = fsp;
        this.rp = rp;
    }
    return ExecutionFrame;
}());
exports.ExecutionFrame = ExecutionFrame;
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
    function SharedThreadRunner(vm, eframes) {
        if (eframes === void 0) { eframes = []; }
        this.vm = vm;
        this.eframes = eframes;
        this._running = false;
    }
    /**
     * enqueue an ExecutionFrame for future execution.
     */
    SharedThreadRunner.prototype.enqueue = function (frame) {
        this.eframes.push(frame);
        return this;
    };
    /**
     * dequeue all ExecutionFrames for the provide thread effectively ending its
     * execution.
     */
    SharedThreadRunner.prototype.dequeue = function (thread) {
        this.eframes = this.eframes.filter(function (frame) { return frame.thread !== thread; });
    };
    SharedThreadRunner.prototype.run = function () {
        if (this._running)
            return;
        this._running = true;
        var eframe;
        while (eframe = this.eframes.find(function (frame) {
            return frame.thread.state === __1.THREAD_STATE_IDLE;
        })) {
            var thread = eframe.thread;
            thread.restore(eframe);
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
                    thread.processNextFrame(frame.data.pop() || 0);
            }
            if (array_1.empty(thread.fstack))
                // The thread's frame stack is empty, meaning all execution is 
                // complete. Remove the eframe from the queue.
                this.eframes = array_1.remove(this.eframes, eframe);
        }
        this._running = false;
    };
    return SharedThreadRunner;
}());
exports.SharedThreadRunner = SharedThreadRunner;
//# sourceMappingURL=runner.js.map
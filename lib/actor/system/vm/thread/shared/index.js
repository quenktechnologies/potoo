"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFrameName = exports.SharedThread = exports.Job = void 0;
const errors = require("../../runtime/error");
const op = require("../../runtime/op");
const future_1 = require("@quenk/noni/lib/control/monad/future");
const array_1 = require("@quenk/noni/lib/data/array");
const maybe_1 = require("@quenk/noni/lib/data/maybe");
const frame_1 = require("../../runtime/stack/frame");
const ledger_1 = require("../../runtime/heap/ledger");
const op_1 = require("../../runtime/op");
const type_1 = require("../../type");
const __1 = require("../");
const runtime_1 = require("../../runtime");
/**
 * Job serves a unit of work a SharedThread needs to execute.
 *
 * Execution of Jobs is intended to be sequential with no Job pre-empting any
 * other with the same thread. For this reason, Jobs are only executed when
 * provided by the scheduler.
 */
class Job {
    constructor(thread, fun, args = []) {
        this.thread = thread;
        this.fun = fun;
        this.args = args;
        /**
         * active indicates if the Job is already active or not.
         *
         * If a Job is active, a new StackFrame is not created.
         */
        this.active = false;
    }
}
exports.Job = Job;
/**
 * SharedThread is used by actors that run in a shared runtime i.e. the single
 * threaded JS event loop.
 *
 * Code execution only takes place when the resume() method is invoked by the
 * SharedScheduler which takes care of managing which Job (and SharedThread)
 * is allowed to run at any point in time.
 */
class SharedThread {
    constructor(vm, script, scheduler, context) {
        this.vm = vm;
        this.script = script;
        this.scheduler = scheduler;
        this.context = context;
        this.fstack = [];
        this.fsp = 0;
        this.rp = 0;
        this.state = __1.THREAD_STATE_IDLE;
    }
    invokeVM(p, f) {
        let frm = new frame_1.StackFrame((0, exports.makeFrameName)(this, f.name), p.script, this, (0, maybe_1.just)(p), f.code.slice());
        for (let i = 0; i < f.argc; i++)
            frm.push(p.pop());
        this.fstack.push(frm);
        this.fsp = this.fstack.length - 1;
        this.scheduler.run();
    }
    invokeForeign(frame, fun, args) {
        //TODO: Support async functions.   
        let val = fun.exec.apply(null, [this, ...args]);
        frame.push(this.vm.heap.intern(frame, val));
        this.scheduler.run();
    }
    wait(task) {
        this.state = __1.THREAD_STATE_WAIT;
        let onError = (e) => {
            this.state = __1.THREAD_STATE_ERROR;
            this.raise(e);
        };
        let onSuccess = () => {
            this.state = __1.THREAD_STATE_IDLE;
            this.scheduler.run(); // Continue execution if stopped.
        };
        task.fork(onError, onSuccess);
    }
    raise(e) {
        this.state = __1.THREAD_STATE_ERROR;
        this.vm.raise(this.context.actor, e);
    }
    die() {
        let that = this;
        this.state = __1.THREAD_STATE_INVALID;
        this.scheduler.dequeue(this);
        return (0, future_1.doFuture)(function* () {
            let ret = that.context.actor.stop();
            if (ret)
                yield ret;
            that.vm.heap.threadExit(that);
            return (0, future_1.pure)(undefined);
        });
    }
    resume(job) {
        this.state = __1.THREAD_STATE_RUN;
        if (!job.active) {
            job.active = true;
            let { fun, args } = job;
            let frame = new frame_1.StackFrame((0, exports.makeFrameName)(this, fun.name), this.script, this, (0, maybe_1.nothing)(), fun.foreign ?
                [op.LDN | this.script.info.indexOf(fun), op.CALL] :
                fun.code.slice());
            frame.data = args.map(arg => (0, ledger_1.isHeapAddress)(arg) ?
                this.vm.heap.move(arg, frame.name)
                : arg);
            this.fstack = [frame];
            this.fsp = 0;
            this.rp = 0;
        }
        while (!(0, array_1.empty)(this.fstack)) {
            let sp = this.fsp;
            let frame = this.fstack[sp];
            if (this.rp != 0)
                frame.data.push(this.rp);
            while (!frame.isFinished() &&
                (this.state === __1.THREAD_STATE_RUN)) {
                // execute frame instructions
                let pos = frame.getPosition();
                let next = (frame.code[pos] >>> 0);
                let opcode = next & runtime_1.OPCODE_MASK;
                let operand = next & runtime_1.OPERAND_MASK;
                this.vm.log.opcode(this, frame, opcode, operand);
                // TODO: Error if the opcode is invalid, out of range etc.
                op_1.handlers[opcode](this, frame, operand);
                if (pos === frame.getPosition())
                    frame.advance();
                // frame pointer changed, another frame has been pushed
                // and needs to be executed.
                if (sp !== this.fsp)
                    break;
            }
            // If this is true, give other threads a chance to execute while we
            // wait on an async task to complete.
            if (this.state === __1.THREAD_STATE_WAIT)
                return;
            // Handle the next frame.
            if (sp === this.fsp) {
                this.vm.heap.frameExit(this.fstack.pop());
                this.fsp--;
                this.rp = frame.data.pop();
            }
        }
        this.state = __1.THREAD_STATE_IDLE;
    }
    exec(name, args = []) {
        let { script } = this;
        let fun = script.info.find(info => (info.name === name) && (info.descriptor === type_1.TYPE_FUN));
        if (!fun)
            return this.raise(new errors.UnknownFunErr(name));
        this.scheduler.postJob(new Job(this, fun, args));
    }
}
exports.SharedThread = SharedThread;
/**
 * makeFrameName produces a suitable name for a Frame given its function
 * name.
 */
const makeFrameName = (thread, funName) => (0, array_1.empty)(thread.fstack) ?
    `${thread.context.template.id}@${thread.context.aid}#${funName}` :
    `${(0, array_1.tail)(thread.fstack).name}/${funName}`;
exports.makeFrameName = makeFrameName;
//# sourceMappingURL=index.js.map
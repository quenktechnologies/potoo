"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("./error");
var array_1 = require("@quenk/noni/lib/data/array");
var record_1 = require("@quenk/noni/lib/data/record");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var either_1 = require("@quenk/noni/lib/data/either");
var address_1 = require("../../../address");
var frame_1 = require("./stack/frame");
var op_1 = require("./op");
var _1 = require("./");
/**
 * Thread is the Runtime implementation for exactly one actor.
 */
var Thread = /** @class */ (function () {
    function Thread(vm, heap, context, fstack, rstack, sp) {
        if (fstack === void 0) { fstack = []; }
        if (rstack === void 0) { rstack = []; }
        if (sp === void 0) { sp = 0; }
        this.vm = vm;
        this.heap = heap;
        this.context = context;
        this.fstack = fstack;
        this.rstack = rstack;
        this.sp = sp;
    }
    Thread.prototype.raise = function (e) {
        this.vm.raise(this.context.address, e);
    };
    Thread.prototype.invokeVM = function (p, f) {
        var frm = new frame_1.StackFrame(f.name, p.script, this.context, this.heap, f.code.slice());
        for (var i = 0; i <= f.argc; i++)
            frm.push(p.pop());
        this.fstack.push(frm);
        this.sp = this.fstack.length - 1;
    };
    Thread.prototype.invokeForeign = function (p, f, args) {
        //TODO: Support async functions.   
        var val = f.exec.apply(null, __spreadArrays([this], args));
        p.push(this.heap.getAddress(val));
    };
    Thread.prototype.terminate = function () {
        var _this = this;
        var current = this.context.address;
        var maybeChilds = this.vm.getChildren(current);
        if (maybeChilds.isJust()) {
            var childs = maybeChilds.get();
            record_1.map(childs, function (c, k) {
                //TODO: async support
                c.context.actor.stop();
                _this.vm.remove(k);
            });
        }
        this.heap.release();
        this.vm.remove(current);
        //TODO: async support
        this.context.actor.stop();
    };
    Thread.prototype.kill = function (target) {
        var _this = this;
        var self = this.context.address;
        var addrs = address_1.isGroup(target) ?
            this.vm.getGroup(target).orJust(function () { return []; }).get() : [target];
        var ret = addrs.reduce(function (p, c) {
            if (p.isLeft())
                return p;
            if ((!address_1.isChild(self, c)) && (c !== self))
                return either_1.left(new errors.IllegalStopErr(target, c));
            _this.vm.kill(c);
            return p;
        }, either_1.right(undefined));
        this.terminate();
        return ret;
    };
    Thread.prototype.exec = function (s) {
        this.fstack.push(new frame_1.StackFrame('main', s, this.context, this.heap, s.code.slice()));
        return this.run();
    };
    Thread.prototype.runTask = function (ft) {
        return this.vm.runTask(this.context.address, ft);
    };
    Thread.prototype.run = function () {
        var ret = maybe_1.nothing();
        while (!array_1.empty(this.fstack)) {
            var sp = this.sp;
            var frame = this.fstack[sp];
            if (!array_1.empty(this.rstack))
                frame.data.push(this.rstack.pop());
            while (frame.ip < frame.code.length) {
                //execute frame instructions
                //TODO: Push return values unto next fstack
                var next = (frame.code[frame.ip] >>> 0);
                var opcode = next & _1.OPCODE_MASK;
                var operand = next & _1.OPERAND_MASK;
                this.vm.logOp(this, frame, opcode, operand);
                // TODO: Error if the opcode is invalid, out of range etc.
                op_1.handlers[opcode](this, frame, operand);
                frame.ip = frame.ip + 1;
                //pause execution to allow another frame to compute.
                if (sp !== this.sp)
                    break;
            }
            if (sp === this.sp) {
                //frame complete, pop it, advance the sp and push the return
                //value onto the rstack.
                this.fstack.pop();
                this.sp--;
                this.rstack.push(frame.data.pop());
                if (array_1.empty(this.fstack)) {
                    //provide the TOS value from the rstack to the caller.
                    ret = frame.resolve(array_1.tail(this.rstack)).toMaybe();
                }
            }
        }
        this.heap.release();
        this.sp = 0;
        return ret;
    };
    return Thread;
}());
exports.Thread = Thread;
//# sourceMappingURL=thread.js.map
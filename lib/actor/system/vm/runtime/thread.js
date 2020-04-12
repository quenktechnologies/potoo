"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("./error");
var array_1 = require("@quenk/noni/lib/data/array");
var record_1 = require("@quenk/noni/lib/data/record");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var either_1 = require("@quenk/noni/lib/data/either");
var frame_1 = require("./stack/frame");
var op_1 = require("./op");
var heap_1 = require("./heap");
var _1 = require("./");
var address_1 = require("../../../address");
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
        //TODO: 
        // 1) Note the type of the heap entry is the function type.
        //    We should add some plumbing for strings, numbers etc.
        // 2) Support async functions.   
        p.push(this.heap.add(new heap_1.HeapEntry(f.type, f.builtin, f.exec.apply(null, args))));
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
    Thread.prototype.run = function (s) {
        var ret = maybe_1.nothing();
        this.fstack.push(new frame_1.StackFrame('main', s, this.context, this.heap, s.code.slice()));
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
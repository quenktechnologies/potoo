"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("@quenk/noni/lib/data/array");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var frame_1 = require("./stack/frame");
var op_1 = require("./op");
var heap_1 = require("./heap");
var _1 = require("./");
/**
 * Thread is the Runtime implementation for exactly one actor.
 */
var Thread = /** @class */ (function () {
    function Thread(vm, heap, context, self, fstack, rstack, sp) {
        if (fstack === void 0) { fstack = []; }
        if (sp === void 0) { sp = 0; }
        this.vm = vm;
        this.heap = heap;
        this.context = context;
        this.self = self;
        this.fstack = fstack;
        this.rstack = rstack;
        this.sp = sp;
    }
    Thread.prototype.raise = function (_) {
    };
    Thread.prototype.invokeMain = function (s) {
        this.fstack.push(new frame_1.StackFrame('main', s, this.context, this.heap, s.code.slice()));
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
    Thread.prototype.run = function () {
        var ret = maybe_1.nothing();
        console.error('is it empty ? ', array_1.empty(this.fstack));
        while (!array_1.empty(this.fstack)) {
            var sp = this.sp;
            var frame = this.fstack[sp];
            if (!array_1.empty(this.rstack))
                frame.data.push(this.rstack.pop());
            console.error('frame ip ', frame.ip, frame.code);
            while (frame.ip < frame.code.length) {
                //execute frame instructions
                //TODO: Push return values unto next fstack
                var next = (frame.code[frame.ip] >>> 0);
                var opcode = next & _1.OPCODE_MASK;
                var operand = next & _1.OPERAND_MASK;
                // TODO: Error if the opcode is invalid, out of range etc.
                op_1.handlers[opcode](this, frame, operand);
                frame.ip++;
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
                    ret = frame.popValue().toMaybe();
                }
            }
        }
        return ret;
    };
    return Thread;
}());
exports.Thread = Thread;
//# sourceMappingURL=thread.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("@quenk/noni/lib/data/array");
var frame_1 = require("./stack/frame");
var op_1 = require("./op");
var heap_1 = require("./heap");
var _1 = require("./");
/**
 * Proc is a Runtime implementation for exactly one actor.
 */
var Proc = /** @class */ (function () {
    function Proc(vm, heap, context, self, stack, sp) {
        if (stack === void 0) { stack = []; }
        if (sp === void 0) { sp = 0; }
        this.vm = vm;
        this.heap = heap;
        this.context = context;
        this.self = self;
        this.stack = stack;
        this.sp = sp;
    }
    Proc.prototype.raise = function (_) {
    };
    Proc.prototype.call = function (c, f, args) {
        if (f.foreign) {
            //Todo: Note the type of the heap entry is the function type.
            //We should add some plumbing for strings, numbers etc.
            c.push(this.heap.add(new heap_1.HeapEntry(f.type, f.builtin, f.exec.apply(null, args))));
        }
        else {
            this.stack.push(new frame_1.StackFrame(f.name, c.script, this.context, this.heap, f.code.slice()));
            this.sp = this.stack.length - 1;
        }
    };
    Proc.prototype.run = function () {
        while (!array_1.empty(this.stack)) {
            var sp = this.sp;
            var frame = this.stack[sp];
            while (frame.ip < frame.code.length) {
                //execute frame instructions
                //TODO: Push return values unto next stack
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
                //frame complete, pop it, advance the sp and pass any return
                //value to the previous frame.
                this.stack.pop();
                this.sp--;
                if (frame.rdata.length > 0)
                    if (this.stack[this.sp])
                        this.stack[this.sp].data.push(frame.rdata.pop());
            }
        }
    };
    return Proc;
}());
exports.Proc = Proc;
//# sourceMappingURL=proc.js.map
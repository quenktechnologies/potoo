"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("@quenk/noni/lib/data/array");
var frame_1 = require("./stack/frame");
var op_1 = require("./op");
var heap_1 = require("./heap");
exports.OPCODE_MASK = 0xFF000000;
exports.OPERAND_MASK = 0x00FFFFFF;
exports.OPCODE_RANGE_START = 0x1000000;
exports.OPCODE_RANGE_END = 0x7F000000;
exports.OPERAND_RANGE_START = 0x0;
exports.OPERAND_RANGE_END = 0xffffff;
exports.MAX_INSTRUCTION = 0x7FFFFFFF;
/**
 * This is a Runtime implementation for exactly one actor.
 */
var This = /** @class */ (function () {
    function This(vm, heap, context, self, stack, sp) {
        if (stack === void 0) { stack = []; }
        if (sp === void 0) { sp = 0; }
        this.vm = vm;
        this.heap = heap;
        this.context = context;
        this.self = self;
        this.stack = stack;
        this.sp = sp;
    }
    This.prototype.raise = function (_) {
    };
    This.prototype.exec = function (c, f, args) {
        if (f.foreign) {
            //Todo: Note the type of the heap entry is the function type.
            //We should add some plumbing for strings, numbers etc.
            c.push(this.heap.add(new heap_1.HeapEntry(f.type, f.builtin, f.exec.apply(null, args))));
        }
        else {
            this.stack.push(new frame_1.Frame(f.name, c.script, this.context, this.heap, f.code.slice()));
            this.sp = this.stack.length - 1;
        }
    };
    This.prototype.run = function () {
        while (!array_1.empty(this.stack)) {
            var sp = this.sp;
            var frame = this.stack[sp];
            while (frame.ip < frame.code.length) {
                //execute frame instructions
                //TODO: Push return values unto next stack
                var next = frame.code[frame.ip];
                var opcode = next & exports.OPCODE_MASK;
                var operand = next & exports.OPERAND_MASK;
                // TODO: Error if the opcode is invalid, out of rangeetc.
                op_1.handlers[opcode](this, frame, operand);
                frame.ip++;
                //pause execution to allow another frame to compute.
                if (sp !== this.sp)
                    break;
            }
            //frame complete, pop it, advance the sp and pass any return value
            //to the previous frame.
            if (sp === this.sp) {
                this.stack.pop();
                this.sp--;
                if (frame.rdata.length > 0)
                    if (this.stack[this.sp])
                        this.stack[this.sp].data.push(frame.rdata.pop());
            }
        }
    };
    return This;
}());
exports.This = This;
//# sourceMappingURL=index.js.map
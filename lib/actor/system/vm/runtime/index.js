"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var array_1 = require("@quenk/noni/lib/data/array");
var context_1 = require("../../../context");
var state_1 = require("../../state");
var op_1 = require("./op");
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
    function This(vm, self, stack) {
        if (stack === void 0) { stack = []; }
        this.vm = vm;
        this.self = self;
        this.stack = stack;
    }
    This.prototype.raise = function (_) {
        //TODO: implement
    };
    This.prototype.allocate = function (addr, t) {
        var h = new This(this.vm, addr);
        var args = Array.isArray(t.args) ? t.args : [];
        var act = t.create.apply(t, __spreadArrays([this.vm.system], args));
        //TODO: review instance init.
        return context_1.newContext(h, act, t);
    };
    This.prototype.getContext = function (addr) {
        return state_1.get(this.vm.state, addr);
    };
    This.prototype.putContext = function (addr, ctx) {
        this.vm.state = state_1.put(this.vm.state, addr, ctx);
        return this;
    };
    This.prototype.putRoute = function (target, router) {
        state_1.putRoute(this.vm.state, target, router);
        return this;
    };
    This.prototype.putMember = function (group, addr) {
        state_1.putMember(this.vm.state, group, addr);
        return this;
    };
    This.prototype.run = function () {
        while (!array_1.empty(this.stack)) {
            var frame = this.stack.pop();
            while (frame.ip !== frame.code.length) {
                //execute frame instructions
                //TODO: Push return values unto next stack
                var next = frame.code[frame.ip];
                var opcode = next & exports.OPCODE_MASK;
                var operand = next & exports.OPERAND_MASK;
                // TODO: Error if the opcode is invalid, out of rangeetc.
                op_1.opcodeHandlers[opcode](this, frame, operand);
                frame.ip++;
            }
        }
    };
    return This;
}());
exports.This = This;
//# sourceMappingURL=index.js.map
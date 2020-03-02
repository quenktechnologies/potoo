"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var push = require("./push");
var alloc = require("./alloc");
exports.OP_NOP = 0x0;
exports.OP_PUSHUI8 = 0x1;
exports.OP_PUSHUI16 = 0x2;
exports.OP_PUSHSTR = 0x3;
exports.OP_PUSHTMPL = 0x4;
exports.OP_ALLOC = 0x20;
/**
 * opcodeHandlers
 */
exports.opcodeHandlers = (_a = {},
    _a[exports.OP_PUSHUI8] = push.pushui8,
    _a[exports.OP_PUSHUI16] = push.pushui16,
    _a[exports.OP_PUSHSTR] = push.pushstr,
    _a[exports.OP_PUSHTMPL] = push.pushtmpl,
    _a[exports.OP_ALLOC] = alloc.alloc,
    _a);
//# sourceMappingURL=index.js.map
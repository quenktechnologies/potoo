"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var base = require("./base");
var jump = require("./jump");
var actor = require("./actor");
exports.OP_CODE_RANGE_LOW = 0x1000000;
exports.OP_CODE_RANGE_HIGH = 0xff000000;
exports.OP_CODE_RANGE_STEP = 0x1000000;
//NOTE: these can only be one of the highest byte in a 32 bit number.
exports.NOP = exports.OP_CODE_RANGE_STEP;
exports.PUSHUI8 = exports.OP_CODE_RANGE_STEP * 2;
exports.PUSHUI16 = exports.OP_CODE_RANGE_STEP * 3;
exports.PUSHUI32 = exports.OP_CODE_RANGE_STEP * 4;
exports.PUSHSTR = exports.OP_CODE_RANGE_STEP * 5;
exports.LDN = exports.OP_CODE_RANGE_STEP * 6;
exports.DUP = exports.OP_CODE_RANGE_HIGH * 15;
exports.STORE = exports.OP_CODE_RANGE_STEP * 16;
exports.LOAD = exports.OP_CODE_RANGE_STEP * 20;
exports.CEQ = exports.OP_CODE_RANGE_STEP * 42;
exports.ADDUI32 = exports.OP_CODE_RANGE_STEP * 52;
exports.CALL = exports.OP_CODE_RANGE_STEP * 62;
exports.RAISE = exports.OP_CODE_RANGE_STEP * 63;
exports.JMP = exports.OP_CODE_RANGE_STEP * 72;
exports.IFZJMP = exports.OP_CODE_RANGE_STEP * 73;
exports.IFNZJMP = exports.OP_CODE_RANGE_STEP * 80;
exports.IFEQJMP = exports.OP_CODE_RANGE_STEP * 81;
exports.IFNEQJMP = exports.OP_CODE_RANGE_STEP * 82;
exports.ALLOC = exports.OP_CODE_RANGE_STEP * 92;
exports.RUN = exports.OP_CODE_RANGE_STEP * 93;
exports.SEND = exports.OP_CODE_RANGE_STEP * 94;
exports.RECV = exports.OP_CODE_RANGE_STEP * 95;
exports.RECVCOUNT = exports.OP_CODE_RANGE_STEP * 96;
exports.MAILCOUNT = exports.OP_CODE_RANGE_STEP * 97;
exports.MAILDQ = exports.OP_CODE_RANGE_STEP * 98;
exports.SELF = exports.OP_CODE_RANGE_STEP * 99;
exports.READ = exports.OP_CODE_RANGE_STEP * 100;
exports.STOP = exports.OP_CODE_RANGE_STEP * 101;
/**
 * handlers for the supported op codes.
 */
exports.handlers = (_a = {},
    _a[exports.NOP] = base.nop,
    _a[exports.PUSHUI8] = base.pushui8,
    _a[exports.PUSHUI16] = base.pushui16,
    _a[exports.PUSHUI32] = base.pushui32,
    _a[exports.PUSHSTR] = base.pushstr,
    _a[exports.LDN] = base.ldn,
    _a[exports.DUP] = base.dup,
    _a[exports.STORE] = base.store,
    _a[exports.LOAD] = base.load,
    _a[exports.CEQ] = base.ceq,
    _a[exports.ADDUI32] = base.addui32,
    _a[exports.CALL] = base.call,
    _a[exports.RAISE] = base.raise,
    _a[exports.JMP] = jump.jmp,
    _a[exports.IFZJMP] = jump.ifzjmp,
    _a[exports.IFNZJMP] = jump.ifnzjmp,
    _a[exports.IFEQJMP] = jump.ifeqjmp,
    _a[exports.IFNEQJMP] = jump.ifneqjmp,
    _a[exports.ALLOC] = actor.alloc,
    _a[exports.RUN] = actor.run,
    _a[exports.SEND] = actor.send,
    _a[exports.RECV] = actor.recv,
    _a[exports.RECVCOUNT] = actor.recvcount,
    _a[exports.MAILCOUNT] = actor.mailcount,
    _a[exports.MAILDQ] = actor.maildq,
    _a[exports.SELF] = actor.self,
    _a[exports.READ] = actor.read,
    _a[exports.STOP] = actor.stop,
    _a);
//# sourceMappingURL=index.js.map
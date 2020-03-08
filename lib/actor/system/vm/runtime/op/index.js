"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var base = require("./base");
var jump = require("./jump");
var actor = require("./actor");
//NOTE: these can only be one of the highest byte in a 32 bit number.
exports.NOP = 0x0;
exports.PUSHUI8 = 0x1;
exports.PUSHUI16 = 0x2;
exports.PUSHUI32 = 0x3;
exports.PUSHSTR = 0x4;
exports.PUSHSYM = 0x5;
exports.DUP = 0x15;
exports.STORE = 0x16;
exports.LOAD = 0x20;
exports.CEQ = 0x2a;
exports.ADDUI32 = 0x34;
exports.CALL = 0x3e;
exports.RET = 0x3f;
exports.JMP = 0x48;
exports.IFZJMP = 0x49;
exports.IFNZJMP = 0x50;
exports.IFEQJMP = 0x51;
exports.IFNEQJMP = 0x52;
exports.ALLOC = 0x5c;
exports.RUN = 0x5d;
exports.SEND = 0x5e;
exports.RECV = 0x5f;
exports.RECVCOUNT = 0x60;
exports.MAILCOUNT = 0x62;
exports.PUSHMAIL = 0x63;
/**
 * handlers for the supported op codes.
 */
exports.handlers = (_a = {},
    _a[exports.NOP] = base.nop,
    _a[exports.PUSHUI8] = base.pushui8,
    _a[exports.PUSHUI16] = base.pushui16,
    _a[exports.PUSHUI32] = base.pushui32,
    _a[exports.PUSHSTR] = base.pushstr,
    _a[exports.PUSHSYM] = base.pushsym,
    _a[exports.DUP] = base.dup,
    _a[exports.STORE] = base.store,
    _a[exports.LOAD] = base.load,
    _a[exports.CEQ] = base.ceq,
    _a[exports.ADDUI32] = base.addui32,
    _a[exports.CALL] = base.call,
    _a[exports.RET] = base.ret,
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
    _a[exports.PUSHMAIL] = actor.pushmsg,
    _a);
//# sourceMappingURL=index.js.map
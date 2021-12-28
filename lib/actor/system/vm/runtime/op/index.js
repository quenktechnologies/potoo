"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLog = exports.toName = exports.handlers = exports.opcodes = exports.ARELM = exports.ARLENGTH = exports.GETPROP = exports.STOP = exports.SELF = exports.MAILDQ = exports.MAILCOUNT = exports.RECVCOUNT = exports.RECV = exports.SEND = exports.ALLOC = exports.IFNEQJMP = exports.IFEQJMP = exports.IFNZJMP = exports.IFZJMP = exports.JMP = exports.RAISE = exports.CALL = exports.ADDUI32 = exports.CEQ = exports.LOAD = exports.STORE = exports.DUP = exports.LDN = exports.LDS = exports.PUSHUI32 = exports.PUSHUI16 = exports.PUSHUI8 = exports.NOP = exports.OP_CODE_RANGE_STEP = exports.OP_CODE_RANGE_HIGH = exports.OP_CODE_RANGE_LOW = void 0;
var base = require("./base");
var actor = require("./actor");
var obj = require("./object");
var record_1 = require("@quenk/noni/lib/data/record");
var frame_1 = require("../stack/frame");
exports.OP_CODE_RANGE_LOW = 0x1000000;
exports.OP_CODE_RANGE_HIGH = 0xff000000;
exports.OP_CODE_RANGE_STEP = 0x1000000;
//NOTE: these can only be one of the highest byte in a 32 bit number.
exports.NOP = exports.OP_CODE_RANGE_STEP;
exports.PUSHUI8 = exports.OP_CODE_RANGE_STEP * 2;
exports.PUSHUI16 = exports.OP_CODE_RANGE_STEP * 3;
exports.PUSHUI32 = exports.OP_CODE_RANGE_STEP * 4;
exports.LDS = exports.OP_CODE_RANGE_STEP * 5;
exports.LDN = exports.OP_CODE_RANGE_STEP * 6;
exports.DUP = exports.OP_CODE_RANGE_STEP * 15;
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
exports.SEND = exports.OP_CODE_RANGE_STEP * 94;
exports.RECV = exports.OP_CODE_RANGE_STEP * 95;
exports.RECVCOUNT = exports.OP_CODE_RANGE_STEP * 96;
exports.MAILCOUNT = exports.OP_CODE_RANGE_STEP * 97;
exports.MAILDQ = exports.OP_CODE_RANGE_STEP * 98;
exports.SELF = exports.OP_CODE_RANGE_STEP * 99;
exports.STOP = exports.OP_CODE_RANGE_STEP * 101;
exports.GETPROP = exports.OP_CODE_RANGE_STEP * 110;
exports.ARLENGTH = exports.OP_CODE_RANGE_STEP * 111;
exports.ARELM = exports.OP_CODE_RANGE_STEP * 112;
/**
 * opcodes
 */
exports.opcodes = (_a = {},
    _a[exports.NOP] = {
        name: 'nop',
        handler: base.nop,
        log: function () { return ['nop']; }
    },
    _a[exports.PUSHUI8] = {
        name: 'pushui8',
        handler: base.pushui8,
        log: function (_, __, oper) { return ['pushui8', oper]; }
    },
    _a[exports.PUSHUI16] = {
        name: 'pushui16',
        handler: base.pushui16,
        log: function (_, __, oper) { return ['pushui16', oper]; }
    },
    _a[exports.PUSHUI32] = {
        name: 'pushui32',
        handler: base.pushui32,
        log: function (_, __, oper) { return ['pushui32', oper]; }
    },
    _a[exports.LDS] = {
        name: 'lds',
        handler: base.lds,
        log: function (_, f, oper) {
            return ['lds', oper, eToLog(f.resolve(frame_1.DATA_TYPE_STRING | oper))];
        }
    },
    _a[exports.LDN] = {
        name: 'ldn',
        handler: base.ldn,
        log: function (_, f, oper) {
            return ['ldn', oper, eToLog(f.resolve(frame_1.DATA_TYPE_INFO | oper))];
        }
    },
    _a[exports.DUP] = {
        name: 'dup',
        handler: base.dup,
        log: function (_, __, ___) { return ['dup']; }
    },
    _a[exports.STORE] = {
        name: 'store',
        handler: base.store,
        log: function (_, __, oper) {
            return ['store', oper];
        }
    },
    _a[exports.LOAD] = {
        name: 'load',
        handler: base.load,
        log: function (_, f, oper) {
            return ['load', oper, eToLog(f.resolve(frame_1.DATA_TYPE_LOCAL | oper))];
        }
    },
    _a[exports.CEQ] = {
        name: 'ceq',
        handler: base.ceq,
        log: function (_, __, ___) { return ['ceq']; }
    },
    _a[exports.ADDUI32] = {
        name: 'addui32',
        handler: base.addui32,
        log: function (_, __, ___) { return ['addui32']; }
    },
    _a[exports.CALL] = {
        name: 'call',
        handler: base.call,
        log: function (_, __, ___) { return ['call']; }
    },
    _a[exports.RAISE] = {
        name: 'raise',
        handler: base.raise,
        log: function (_, __, ___) { return ['raise']; }
    },
    _a[exports.JMP] = {
        name: 'jmp',
        handler: base.jmp,
        log: function (_, __, oper) { return ['jmp', oper]; }
    },
    _a[exports.IFZJMP] = {
        name: 'ifzjmp',
        handler: base.ifzjmp,
        log: function (_, __, oper) { return ['ifzjmp', oper]; }
    },
    _a[exports.IFNZJMP] = {
        name: 'ifnzjmp',
        handler: base.ifnzjmp,
        log: function (_, __, oper) { return ['ifnzjmp', oper]; }
    },
    _a[exports.IFEQJMP] = {
        name: 'ifeqjmp',
        handler: base.ifeqjmp,
        log: function (_, __, oper) { return ['ifeqjmp', oper]; }
    },
    _a[exports.IFNEQJMP] = {
        name: 'ifneqjmp',
        handler: base.ifneqjmp,
        log: function (_, __, oper) { return ['ifneqjmp', oper]; }
    },
    _a[exports.ALLOC] = {
        name: 'alloc',
        handler: actor.alloc,
        log: function (_, __, ___) { return ['alloc']; }
    },
    _a[exports.SEND] = {
        name: 'send',
        handler: actor.send,
        log: function (_, __, ___) { return ['send']; }
    },
    _a[exports.RECV] = {
        name: 'recv',
        handler: actor.recv,
        log: function (_, f, oper) {
            return ['recv', oper, eToLog(f.resolve(frame_1.DATA_TYPE_INFO | oper))];
        }
    },
    _a[exports.RECVCOUNT] = {
        name: 'recvcount',
        handler: actor.recvcount,
        log: function (_, __, ___) { return ['recvcount']; }
    },
    _a[exports.MAILCOUNT] = {
        name: 'mailcount',
        handler: actor.mailcount,
        log: function (_, __, ___) { return ['mailcount']; }
    },
    _a[exports.MAILDQ] = {
        name: 'maildq',
        handler: actor.maildq,
        log: function (_, __, ___) { return ['maildq']; }
    },
    _a[exports.SELF] = {
        name: 'self',
        handler: actor.self,
        log: function (_, __, ___) { return ['self']; }
    },
    _a[exports.STOP] = {
        name: 'stop',
        handler: actor.stop,
        log: function (_, __, ___) { return ['stop']; }
    },
    _a[exports.GETPROP] = {
        name: 'getprop',
        handler: obj.getprop,
        log: function (_, __, oper) { return ['getprop', oper]; }
    },
    _a[exports.ARELM] = {
        name: 'arelm',
        handler: obj.arelm,
        log: function (_, __, oper) { return ['arelm', oper]; }
    },
    _a[exports.ARLENGTH] = {
        name: 'arlength',
        handler: obj.arlength,
        log: function (_, __, ___) { return ['arlength']; }
    },
    _a);
var eToLog = function (e) { return e.isLeft() ?
    e.takeLeft().message : e.takeRight(); };
/**
 * handlers maps opcode numbers to their handler
 */
exports.handlers = record_1.map(exports.opcodes, function (i) { return i.handler; });
/**
 * toName converts an opcode to it's mnemonic.
 */
exports.toName = function (op) { return exports.opcodes.hasOwnProperty(op) ?
    exports.opcodes[op].name : '<unknown>'; };
/**
 * toLog provides a log line for an op.
 *
 * If the op is invalid an empty line is produced.
 */
exports.toLog = function (op, r, f, oper) {
    return exports.opcodes.hasOwnProperty(op) ? exports.opcodes[op].log(r, f, oper) : [];
};
//# sourceMappingURL=index.js.map
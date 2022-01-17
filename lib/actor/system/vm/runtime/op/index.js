"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toLog = exports.toName = exports.handlers = exports.opcodes = exports.ARELM = exports.ARLENGTH = exports.GETPROP = exports.STOP = exports.SELF = exports.MAILDQ = exports.MAILCOUNT = exports.RECVCOUNT = exports.RECV = exports.SEND = exports.ALLOC = exports.IFNEQJMP = exports.IFEQJMP = exports.IFNZJMP = exports.IFZJMP = exports.JMP = exports.RAISE = exports.CALL = exports.ADDUI32 = exports.CEQ = exports.LOAD = exports.STORE = exports.DUP = exports.LDN = exports.LDS = exports.PUSHUI32 = exports.PUSHUI16 = exports.PUSHUI8 = exports.NOP = exports.OP_CODE_RANGE_STEP = exports.OP_CODE_RANGE_HIGH = exports.OP_CODE_RANGE_LOW = void 0;
const base = require("./base");
const actor = require("./actor");
const obj = require("./object");
const record_1 = require("@quenk/noni/lib/data/record");
const frame_1 = require("../stack/frame");
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
exports.opcodes = {
    [exports.NOP]: {
        name: 'nop',
        handler: base.nop,
        log: () => ['nop']
    },
    [exports.PUSHUI8]: {
        name: 'pushui8',
        handler: base.pushui8,
        log: (_, __, oper) => ['pushui8', oper]
    },
    [exports.PUSHUI16]: {
        name: 'pushui16',
        handler: base.pushui16,
        log: (_, __, oper) => ['pushui16', oper]
    },
    [exports.PUSHUI32]: {
        name: 'pushui32',
        handler: base.pushui32,
        log: (_, __, oper) => ['pushui32', oper]
    },
    [exports.LDS]: {
        name: 'lds',
        handler: base.lds,
        log: (_, f, oper) => ['lds', oper, eToLog(f.resolve(frame_1.DATA_TYPE_STRING | oper))]
    },
    [exports.LDN]: {
        name: 'ldn',
        handler: base.ldn,
        log: (_, f, oper) => ['ldn', oper, eToLog(f.resolve(frame_1.DATA_TYPE_INFO | oper))]
    },
    [exports.DUP]: {
        name: 'dup',
        handler: base.dup,
        log: (_, __, ___) => ['dup']
    },
    [exports.STORE]: {
        name: 'store',
        handler: base.store,
        log: (_, __, oper) => ['store', oper]
    },
    [exports.LOAD]: {
        name: 'load',
        handler: base.load,
        log: (_, f, oper) => ['load', oper, eToLog(f.resolve(frame_1.DATA_TYPE_LOCAL | oper))]
    },
    [exports.CEQ]: {
        name: 'ceq',
        handler: base.ceq,
        log: (_, __, ___) => ['ceq']
    },
    [exports.ADDUI32]: {
        name: 'addui32',
        handler: base.addui32,
        log: (_, __, ___) => ['addui32']
    },
    [exports.CALL]: {
        name: 'call',
        handler: base.call,
        log: (_, __, ___) => ['call']
    },
    [exports.RAISE]: {
        name: 'raise',
        handler: base.raise,
        log: (_, __, ___) => ['raise']
    },
    [exports.JMP]: {
        name: 'jmp',
        handler: base.jmp,
        log: (_, __, oper) => ['jmp', oper]
    },
    [exports.IFZJMP]: {
        name: 'ifzjmp',
        handler: base.ifzjmp,
        log: (_, __, oper) => ['ifzjmp', oper]
    },
    [exports.IFNZJMP]: {
        name: 'ifnzjmp',
        handler: base.ifnzjmp,
        log: (_, __, oper) => ['ifnzjmp', oper]
    },
    [exports.IFEQJMP]: {
        name: 'ifeqjmp',
        handler: base.ifeqjmp,
        log: (_, __, oper) => ['ifeqjmp', oper]
    },
    [exports.IFNEQJMP]: {
        name: 'ifneqjmp',
        handler: base.ifneqjmp,
        log: (_, __, oper) => ['ifneqjmp', oper]
    },
    [exports.ALLOC]: {
        name: 'alloc',
        handler: actor.alloc,
        log: (_, __, ___) => ['alloc']
    },
    [exports.SEND]: {
        name: 'send',
        handler: actor.send,
        log: (_, __, ___) => ['send']
    },
    [exports.RECV]: {
        name: 'recv',
        handler: actor.recv,
        log: (_, f, oper) => ['recv', oper, eToLog(f.resolve(frame_1.DATA_TYPE_INFO | oper))]
    },
    [exports.RECVCOUNT]: {
        name: 'recvcount',
        handler: actor.recvcount,
        log: (_, __, ___) => ['recvcount']
    },
    [exports.MAILCOUNT]: {
        name: 'mailcount',
        handler: actor.mailcount,
        log: (_, __, ___) => ['mailcount']
    },
    [exports.MAILDQ]: {
        name: 'maildq',
        handler: actor.maildq,
        log: (_, __, ___) => ['maildq']
    },
    [exports.SELF]: {
        name: 'self',
        handler: actor.self,
        log: (_, __, ___) => ['self']
    },
    [exports.STOP]: {
        name: 'stop',
        handler: actor.stop,
        log: (_, __, ___) => ['stop']
    },
    [exports.GETPROP]: {
        name: 'getprop',
        handler: obj.getprop,
        log: (_, __, oper) => ['getprop', oper]
    },
    [exports.ARELM]: {
        name: 'arelm',
        handler: obj.arelm,
        log: (_, __, oper) => ['arelm', oper]
    },
    [exports.ARLENGTH]: {
        name: 'arlength',
        handler: obj.arlength,
        log: (_, __, ___) => ['arlength']
    }
};
const eToLog = (e) => e.isLeft() ?
    e.takeLeft().message : e.takeRight();
/**
 * handlers maps opcode numbers to their handler
 */
exports.handlers = (0, record_1.map)(exports.opcodes, i => i.handler);
/**
 * toName converts an opcode to it's mnemonic.
 */
const toName = (op) => exports.opcodes.hasOwnProperty(op) ?
    exports.opcodes[op].name : '<unknown>';
exports.toName = toName;
/**
 * toLog provides a log line for an op.
 *
 * If the op is invalid an empty line is produced.
 */
const toLog = (op, r, f, oper) => exports.opcodes.hasOwnProperty(op) ? exports.opcodes[op].log(r, f, oper) : [];
exports.toLog = toLog;
//# sourceMappingURL=index.js.map
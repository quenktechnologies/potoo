import * as base from './base';
import * as actor from './actor';
import * as obj from './object';

import { Record, map } from '@quenk/noni/lib/data/record';
import { Either } from '@quenk/noni/lib/data/either';
import { Err } from '@quenk/noni/lib/control/error';
import { Type } from '@quenk/noni/lib/data/type';

import {
    Frame,
    DATA_TYPE_INFO,
    DATA_TYPE_STRING,
    DATA_TYPE_LOCAL
} from '../stack/frame';
import { PTValue } from '../../type';
import { VMThread } from '../../thread';
import { Operand } from '../';

export const OP_CODE_RANGE_LOW = 0x1000000;
export const OP_CODE_RANGE_HIGH = 0xff000000;
export const OP_CODE_RANGE_STEP = 0x1000000;

//NOTE: these can only be one of the highest byte in a 32 bit number.
export const NOP = OP_CODE_RANGE_STEP;
export const PUSHUI8 = OP_CODE_RANGE_STEP * 2;
export const PUSHUI16 = OP_CODE_RANGE_STEP * 3;
export const PUSHUI32 = OP_CODE_RANGE_STEP * 4;
export const LDS = OP_CODE_RANGE_STEP * 5;
export const LDN = OP_CODE_RANGE_STEP * 6;
export const DUP = OP_CODE_RANGE_STEP * 15;
export const STORE = OP_CODE_RANGE_STEP * 16;
export const LOAD = OP_CODE_RANGE_STEP * 20;
export const CEQ = OP_CODE_RANGE_STEP * 42;
export const ADDUI32 = OP_CODE_RANGE_STEP * 52;
export const CALL = OP_CODE_RANGE_STEP * 62;
export const RAISE = OP_CODE_RANGE_STEP * 63;
export const JMP = OP_CODE_RANGE_STEP * 72;
export const IFZJMP = OP_CODE_RANGE_STEP * 73
export const IFNZJMP = OP_CODE_RANGE_STEP * 80;
export const IFEQJMP = OP_CODE_RANGE_STEP * 81;
export const IFNEQJMP = OP_CODE_RANGE_STEP * 82;
export const ALLOC = OP_CODE_RANGE_STEP * 92;
export const SEND = OP_CODE_RANGE_STEP * 94;
export const RECV = OP_CODE_RANGE_STEP * 95;
export const RECVCOUNT = OP_CODE_RANGE_STEP * 96;
export const MAILCOUNT = OP_CODE_RANGE_STEP * 97;
export const MAILDQ = OP_CODE_RANGE_STEP * 98;
export const SELF = OP_CODE_RANGE_STEP * 99;
export const STOP = OP_CODE_RANGE_STEP * 101;
export const GETPROP = OP_CODE_RANGE_STEP * 110;
export const ARLENGTH = OP_CODE_RANGE_STEP * 111;
export const ARELM = OP_CODE_RANGE_STEP * 112;

/**
 * Opcode
 */
export type Opcode = number;

/**
 * OpcodeHandler
 */
export type OpcodeHandler = (r: VMThread, f: Frame, o: Operand) => void;

/**
 * OpcodeInfo provides needed details of a single opcode.
 */
export interface OpcodeInfo {

    /**
     * name is the mnemonic for the opcode.
     */
    name: string,

    /**
     * handler is the implementation function.
     */
    handler: OpcodeHandler,

    /**
     * log is a function that is applied to convert the op into an op log
     * entry.
     */
    log: (r: VMThread, f: Frame, oper: Operand) => Type[]

}

/**
 * OpcodeInfos is a map of opcode numbers to their respective OpCodeInfo objects.
 */
export interface OpcodeInfos extends Record<OpcodeInfo> { }

/**
 * OpcodeHandlers
 */
export interface OpcodeHandlers {

    [key: number]: OpcodeHandler

}

/**
 * opcodes
 */
export const opcodes: OpcodeInfos = {

    [NOP]: {

        name: 'nop',

        handler: base.nop,

        log: () => ['nop']

    },

    [PUSHUI8]: {

        name: 'pushui8',

        handler: base.pushui8,

        log: (_: VMThread, __: Frame, oper: Operand) => ['pushui8', oper]

    },

    [PUSHUI16]: {

        name: 'pushui16',

        handler: base.pushui16,

        log: (_: VMThread, __: Frame, oper: Operand) => ['pushui16', oper]

    },

    [PUSHUI32]: {

        name: 'pushui32',

        handler: base.pushui32,

        log: (_: VMThread, __: Frame, oper: Operand) => ['pushui32', oper]

    },

    [LDS]: {

        name: 'lds',

        handler: base.lds,

        log: (_: VMThread, f: Frame, oper: Operand) =>
            ['lds', oper, eToLog(f.resolve(DATA_TYPE_STRING | oper))]

    },

    [LDN]: {

        name: 'ldn',

        handler: base.ldn,

        log: (_: VMThread, f: Frame, oper: Operand) =>
            ['ldn', oper, eToLog(f.resolve(DATA_TYPE_INFO | oper))]

    },

    [DUP]: {

        name: 'dup',

        handler: base.dup,

        log: (_: VMThread, __: Frame, ___: Operand) => ['dup']
    },

    [STORE]: {

        name: 'store',

        handler: base.store,

        log: (_: VMThread, __: Frame, oper: Operand) =>
            ['store', oper]

    },

    [LOAD]: {

        name: 'load',

        handler: base.load,

        log: (_: VMThread, f: Frame, oper: Operand) =>
            ['load', oper, eToLog(f.resolve(DATA_TYPE_LOCAL | oper))]

    },

    [CEQ]: {

        name: 'ceq',

        handler: base.ceq,

        log: (_: VMThread, __: Frame, ___: Operand) => ['ceq']

    },

    [ADDUI32]: {

        name: 'addui32',

        handler: base.addui32,

        log: (_: VMThread, __: Frame, ___: Operand) => ['addui32']

    },

    [CALL]: {

        name: 'call',

        handler: base.call,

        log: (_: VMThread, __: Frame, ___: Operand) => ['call']

    },

    [RAISE]: {

        name: 'raise',

        handler: base.raise,

        log: (_: VMThread, __: Frame, ___: Operand) => ['raise']

    },

    [JMP]: {

        name: 'jmp',

        handler: base.jmp,

        log: (_: VMThread, __: Frame, oper: Operand) => ['jmp', oper]

    },

    [IFZJMP]: {

        name: 'ifzjmp',

        handler: base.ifzjmp,

        log: (_: VMThread, __: Frame, oper: Operand) => ['ifzjmp', oper]

    },

    [IFNZJMP]: {

        name: 'ifnzjmp',

        handler: base.ifnzjmp,

        log: (_: VMThread, __: Frame, oper: Operand) => ['ifnzjmp', oper]

    },

    [IFEQJMP]: {

        name: 'ifeqjmp',

        handler: base.ifeqjmp,

        log: (_: VMThread, __: Frame, oper: Operand) => ['ifeqjmp', oper]

    },

    [IFNEQJMP]: {

        name: 'ifneqjmp',

        handler: base.ifneqjmp,

        log: (_: VMThread, __: Frame, oper: Operand) => ['ifneqjmp', oper]

    },

    [ALLOC]: {

        name: 'alloc',

        handler: actor.alloc,

        log: (_: VMThread, __: Frame, ___: Operand) => ['alloc']

    },

    [SEND]: {

        name: 'send',

        handler: actor.send,

        log: (_: VMThread, __: Frame, ___: Operand) => ['send']

    },

    [RECV]: {

        name: 'recv',

        handler: actor.recv,

        log: (_: VMThread, f: Frame, oper: Operand) =>
            ['recv', oper, eToLog(f.resolve(DATA_TYPE_INFO | oper))]

    },

    [RECVCOUNT]: {

        name: 'recvcount',

        handler: actor.recvcount,

        log: (_: VMThread, __: Frame, ___: Operand) => ['recvcount']

    },

    [MAILCOUNT]: {

        name: 'mailcount',

        handler: actor.mailcount,

        log: (_: VMThread, __: Frame, ___: Operand) => ['mailcount']

    },

    [MAILDQ]: {

        name: 'maildq',

        handler: actor.maildq,

        log: (_: VMThread, __: Frame, ___: Operand) => ['maildq']

    },

    [SELF]: {

        name: 'self',

        handler: actor.self,

        log: (_: VMThread, __: Frame, ___: Operand) => ['self']

    },

    [STOP]: {

        name: 'stop',

        handler: actor.stop,

        log: (_: VMThread, __: Frame, ___: Operand) => ['stop']

    },

    [GETPROP]: {

        name: 'getprop',

        handler: obj.getprop,

        log: (_: VMThread, __: Frame, oper: Operand) => ['getprop', oper]

    },

    [ARELM]: {

        name: 'arelm',

        handler: obj.arelm,

        log: (_: VMThread, __: Frame, oper: Operand) => ['arelm', oper]

    },

    [ARLENGTH]: {

        name: 'arlength',

        handler: obj.arlength,

        log: (_: VMThread, __: Frame, ___: Operand) => ['arlength']

    }

};

const eToLog = (e: Either<Err, PTValue>) => e.isLeft() ?
    e.takeLeft().message : e.takeRight();

/**
 * handlers maps opcode numbers to their handler
 */
export const handlers: OpcodeHandlers = map(opcodes, i => i.handler);

/**
 * toName converts an opcode to it's mnemonic.
 */
export const toName = (op: Opcode) => opcodes.hasOwnProperty(op) ?
    opcodes[op].name : '<unknown>';

/**
 * toLog provides a log line for an op.
 *
 * If the op is invalid an empty line is produced.
 */
export const toLog = (op: Opcode, r: VMThread, f: Frame, oper: Operand) =>
    opcodes.hasOwnProperty(op) ? opcodes[op].log(r, f, oper) : []

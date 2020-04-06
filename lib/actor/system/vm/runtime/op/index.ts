import * as base from './base';
import * as jump from './jump';
import * as actor from './actor';

import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

export const OP_CODE_RANGE_LOW = 0x1000000;
export const OP_CODE_RANGE_HIGH = 0xff000000;
export const OP_CODE_RANGE_STEP = 0x1000000;

//NOTE: these can only be one of the highest byte in a 32 bit number.
export const NOP = OP_CODE_RANGE_STEP;
export const PUSHUI8 = OP_CODE_RANGE_STEP * 2;
export const PUSHUI16 = OP_CODE_RANGE_STEP * 3;
export const PUSHUI32 = OP_CODE_RANGE_STEP * 4;
export const PUSHSTR = OP_CODE_RANGE_STEP * 5;
export const LDN = OP_CODE_RANGE_STEP * 6;
export const DUP = OP_CODE_RANGE_HIGH * 15;
export const STORE = OP_CODE_RANGE_STEP * 16;
export const LOAD = OP_CODE_RANGE_STEP * 20;
export const CEQ = OP_CODE_RANGE_STEP * 42;
export const ADDUI32 = OP_CODE_RANGE_STEP * 52;
export const CALL = OP_CODE_RANGE_STEP * 62;
export const JMP = OP_CODE_RANGE_STEP * 72;
export const IFZJMP = OP_CODE_RANGE_STEP * 73
export const IFNZJMP = OP_CODE_RANGE_STEP * 80;
export const IFEQJMP = OP_CODE_RANGE_STEP * 81;
export const IFNEQJMP = OP_CODE_RANGE_STEP * 82;
export const ALLOC = OP_CODE_RANGE_STEP * 92;
export const RUN = OP_CODE_RANGE_STEP * 93;
export const SEND = OP_CODE_RANGE_STEP * 94;
export const RECV = OP_CODE_RANGE_STEP * 95;
export const RECVCOUNT = OP_CODE_RANGE_STEP * 96;
export const MAILCOUNT = OP_CODE_RANGE_STEP * 97;
export const MAILDQ = OP_CODE_RANGE_STEP * 98;
export const SELF = OP_CODE_RANGE_STEP * 99;
export const READ = OP_CODE_RANGE_STEP * 100;

/**
 * OpcodeHandler
 */
export type OpcodeHandler = (r: Runtime, f: Frame, o: Operand) => void;

/**
 * OpcodeHandlers
 */
export interface OpcodeHandlers {

    [key: number]: OpcodeHandler

}

/**
 * handlers for the supported op codes.
 */
export const handlers: OpcodeHandlers = {

    [NOP]: base.nop,

    [PUSHUI8]: base.pushui8,

    [PUSHUI16]: base.pushui16,

    [PUSHUI32]: base.pushui32,

    [PUSHSTR]: base.pushstr,

    [LDN]: base.ldn,

    [DUP]: base.dup,

    [STORE]: base.store,

    [LOAD]: base.load,

    [CEQ]: base.ceq,

    [ADDUI32]: base.addui32,

    [CALL]: base.call,

    [JMP]: jump.jmp,

    [IFZJMP]: jump.ifzjmp,

    [IFNZJMP]: jump.ifnzjmp,

    [IFEQJMP]: jump.ifeqjmp,

    [IFNEQJMP]: jump.ifneqjmp,

    [ALLOC]: actor.alloc,

    [RUN]: actor.run,

    [SEND]: actor.send,

    [RECV]: actor.recv,

    [RECVCOUNT]: actor.recvcount,

    [MAILCOUNT]: actor.mailcount,

    [MAILDQ]: actor.maildq,

    [SELF]: actor.self,

    [READ]: actor.read

};

import * as base from './base';
import * as jump from './jump';
import * as actor from './actor';

import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

//NOTE: these can only be one of the highest byte in a 32 bit number.
export const NOP = 0x0;
export const PUSHUI8 = 0x1;
export const PUSHUI16 = 0x2;
export const PUSHUI32 = 0x3;
export const PUSHSTR = 0x4;
export const PUSHFUN = 0x5;
export const DUP = 0x15;
export const STORE = 0x16;
export const LOAD = 0x20;
export const CEQ = 0x2a;
export const ADDUI32 = 0x34;
export const CALL = 0x3e;
export const JMP = 0x48;
export const IFZJMP = 0x49;
export const IFNZJMP = 0x50;
export const IFEQJMP = 0x51;
export const IFNEQJMP = 0x52;
export const ALLOC = 0x5c;
export const RUN = 0x5d;
export const SEND = 0x5e;
export const RECV = 0x5f;
export const RECVCOUNT = 0x60;
export const READ = 0x61;
export const MAILCOUNT = 0x62;
export const MAILDQ = 0x63;

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

    [PUSHFUN]: base.pushfun,

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

    [READ]: actor.read,

    [MAILCOUNT]: actor.mailcount,

    [MAILDQ]: actor.maildq

};

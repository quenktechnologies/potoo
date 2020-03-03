import * as base from './base';
import * as push from './push';
import * as jump from './jump';
import * as actor from './actor';
import * as mail from './mail';

import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

//TODO: order codes, remember we are using the highest byte only.
export const NOP = 0x0;
export const PUSHUI8 = 0x1;
export const PUSHUI16 = 0x2;
export const PUSHSTR = 0x3;
export const PUSHTMPL = 0x4;
export const JMP = 0x234;
export const IFZJMP = 0x4334;
export const IFNZJMP = 0xdffd;
export const IFEQJMP = 0xff;
export const IFNEQJMP = 0xff;
export const ALLOC = 0x20;
export const RUN = 0x21;
export const MAILCOUNT = 0x50;

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
 * opcodeHandlers
 */
export const opcodeHandlers: OpcodeHandlers = {

    [NOP]: base.nop,

    [PUSHUI8]: push.pushui8,

    [PUSHUI16]: push.pushui16,

    [PUSHSTR]: push.pushstr,

    [PUSHTMPL]: push.pushtmpl,

    [JMP]: jump.jmp,

    [IFZJMP]: jump.ifzjmp,

    [IFNZJMP]: jump.ifnzjmp,

    [IFEQJMP]: jump.ifeqjmp,

    [IFNEQJMP]: jump.ifneqjmp,

    [ALLOC]: actor.alloc,

    [RUN]: actor.run,

    [MAILCOUNT]: mail.mailcount

};

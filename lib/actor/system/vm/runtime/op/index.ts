import * as push from './push';
import * as alloc from './alloc';

import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';

export const OP_NOP = 0x0;
export const OP_PUSHUI8 = 0x1;
export const OP_PUSHUI16 = 0x2;
export const OP_PUSHSTR = 0x3;
export const OP_PUSHTMPL = 0x4;
export const OP_ALLOC = 0x20;

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

    [OP_PUSHUI8]: push.pushui8,

    [OP_PUSHUI16]: push.pushui16,

    [OP_PUSHSTR]: push.pushstr,

    [OP_PUSHTMPL]: push.pushtmpl,

    [OP_ALLOC]: alloc.alloc

};

import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';
export declare const NOP = 0;
export declare const PUSHUI8 = 1;
export declare const PUSHUI16 = 2;
export declare const PUSHUI32 = 3;
export declare const PUSHSTR = 4;
export declare const PUSHSYM = 5;
export declare const DUP = 21;
export declare const STORE = 22;
export declare const LOAD = 32;
export declare const CEQ = 42;
export declare const ADDUI32 = 52;
export declare const CALL = 62;
export declare const RET = 63;
export declare const JMP = 72;
export declare const IFZJMP = 73;
export declare const IFNZJMP = 80;
export declare const IFEQJMP = 81;
export declare const IFNEQJMP = 82;
export declare const ALLOC = 92;
export declare const RUN = 93;
export declare const SEND = 94;
export declare const RECV = 95;
export declare const RECVCOUNT = 96;
export declare const MAILCOUNT = 98;
export declare const PUSHMAIL = 99;
/**
 * OpcodeHandler
 */
export declare type OpcodeHandler = (r: Runtime, f: Frame, o: Operand) => void;
/**
 * OpcodeHandlers
 */
export interface OpcodeHandlers {
    [key: number]: OpcodeHandler;
}
/**
 * handlers for the supported op codes.
 */
export declare const handlers: OpcodeHandlers;

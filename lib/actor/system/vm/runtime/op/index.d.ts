import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';
export declare const OP_CODE_RANGE_LOW = 16777216;
export declare const OP_CODE_RANGE_HIGH = 4278190080;
export declare const OP_CODE_RANGE_STEP = 16777216;
export declare const NOP = 16777216;
export declare const PUSHUI8: number;
export declare const PUSHUI16: number;
export declare const PUSHUI32: number;
export declare const PUSHSTR: number;
export declare const LDN: number;
export declare const DUP: number;
export declare const STORE: number;
export declare const LOAD: number;
export declare const CEQ: number;
export declare const ADDUI32: number;
export declare const CALL: number;
export declare const JMP: number;
export declare const IFZJMP: number;
export declare const IFNZJMP: number;
export declare const IFEQJMP: number;
export declare const IFNEQJMP: number;
export declare const ALLOC: number;
export declare const RUN: number;
export declare const SEND: number;
export declare const RECV: number;
export declare const RECVCOUNT: number;
export declare const MAILCOUNT: number;
export declare const MAILDQ: number;
export declare const SELF: number;
export declare const READ: number;
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

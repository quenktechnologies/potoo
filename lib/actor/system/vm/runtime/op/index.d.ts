import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';
export declare const OP_CODE_RANGE_LOW = 16777216;
export declare const OP_CODE_RANGE_HIGH = 4278190080;
export declare const OP_CODE_RANGE_STEP = 16777216;
export declare const NOP = 16777216;
export declare const PUSHUI8: number;
export declare const PUSHUI16: number;
export declare const PUSHUI32: number;
export declare const LDS: number;
export declare const LDN: number;
export declare const DUP: number;
export declare const STORE: number;
export declare const LOAD: number;
export declare const CEQ: number;
export declare const ADDUI32: number;
export declare const CALL: number;
export declare const RAISE: number;
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
export declare const STOP: number;
/**
 * Opcode
 */
export declare type Opcode = number;
/**
 * OpcodeHandler
 */
export declare type OpcodeHandler = (r: Runtime, f: Frame, o: Operand) => void;
/**
 * OpcodeInfo provides needed details of a single opcode.
 */
export interface OpcodeInfo {
    /**
     * name is the mnemonic for the opcode.
     */
    name: string;
    /**
     * handler is the implementation function.
     */
    handler: OpcodeHandler;
    /**
     * log is a function that is applied to convert the op into an op log
     * entry.
     */
    log: (r: Runtime, f: Frame, oper: Operand) => Type[];
}
/**
 * OpcodeInfos is a map of opcode numbers to their respective OpCodeInfo objects.
 */
export interface OpcodeInfos extends Record<OpcodeInfo> {
}
/**
 * OpcodeHandlers
 */
export interface OpcodeHandlers {
    [key: number]: OpcodeHandler;
}
/**
 * opcodes
 */
export declare const opcodes: OpcodeInfos;
/**
 * handlers maps opcode numbers to their handler
 */
export declare const handlers: OpcodeHandlers;
/**
 * toName converts an opcode to it's mnemonic.
 */
export declare const toName: (op: number) => string;
/**
 * toLog provides a log line for an op.
 *
 * If the op is invalid an empty line is produced.
 */
export declare const toLog: (op: number, r: Runtime, f: Frame, oper: number) => any[];

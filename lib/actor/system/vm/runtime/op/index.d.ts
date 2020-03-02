import { Frame } from '../stack/frame';
import { Runtime, Operand } from '../';
export declare const OP_NOP = 0;
export declare const OP_PUSHUI8 = 1;
export declare const OP_PUSHUI16 = 2;
export declare const OP_PUSHSTR = 3;
export declare const OP_PUSHTMPL = 4;
export declare const OP_ALLOC = 32;
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
 * opcodeHandlers
 */
export declare const opcodeHandlers: OpcodeHandlers;

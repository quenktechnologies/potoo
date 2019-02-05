import { Type } from '@quenk/noni/lib/data/type';
import { Context } from '../../../context';
import { System } from '../../';
import { Data, Frame } from '../frame';
import { Runtime } from '../runtime';
export declare const OP_CODE_NOOP = 0;
export declare const OP_CODE_PUSH_NUM = 1;
export declare const OP_CODE_PUSH_STR = 2;
export declare const OP_CODE_PUSH_FUNC = 3;
export declare const OP_CODE_PUSH_MSG = 4;
export declare const OP_CODE_PUSH_TEMP = 5;
export declare const OP_CODE_PUSH_FOREIGN = 6;
export declare const OP_CODE_DUP = 7;
export declare const OP_CODE_ADD = 8;
export declare const OP_CODE_CMP = 9;
export declare const OP_CODE_CALL = 10;
export declare const OP_CODE_STORE = 11;
export declare const OP_CODE_LOAD = 12;
export declare const OP_CODE_JUMP = 13;
export declare const OP_CODE_JUMP_IF_ONE = 14;
export declare const OP_CODE_QUERY = 32;
export declare const OP_CODE_ALLOCATE = 33;
export declare const OP_CODE_TEMP_CC = 34;
export declare const OP_CODE_TEMP_CHILD = 35;
export declare const OP_CODE_TELL = 36;
export declare const OP_CODE_DISCARD = 37;
export declare const OP_CODE_RUN = 38;
export declare const OP_CODE_RECEIVE = 39;
export declare const OP_CODE_READ = 40;
export declare const OP_CODE_RESTART = 41;
export declare const OP_CODE_DROP = 48;
export declare const OP_CODE_STOP = 42;
export declare const OP_CODE_RAISE = 11;
/**
 * Log describes an Op code's execution in a format that can
 * be logged.
 */
export declare type Log = [string, Data | [], Type[]];
/**
 * Levels allowed for ops.
 */
export declare enum Level {
    Base,
    Control,
    Actor,
    System
}
/**
 * Operand used during Op code execution.
 */
export declare type Operand = number;
/**
 * Op code.
 *
 * Implementations of this class carry out a single task
 * in the Runtime's context.
 */
export interface Op<C extends Context, S extends System<C>> {
    /**
     * code for the Op.
     */
    code: number;
    /**
     * level of the instruction used for logging.
     */
    level: Level;
    /**
     * exec the instruction.
     */
    exec(s: Runtime<C, S>): void;
    /**
     * toLog turns the instruction into a loggable string.
     */
    toLog(f: Frame<C, S>): Log;
}

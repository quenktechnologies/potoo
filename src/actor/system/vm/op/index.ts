import * as log from '../../log';
import { Type } from '@quenk/noni/lib/data/type';
import { Context } from '../../../context';
import { Data, Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';

export const OP_CODE_NOOP = 0x0;
export const OP_CODE_PUSH_NUM = 0x1;
export const OP_CODE_PUSH_STR = 0x2;
export const OP_CODE_PUSH_FUNC = 0x3;
export const OP_CODE_PUSH_MSG = 0x4;
export const OP_CODE_PUSH_TEMP = 0x5;
export const OP_CODE_PUSH_FOREIGN = 0x6;
export const OP_CODE_DUP = 0x7;
export const OP_CODE_ADD = 0x8;
export const OP_CODE_CMP = 0x9;
export const OP_CODE_CALL = 0xa;
export const OP_CODE_STORE = 0xb;
export const OP_CODE_LOAD = 0xc;
export const OP_CODE_JUMP = 0xd;
export const OP_CODE_JUMP_IF_ONE = 0xe;
export const OP_CODE_QUERY = 0x20;
export const OP_CODE_ALLOCATE = 0x21;
export const OP_CODE_TEMP_CC = 0x22;
export const OP_CODE_TEMP_CHILD = 0x23;
export const OP_CODE_TELL = 0x24;
export const OP_CODE_DISCARD = 0x25;
export const OP_CODE_RUN = 0x26;
export const OP_CODE_RECEIVE = 0x27;
export const OP_CODE_READ = 0x28;
export const OP_CODE_RESTART = 0x29;
export const OP_CODE_DROP = 0x30;
export const OP_CODE_STOP = 0x2a;
export const OP_CODE_RAISE = 0xb;

/**
 * Log describes an Op code's execution in a format that can
 * be logged.
 */
export type Log = [string, Data | [], Type[]];

/**
 * Levels allowed for ops.
 */
export enum Level {

    Base = log.DEBUG,
    Control = log.DEBUG,
    Actor = log.INFO,
    System = log.WARN

}

/**
 * Operand used during Op code execution.
 */
export type Operand = number;

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


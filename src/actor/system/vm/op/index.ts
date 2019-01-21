import * as log from '../../log';
import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';

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
 * in the Executor's context.
 */
export abstract class Op<C extends Context, S extends System<C>> {

    /**
     * code for the Op.
     */
    public abstract code: number;

    /**
     * level of the instruction used for logging.
     */
    public abstract level: Level;

    /**
     * exec the instruction.
     */
    public abstract exec(s: Executor<C, S>): void;

}


import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
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
 * in the Executor's context.
 */
export declare abstract class Op<C extends Context, S extends System<C>> {
    /**
     * code for the Op.
     */
    abstract code: number;
    /**
     * level of the instruction used for logging.
     */
    abstract level: Level;
    /**
     * exec the instruction.
     */
    abstract exec(s: Executor<C, S>): void;
}

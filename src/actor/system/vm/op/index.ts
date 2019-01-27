import * as log from '../../log';
import { Context } from '../../../context';
import { System } from '../../';
import {Frame} from '../frame';
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
export  interface Op<C extends Context, S extends System<C>> {

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
  exec(s: Executor<C, S>): void;

  /**
   * toLog turns the instruction into a loggable string.
   */
  toLog(f:Frame<C,S>) : string;

}


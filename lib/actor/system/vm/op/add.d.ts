import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Level, Op } from './';
/**
 * Add the top two operands of the stack.
 *
 * Pops:
 * 1. The first value.
 * 2. The second value.
 *
 * Pushes:
 *
 * The result of adding the two numbers.
 */
export declare class Add<C extends Context, S extends Platform<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

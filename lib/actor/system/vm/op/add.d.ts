import { Frame } from '../frame';
import { Runtime } from '../runtime';
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
export declare class Add implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

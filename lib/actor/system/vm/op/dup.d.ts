import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Op, Level } from './';
/**
 * Dup duplicates the current value at the top of the stack.
 */
export declare class Dup<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

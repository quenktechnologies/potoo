import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Op, Level } from './';
/**
 * Call a function.
 *
 * Pops:
 * 1: The function reference from the top of the stack.
 * 2: N arguments to be pushed onto the new Frame's stack.
 */
export declare class Call<C extends Context, S extends Platform<C>> implements Op<C, S> {
    args: number;
    constructor(args: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

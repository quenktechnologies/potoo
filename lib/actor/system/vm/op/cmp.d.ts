import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Level, Op } from './';
/**
 * Cmp compares the top two values for equality.
 *
 * Pops:
 *
 * 1. Left value.
 * 2. Right value.
 *
 * Pushes:
 *
 * 1 if true, 0 if false
 */
export declare class Cmp<C extends Context, S extends Platform<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

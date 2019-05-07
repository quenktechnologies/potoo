import { Frame } from '../frame';
import { Runtime } from '../runtime';
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
export declare class Cmp implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

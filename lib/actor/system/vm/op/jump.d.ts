import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Level, Op } from './';
/**
 * Jump to a new location.
 */
export declare class Jump<C extends Context, S extends Platform<C>> implements Op<C, S> {
    location: number;
    constructor(location: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}
/**
 * JumpIfOne changes the current Frame's ip if the top value is one.
 *
 * Pops
 * 1. value to test.
 */
export declare class JumpIfOne<C extends Context, S extends Platform<C>> implements Op<C, S> {
    location: number;
    constructor(location: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

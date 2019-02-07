import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Op, Level } from './';
/**
 * Query verifies whether an address has a valid Context within the system.
 *
 * Pops:
 * 1. Address to query
 *
 * Pushes:
 * 1 on true, 0 otherwise.
 */
export declare class Query<C extends Context, S extends Platform<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

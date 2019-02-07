import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Level, Op } from './';
/**
 * Store the top most value on the stack in the locals array at the
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export declare class Store<C extends Context, S extends Platform<C>> implements Op<C, S> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

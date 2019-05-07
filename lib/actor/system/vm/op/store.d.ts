import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level, Op } from './';
/**
 * Store the top most value on the stack in the locals array at the
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export declare class Store implements Op {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

import { Runtime } from '../runtime';
import { Frame } from '../frame';
import { Log, Op, Level } from './';
/**
 * Drop an unwanted message.
 *
 * Pops:
 *
 * 1. The message to be dropped.
 */
export declare class Drop implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

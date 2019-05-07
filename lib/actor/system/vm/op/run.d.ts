import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Run invokes the run method of an actor given the address.
 *
 * Pops
 * 1. The address of the current actor or child to be run.
 */
export declare class Run implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

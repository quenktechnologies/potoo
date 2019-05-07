import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Call a function.
 *
 * Pops:
 * 1: The function reference from the top of the stack.
 * 2: N arguments to be pushed onto the new Frame's stack.
 */
export declare class Call implements Op {
    args: number;
    constructor(args: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level, Op } from './';
/**
 * Jump to a new location.
 */
export declare class Jump implements Op {
    location: number;
    constructor(location: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}
/**
 * JumpIfOne changes the current Frame's ip if the top value is one.
 *
 * Pops
 * 1. value to test.
 */
export declare class JumpIfOne implements Op {
    location: number;
    constructor(location: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

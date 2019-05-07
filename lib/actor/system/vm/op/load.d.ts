import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level } from './';
/**
 * Load the local stored at index onto the stack.
 *
 * Pushes:
 * 1. Value of index in locals table.
 */
export declare class Load {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(_: Frame): Log;
}

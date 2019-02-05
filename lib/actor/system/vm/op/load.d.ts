import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level } from './';
/**
 * Load the local stored at index onto the stack.
 *
 * Pushes:
 * 1. Value of index in locals table.
 */
export declare class Load<C extends Context, S extends System<C>> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(_: Frame<C, S>): Log;
}

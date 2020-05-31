import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Raise instruction.
 *
 * Raises an error within the system.
 * If the actor template for the source actor came with a trap function,
 * we apply it to determine what action to take next.
 *
 * Which can be one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1 until we hit the system actor which results
 * in the whole system crashing.
 *
 * Pops:
 * 1. Message indicating an error.
 */
export declare class Raise implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}
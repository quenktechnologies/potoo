import { Runtime } from '../runtime';
import { Frame } from '../frame';
import { Log, Op, Level } from './';
/**
 * Receive schedules a handler for a resident actor to receive the next
 * message from its mailbox.
 *
 * Pops:
 *  1. Reference to a foreign function that will be installed as the message
 *     handler.
 */
export declare class Receive implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

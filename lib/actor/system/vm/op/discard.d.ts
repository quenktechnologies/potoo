import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export declare class Discard implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}

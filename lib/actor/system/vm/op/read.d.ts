import { Context } from '../../../context';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Op, Level } from './';
/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pushes
 *
 * The number 1 if successful or 0 if the message was not processed.
 */
export declare class Read<C extends Context, S extends Platform<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}

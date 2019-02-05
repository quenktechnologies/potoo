import { Context } from '../../../context';
import { System } from '../../';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pushes
 *
 * The number 1 if successful or 0 if the message was not processed.
 */
export declare class Read<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}

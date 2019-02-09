import { Context } from '../../../context';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Op, Level } from './';
/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
export declare class Discard<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}

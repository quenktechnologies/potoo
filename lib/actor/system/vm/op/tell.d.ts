import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Op, Level } from './';
/**
 * Tell delivers the first message in the outbox queue to the address
 * at the top of the data stack.
 *
 * Pops:
 * 1. Address
 * 2. Message
 *
 * Pushes:
 *
 * 1 if delivery is successful, 0 otherwise.
 */
export declare class Tell<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

import { Err } from '@quenk/noni/lib/control/error';
import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
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
 */
export declare class Raise<C extends Context, S extends System<C>> extends Op<C, S> {
    error: Err;
    src: Address;
    dest: Address;
    constructor(error: Err, src: Address, dest: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

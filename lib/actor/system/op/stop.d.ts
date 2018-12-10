import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Stop instruction.
 *
 * Halts an actor and removes it from the system.
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 */
export declare class Stop<C extends Context, S extends System<C>> extends Op<C, S> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

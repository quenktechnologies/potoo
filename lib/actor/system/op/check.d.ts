import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Check instruction.
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if any found.
 */
export declare class Check<C extends Context, S extends System<C>> extends Op<C, S> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

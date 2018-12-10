import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Restart instruction.
 *
 * Re-creates a new instance of an actor maintaining the state of its mailbox.
 */
export declare class Restart<C extends Context, S extends System<C>> extends Op<C, S> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

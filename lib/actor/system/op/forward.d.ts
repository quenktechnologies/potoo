import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Forward instruction.
 *
 * Creates an entry in the system's routing table to allow
 * any messages bound for a address prefix to be forwarded to
 * another actor.
 */
export declare class Forward<C extends Context, S extends System<C>> extends Op<C, S> {
    from: Address;
    to: Address;
    constructor(from: Address, to: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

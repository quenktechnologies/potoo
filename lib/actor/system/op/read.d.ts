import { Address } from '../../address';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Read instruction.
 *
 * Applies the actor behaviour in the "next tick" if a
 * pending receive is discovered.
 */
export declare class Read<C extends Context, S extends System<C>> extends Op<C, S> {
    address: Address;
    envelope: Envelope;
    constructor(address: Address, envelope: Envelope);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

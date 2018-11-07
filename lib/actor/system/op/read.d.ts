import { Address } from '../../address';
import { Envelope } from '../../mailbox';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Read instruction.
 */
export declare class Read<C extends Context> extends Op<C> {
    address: Address;
    envelope: Envelope;
    constructor(address: Address, envelope: Envelope);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execRead
 *
 * Applies the actor behaviour in the "next tick" if a
 * receive is pending.
 */
export declare const execRead: <C extends Context>(s: Executor<C>, { address, envelope }: Read<C>) => void;

import { Address } from '../../address';
import { Envelope } from '../mailbox';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Read instruction.
 */
export declare class Read extends Op {
    address: Address;
    envelope: Envelope;
    constructor(address: Address, envelope: Envelope);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execRead
 *
 * Applies the actor behaviour in the "next tick" if a
 * receive is pending.
 */
export declare const execRead: <C extends Context>(s: Executor<C>, { address, envelope }: Read) => void;

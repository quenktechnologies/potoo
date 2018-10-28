import { Address } from '../../address';
import { Envelope } from '../mailbox';
import { Executor } from './';
import { Frame } from '../state/frame';
import { Op } from './';
/**
 * Read instruction.
 */
export declare class Read extends Op {
    address: Address;
    envelope: Envelope;
    constructor(address: Address, envelope: Envelope);
    code: number;
    level: number;
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execRead
 *
 * Applies the actor behaviour in the "next tick" if a
 * receive is pending.
 */
export declare const execRead: <F extends Frame>(s: Executor<F>, { address, envelope }: Read) => void;

import { Address } from '../../address';
import { Envelope } from '../mailbox';
import { System } from '../';
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
    exec(s: System): void;
}
/**
 * execRead
 *
 * Applies the actor behaviour in the "next tick" if a
 * receive is pending.
 */
export declare const execRead: (s: System, { address, envelope }: Read) => void;

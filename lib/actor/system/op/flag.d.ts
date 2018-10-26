import { Address } from '../../address';
import { Flags } from '../state';
import { System } from '../';
import { Op } from './';
/**
 * Flag instruction.
 */
export declare class Flag extends Op {
    address: Address;
    flags: Flags;
    constructor(address: Address, flags: Flags);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execFlags
 *
 * Changes the flags of an actor by merging.
 */
export declare const execFlags: (s: System, { address, flags }: Flag) => void;

import { Address } from '../../address';
import { System } from '../';
import { Op } from './';
/**
 * Check instruction.
 */
export declare class Check extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execCheck
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execCheck: (s: System, { address }: Check) => void;

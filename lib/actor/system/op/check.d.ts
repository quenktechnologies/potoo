import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
/**
 * Check instruction.
 */
export declare class Check extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execCheck
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execCheck: <F extends Frame>(s: Executor<F>, { address }: Check) => void;

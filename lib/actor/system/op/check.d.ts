import { Address } from '../../address';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Check instruction.
 */
export declare class Check extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execCheck
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execCheck: <C extends Context>(s: Executor<C>, { address }: Check) => void;

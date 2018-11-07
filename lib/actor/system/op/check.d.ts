import { Address } from '../../address';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Check instruction.
 */
export declare class Check<C extends Context> extends Op<C> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execCheck
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execCheck: <C extends Context>(s: Executor<C>, { address }: Check<C>) => void;

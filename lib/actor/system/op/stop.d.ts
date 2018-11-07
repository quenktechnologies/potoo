import { Address } from '../../address';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Stop instruction.
 */
export declare class Stop<C extends Context> extends Op<C> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
export declare const execStop: <C extends Context>(s: Executor<C>, { address }: Stop<C>) => void;

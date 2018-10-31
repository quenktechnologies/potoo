import { Address } from '../../address';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Stop instruction.
 */
export declare class Stop extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
export declare const execStop: <C extends Context>(s: Executor<C>, { address }: Stop) => void;

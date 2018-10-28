import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
/**
 * Stop instruction.
 */
export declare class Stop extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
export declare const execStop: <F extends Frame>(s: Executor<F>, { address }: Stop) => void;

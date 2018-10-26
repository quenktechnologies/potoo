import { Address } from '../../address';
import { System } from '../';
import { Op } from './';
/**
 * Stop instruction.
 */
export declare class Stop extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
export declare const execStop: (s: System, { address }: Stop) => void;

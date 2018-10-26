import { Address } from '../../address';
import { System } from '../';
import { Op } from './';
/**
 * Restart instruction.
 */
export declare class Restart extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
export declare const execRestart: (s: System, { address }: Restart) => void;

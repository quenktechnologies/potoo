import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
/**
 * Restart instruction.
 */
export declare class Restart extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
export declare const execRestart: <F extends Frame>(s: Executor<F>, op: Restart) => void;

import { Address } from '../../address';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Restart instruction.
 */
export declare class Restart extends Op {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
export declare const execRestart: <C extends Context>(s: Executor<C>, op: Restart) => void;

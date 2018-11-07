import { Address } from '../../address';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Restart instruction.
 */
export declare class Restart<C extends Context> extends Op<C> {
    address: Address;
    constructor(address: Address);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
export declare const execRestart: <C extends Context>(s: Executor<C>, op: Restart<C>) => void;

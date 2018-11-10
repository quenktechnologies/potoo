import { Address } from '../../address';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Forward instruction.
 */
export declare class Forward<C extends Context> extends Op<C> {
    from: Address;
    to: Address;
    constructor(from: Address, to: Address);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execForward
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export declare const execForward: <C extends Context>(s: Executor<C>, { from, to }: Forward<C>) => void;

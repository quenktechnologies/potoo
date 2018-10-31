import { Address } from '../../address';
import { Behaviour } from '../../';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Receive instruction.
 */
export declare class Receive extends Op {
    address: Address;
    immutable: boolean;
    behaviour: Behaviour;
    constructor(address: Address, immutable: boolean, behaviour: Behaviour);
    code: number;
    level: number;
    exec<F extends Context>(s: Executor<F>): void;
}
/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
export declare const execReceive: <C extends Context>(s: Executor<C>, { address, behaviour }: Receive) => void;

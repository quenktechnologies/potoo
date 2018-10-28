import { Address } from '../../address';
import { Behaviour } from '../../';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
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
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
export declare const execReceive: <F extends Frame>(s: Executor<F>, { address, behaviour }: Receive) => void;

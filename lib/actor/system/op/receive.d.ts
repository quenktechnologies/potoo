import { Address } from '../../address';
import { Behaviour } from '../../';
import { System } from '../';
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
    exec(s: System): void;
}
/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
export declare const execReceive: (s: System, { address, behaviour }: Receive) => void;

import { Address } from '../../address';
import { Behaviour } from '../../';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Receive instruction.
 *
 * Allows an actor to receive exactly one message.
 * Currently only one pending receive is allowed at a time.
 */
export declare class Receive<C extends Context, S extends System<C>> extends Op<C, S> {
    address: Address;
    immutable: boolean;
    behaviour: Behaviour;
    constructor(address: Address, immutable: boolean, behaviour: Behaviour);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

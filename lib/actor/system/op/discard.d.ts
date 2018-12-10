import { Address } from '../../address';
import { Context } from '../../context';
import { Executor } from './';
import { Message } from '../../message';
import { System } from '../';
import { Op } from './';
/**
 * Discard instruction.
 *
 * Drops a message from the system.
 */
export declare class Discard<C extends Context, S extends System<C>> extends Op<C, S> {
    to: Address;
    from: Address;
    message: Message;
    constructor(to: Address, from: Address, message: Message);
    code: number;
    level: number;
    exec(_: Executor<C, S>): void;
}

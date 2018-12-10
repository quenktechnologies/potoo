import { Address } from '../../address';
import { Message } from '../../message';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Transfer instruction.
 *
 * Transfers a message.
 */
export declare class Transfer<C extends Context, S extends System<C>> extends Op<C, S> {
    to: Address;
    from: Address;
    router: Address;
    message: Message;
    constructor(to: Address, from: Address, router: Address, message: Message);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

import { Address } from '../../address';
import { Message } from '../../message';
import { Context } from '../../context';
import { System } from '../';
import { Op, Executor } from './';
/**
 * Tell instruction.
 *
 * If there is a router registered for the "to" address, the message
 * is transfered to that address. Otherwise, provided the actor exists,
 * we put the message in it's mailbox and schedule a Check.
 *
 * The message is dropped otherwise.
 */
export declare class Tell<C extends Context, S extends System<C>> extends Op<C, S> {
    to: Address;
    from: Address;
    message: Message;
    constructor(to: Address, from: Address, message: Message);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

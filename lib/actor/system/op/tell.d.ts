import { Address } from '../../address';
import { Message } from '../../message';
import { Context } from '../../context';
import { Op, Executor } from './';
/**
 * Tell instruction.
 */
export declare class Tell<C extends Context> extends Op<C> {
    to: Address;
    from: Address;
    message: Message;
    constructor(to: Address, from: Address, message: Message);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execTell
 *
 * If there is a router registered for the "to" address, the message
 * is transfered.
 *
 * Otherwise provided, the actor exists, we put the message in it's
 * mailbox and issue a Check.
 *
 * The message is dropped otherwise.
 */
export declare const execTell: <C extends Context>(s: Executor<C>, op: Tell<C>) => void;

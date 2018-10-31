import { Address } from '../../address';
import { Message } from '../../message';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Transfer instruction.
 */
export declare class Transfer extends Op {
    to: Address;
    from: Address;
    router: Address;
    message: Message;
    constructor(to: Address, from: Address, router: Address, message: Message);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execTransfer
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execTransfer: <C extends Context>(s: Executor<C>, { router, to, from, message }: Transfer) => void;

import { Address } from '../../address';
import { Message } from '../../message';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
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
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execTransfer
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execTransfer: <F extends Frame>(s: Executor<F>, { router, to, from, message }: Transfer) => void;

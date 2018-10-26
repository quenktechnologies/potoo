import { Address } from '../../address';
import { Message } from '../../message';
import { System } from '../';
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
    exec(s: System): void;
}
/**
 * execTransfer
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
export declare const execTransfer: (s: System, { router, to, from, message }: Transfer) => void;

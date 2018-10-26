import { Address } from '../../address';
import { Message } from '../../message';
import { System } from '../';
import { Op } from './';
/**
 * Tell instruction.
 */
export declare class Tell extends Op {
    to: Address;
    from: Address;
    message: Message;
    constructor(to: Address, from: Address, message: Message);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execTell
 *
 * Puts a message in the destination actor's mailbox and schedules
 * the Check instruction if the destination still exists.
 *
 * The message is dropped otherwise.
 */
export declare const execTell: (s: System, { to, from, message }: Tell) => void;

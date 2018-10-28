import { Address } from '../../address';
import { Message } from '../../message';
import { Frame } from '../state/frame';
import { Executor } from './';
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
    exec<F extends Frame>(s: Executor<F>): void;
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
export declare const execTell: <F extends Frame>(s: Executor<F>, op: Tell) => void;

import { Message } from './message';
/**
 * Mailbox
 */
export declare type Mailbox = Envelope[];
/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destinations.
 */
export declare class Envelope {
    to: string;
    from: string;
    message: Message;
    constructor(to: string, from: string, message: Message);
}

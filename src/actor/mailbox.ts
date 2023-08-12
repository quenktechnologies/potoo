import { Message } from './message';

/**
 * Mailbox
 */
export type Mailbox = Envelope[];

/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destinations.
 */
export class Envelope {

    constructor(
        public to: string,
        public from: string,
        public message: Message) { }

}

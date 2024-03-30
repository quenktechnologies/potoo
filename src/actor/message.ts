/**
 * Message type supported by the system.
 */
export type Message = any;

/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destintations.
 */
export class Envelope {
    constructor(
        public to: string,
        public from: string,
        public message: Message
    ) {}
}

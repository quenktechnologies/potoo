/**
 * Message type supported by the system.
 */
export declare type Message = any;
/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destintations.
 */
export declare class Envelope {
    to: string;
    from: string;
    message: Message;
    constructor(to: string, from: string, message: Message);
}

import { Message } from '.';
/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 */
export declare class Envelope {
    to: string;
    from: string;
    message: Message;
    constructor(to: string, from: string, message: Message);
}

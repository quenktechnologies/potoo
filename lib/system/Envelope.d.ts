/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 * @param <M> message The message payload type.
 */
export declare class Envelope<M> {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}

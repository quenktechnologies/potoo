/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 * @param <P> value The message payload type.
 */
export declare class Envelope<P> {
    to: string;
    from: string;
    value: P;
    constructor(to: string, from: string, value: P);
}

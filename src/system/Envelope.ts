
/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 * @param <P> message The message payload type.
 */
export class Envelope<P> {

    constructor(public to: string, public from: string, public message: P) { }

}

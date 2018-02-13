
/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 * @param <M> message The message payload type.
 */
export class Envelope<M> {

    constructor(public to: string, public from: string, public message: M) { }

}

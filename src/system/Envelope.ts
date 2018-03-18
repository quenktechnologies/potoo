import {Message} from '.';

/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 */
export class Envelope {

    constructor(public to: string, public from: string, public message: Message) { }

}

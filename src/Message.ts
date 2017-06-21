/**
 * Message is an envelope for user messages.
 */
export class Message<M> {

    constructor(public to: string, public from: string, public message: M) { }

}

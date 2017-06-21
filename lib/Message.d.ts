/**
 * Message is an envelope for user messages.
 */
export declare class Message<M> {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}

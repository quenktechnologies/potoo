import Message from './Message';

/**
 * UnhandledMessage wraps messages that were not processed
 * by a receive call.
 *
 * @property {Reference} to
 * @property {*} Message
 */
export class UnhandledMessage extends Message {}

export default UnhandledMessage

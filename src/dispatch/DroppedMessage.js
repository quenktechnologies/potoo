import Message from './Message';

/**
 * DroppedMessage is an envelope for messages sent to an actor that does not exist.
 * @property {*} message
 * @property {string} to
 */
export class DroppedMessage extends Message {


}

export default DroppedMessage

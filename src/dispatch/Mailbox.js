/**
 * Mailbox interface representing a queue where messages
 * are stored for Concerns before they are processed.
 * @interface
 */
export class Mailbox {

    /**
     * enqueue puts a message into the queue and alerts the
     * listener of the change. Messages may be stringified for
     * remote storage.
     * @param {Concern} to
     * @param {Reference} from
     * @param {*} message
     */
    enqueue(to, from, message) {


    }

    /**
     * dequeue furnishes the next message to be processed.
     * @returns {Envelope}
     */
    dequeue() {

    }

}

export default Mailbox

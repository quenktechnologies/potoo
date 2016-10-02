/**
 * Mailbox interface representing a queue where messages
 * are stored for Concerns before they are processed.
 * @interface
 */
class Mailbox {

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

/**
 * MailboxListener is the interface of classes interested in reacting to
 * enqueue events on the Mailbox.
 * @interface
 */
class EnqueueListener {

    /**
     * onEnqueue is called when a new item has been enqueued by
     * the Mailbox.
     * @param {Mailbox} mailbox
     */
    onEnqueue() {

    }

}

Mailbox.EnqueueListener = EnqueueListener;
export default Mailbox

import Mailbox from './Mailbox';

/**
 * Dispatcher provides an API for handling the actual delivery of messages.
 * @param {ConcernFactory} factory`
 */
class Dispatcher extends Mailbox.EnqueueListener {

    executeChildError() {}

    execute() {}

}

export default Dispatcher

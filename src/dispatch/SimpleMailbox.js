import beof from 'beof';
import Mailbox from './Mailbox';
import Envelope from './Envelope';

/**
 * SimpleMailbox is a simple no bacchanal Mailbox. Nothing
 * special but enqueue and dequeue behaviour.
 * @param {EnqueueListener} enqueueListener - The EnqueueListener that will be notified.
 * @implements {Mailbox}
 */
class SimpleMailbox {

    constructor(enqueueListener) {

        beof({ enqueueListener }).interface(Mailbox.EnqueueListener);

        this._messages = [];
        this._enqueueListener = enqueueListener;

    }

    enqueue(message) {

        this._messages.push(message);
        this._enqueueListener.onEnqueue(this);

    }

    dequeue() {

        if (this._messages.length > 0)
            return this._messages.shift();

        return null;

    }


}

export default SimpleMailbox

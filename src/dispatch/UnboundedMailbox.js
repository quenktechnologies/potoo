import beof from 'beof';
import Dispatcher from './Dispatcher';

/**
 * UnboundedMailbox is a simple no bacchanal Mailbox. Nothing
 * special but enqueue and dequeue behaviour, does not care if you run out of memory or not.
 * @implements {Mailbox}
 */
class UnboundedMailbox {

    constructor(dispatch) {

        beof({ dispatch }).interface(Dispatcher);

        this._messages = [];
        this._dispatch = dispatch;

    }

    enqueue(message) {

        this._messages.push(message);
        this._dispatch.dispatch();

    }

    dequeue() {

        if (this._messages.length > 0)
            return this._messages.shift();

        return null;

    }


}

export default UnboundedMailbox

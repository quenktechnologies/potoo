import { Any } from '@quenk/noni/lib/data/type';
import { Address } from '../address';

import { Envelope } from '../mailbox';

export const CTRL_MSG_RAISE = 9;
export const CTRL_MSG_SEND = 1;
export const CTRL_MSG_DROP = 3;

/**
 * RemoteError is a wrapper for errors that occur in remote actors.
 */
export class RemoteError {
    constructor(public error: Error) {}

    type = 'error';

    message = this.error.message;

    stack = this.error.stack;
}

/**
 * Raise is used to signal an error has occurred.
 */
export class Raise {
    code = CTRL_MSG_RAISE;

    constructor(
        public src: Address,
        public dest: Address,
        public message = '',
        public stack = ''
    ) {}
}

/**
 * Send indicates a interest in sending a message.
 */
export class Send extends Envelope {
    code = CTRL_MSG_SEND;
}

/**
 * Drop indicates a message has been dropped.
 */
export class Drop extends Send {
    code = CTRL_MSG_DROP;
}

/**
 * shapes that can be used to pattern match messages comming from a remote actor.
 */
export const shapes = {
    raise: {
        code: CTRL_MSG_RAISE,

        src: String,

        dest: String,

        message: String,

        stack: String
    },

    send: {
        //XXX: disabled until envelope v send is figured out.
        //       code: CTRL_MSG_SEND,

        to: String,

        from: String,

        message: Any
    },

    drop: {
        code: CTRL_MSG_DROP,

        from: String,

        to: String,

        message: Any
    }
};

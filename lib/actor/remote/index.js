"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shapes = exports.Drop = exports.Send = exports.Raise = exports.RemoteError = exports.CTRL_MSG_DROP = exports.CTRL_MSG_SEND = exports.CTRL_MSG_RAISE = void 0;
const type_1 = require("@quenk/noni/lib/data/type");
const mailbox_1 = require("../mailbox");
exports.CTRL_MSG_RAISE = 9;
exports.CTRL_MSG_SEND = 1;
exports.CTRL_MSG_DROP = 3;
/**
 * RemoteError is a wrapper for errors that occur in remote actors.
 */
class RemoteError {
    constructor(error) {
        this.error = error;
        this.type = 'error';
        this.message = this.error.message;
        this.stack = this.error.stack;
    }
}
exports.RemoteError = RemoteError;
/**
 * Raise is used to signal an error has occurred.
 */
class Raise {
    constructor(src, dest, message = '', stack = '') {
        this.src = src;
        this.dest = dest;
        this.message = message;
        this.stack = stack;
        this.code = exports.CTRL_MSG_RAISE;
    }
}
exports.Raise = Raise;
/**
 * Send indicates a interest in sending a message.
 */
class Send extends mailbox_1.Envelope {
    constructor() {
        super(...arguments);
        this.code = exports.CTRL_MSG_SEND;
    }
}
exports.Send = Send;
/**
 * Drop indicates a message has been dropped.
 */
class Drop extends Send {
    constructor() {
        super(...arguments);
        this.code = exports.CTRL_MSG_DROP;
    }
}
exports.Drop = Drop;
/**
 * shapes that can be used to pattern match messages comming from a remote actor.
 */
exports.shapes = {
    raise: {
        code: exports.CTRL_MSG_RAISE,
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
        message: type_1.Any
    },
    drop: {
        code: exports.CTRL_MSG_DROP,
        from: String,
        to: String,
        message: type_1.Any
    }
};
//# sourceMappingURL=index.js.map
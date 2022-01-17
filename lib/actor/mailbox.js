"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envelope = void 0;
/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destintations.
 */
class Envelope {
    constructor(to, from, message) {
        this.to = to;
        this.from = from;
        this.message = message;
    }
}
exports.Envelope = Envelope;
//# sourceMappingURL=mailbox.js.map
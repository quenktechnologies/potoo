"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Envelope = void 0;
/**
 * Envelope for messages.
 *
 * Used to internally keep track of message sources and destintations.
 */
var Envelope = /** @class */ (function () {
    function Envelope(to, from, message) {
        this.to = to;
        this.from = from;
        this.message = message;
    }
    return Envelope;
}());
exports.Envelope = Envelope;
//# sourceMappingURL=message.js.map
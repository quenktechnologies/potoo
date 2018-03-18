"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
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
//# sourceMappingURL=Envelope.js.map
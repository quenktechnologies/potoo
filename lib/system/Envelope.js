"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Envelope for messages.
 * @param {Address} to The actor address the message is destined to.
 * @param {Address} from The actor that originally sent the message.
 * @param <P> value The message payload type.
 */
var Envelope = /** @class */ (function () {
    function Envelope(to, from, value) {
        this.to = to;
        this.from = from;
        this.value = value;
    }
    return Envelope;
}());
exports.Envelope = Envelope;
//# sourceMappingURL=Envelope.js.map
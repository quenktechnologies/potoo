"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Receive block for messages.
 */
var Receive = /** @class */ (function () {
    function Receive(cases, system) {
        this.cases = cases;
        this.system = system;
    }
    Receive.prototype.consume = function (e) {
        if (this.cases.some(function (c) { return c.match(e.value); })) {
            this.system.log().messageReceived(e);
        }
        else {
            this.system.log().messageDropped(e);
        }
        return this;
    };
    return Receive;
}());
exports.Receive = Receive;
//# sourceMappingURL=Receive.js.map
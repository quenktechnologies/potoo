"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var event = require("../../system/log/event");
var Maybe_1 = require("afpl/lib/monad/Maybe");
/**
 * Receive block for messages.
 */
var Receive = /** @class */ (function () {
    function Receive(fn, system) {
        this.fn = fn;
        this.system = system;
    }
    Receive.prototype.apply = function (e) {
        var _this = this;
        var received = false;
        this
            .fn(e.message)
            .orElse(function () { received = true; _this.system.discard(e); });
        if (received)
            this.system.log(new event.MessageReceivedEvent(e.to, e.from, e.message));
        return Maybe_1.just(this);
    };
    return Receive;
}());
exports.Receive = Receive;
//# sourceMappingURL=Receive.js.map
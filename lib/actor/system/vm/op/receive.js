"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Receive schedules a handler for a resident actor to receive the next
 * message from its mailbox.
 *
 * Pops:
 *  1. Reference to a foreign function that will be installed as the message
 *     handler.
 */
var Receive = /** @class */ (function () {
    function Receive() {
        this.code = _1.OP_CODE_RECEIVE;
        this.level = _1.Level.Actor;
    }
    Receive.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .resolveForeign(curr.pop())
            .map(function (f) { return curr.context.behaviour.push(f); })
            .map(function () {
            curr
                .context
                .mailbox
                .map(function (box) {
                if (box.length > 0)
                    curr.context.actor.notify();
            });
        })
            .lmap(function (err) { return e.raise(err); });
    };
    Receive.prototype.toLog = function (f) {
        return ['receive', [], [f.peek()]];
    };
    return Receive;
}());
exports.Receive = Receive;
//# sourceMappingURL=receive.js.map
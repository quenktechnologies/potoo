"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Raise instruction.
 *
 * Raises an error within the system.
 * If the actor template for the source actor came with a trap function,
 * we apply it to determine what action to take next.
 *
 * Which can be one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1 until we hit the system actor which results
 * in the whole system crashing.
 *
 * Pops:
 * 1. Message indicating an error.
 */
var Raise = /** @class */ (function () {
    function Raise() {
        this.code = _1.OP_CODE_RAISE;
        this.level = _1.Level.System;
    }
    Raise.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .resolveMessage(curr.pop())
            .map(function (m) { return e.raise(m); })
            .lmap(function (err) { return e.raise(err); });
    };
    Raise.prototype.toLog = function (f) {
        return ['raise', [], [f.peek()]];
    };
    return Raise;
}());
exports.Raise = Raise;
//# sourceMappingURL=raise.js.map
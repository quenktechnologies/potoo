"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Drop an unwanted message.
 *
 * Pops:
 *
 * 1. The message to be dropped.
 */
var Drop = /** @class */ (function () {
    function Drop() {
        this.code = _1.OP_CODE_DROP;
        this.level = _1.Level.Actor;
    }
    Drop.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherMsg = curr.resolveMessage(curr.pop());
        if (eitherMsg.isLeft())
            return e.raise(eitherMsg.takeLeft());
        var m = eitherMsg.takeRight();
        e.drop(m);
    };
    Drop.prototype.toLog = function (f) {
        return ['drop', [], [f.peek()]];
    };
    return Drop;
}());
exports.Drop = Drop;
//# sourceMappingURL=drop.js.map
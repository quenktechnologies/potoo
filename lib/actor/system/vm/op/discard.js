"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("../error");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var _1 = require("./");
/**
 * Discard removes and discards the first message in a Context's mailbox.
 */
var Discard = /** @class */ (function () {
    function Discard() {
        this.code = _1.OP_CODE_DISCARD;
        this.level = _1.Level.Actor;
    }
    Discard.prototype.exec = function (e) {
        var curr = e.current().get();
        var maybBox = curr.context.mailbox;
        if (maybBox.isNothing())
            return e.raise(new errors.NoMailboxErr(e.self));
        var mayBMail = maybBox.chain(maybe_1.fromArray);
        if (mayBMail.isNothing())
            return e.raise(new errors.EmptyMailboxErr(e.self));
        mayBMail.get().shift();
    };
    Discard.prototype.toLog = function () {
        return ['discard', [], []];
    };
    return Discard;
}());
exports.Discard = Discard;
//# sourceMappingURL=discard.js.map
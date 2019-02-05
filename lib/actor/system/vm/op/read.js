"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors = require("../error");
var maybe_1 = require("@quenk/noni/lib/data/maybe");
var _1 = require("./");
/**
 * Read consumes the next message in the current actor's mailbox.
 *
 * Pushes
 *
 * The number 1 if successful or 0 if the message was not processed.
 */
var Read = /** @class */ (function () {
    function Read() {
        this.code = _1.OP_CODE_READ;
        this.level = _1.Level.Actor;
    }
    Read.prototype.exec = function (e) {
        var curr = e.current().get();
        var maybBehave = maybe_1.fromArray(curr.context.behaviour);
        if (maybBehave.isNothing())
            return e.raise(new errors.NoReceiveErr(e.self));
        var stack = maybBehave.get();
        var maybMbox = curr.context.mailbox;
        if (maybMbox.isNothing())
            return e.raise(new errors.NoMailboxErr(e.self));
        var maybHasMail = maybMbox.chain(maybe_1.fromArray);
        if (maybHasMail.isNothing()) {
            return e.raise(new errors.EmptyMailboxErr(e.self));
        }
        else {
            var mbox = maybHasMail.get();
            var eitherRead = stack[0](mbox.shift());
            if (eitherRead.isLeft()) {
                mbox.unshift(eitherRead.takeLeft());
                curr.pushNumber(0);
            }
            else {
                if (!curr.context.flags.immutable)
                    curr.context.behaviour.shift();
                curr.pushNumber(1);
            }
        }
    };
    Read.prototype.toLog = function () {
        return ['read', [], []];
    };
    return Read;
}());
exports.Read = Read;
//# sourceMappingURL=read.js.map
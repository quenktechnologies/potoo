"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("@quenk/noni/lib/control/timer");
var mailbox_1 = require("../../../mailbox");
var _1 = require("./");
/**
 * Tell delivers the first message in the outbox queue to the address
 * at the top of the data stack.
 *
 * Pops:
 * 1. Address
 * 2. Message
 *
 * Pushes:
 *
 * 1 if delivery is successful, 0 otherwise.
 */
var Tell = /** @class */ (function () {
    function Tell() {
        this.code = _1.OP_CODE_TELL;
        this.level = _1.Level.Actor;
    }
    Tell.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherAddr = curr.resolveAddress(curr.pop());
        if (eitherAddr.isLeft())
            return e.raise(eitherAddr.takeLeft());
        var eitherMsg = curr.resolveMessage(curr.pop());
        if (eitherMsg.isLeft())
            return e.raise(eitherMsg.takeRight());
        var addr = eitherAddr.takeRight();
        var msg = eitherMsg.takeRight();
        var maybeRouter = e.getRouter(addr);
        if (maybeRouter.isJust()) {
            deliver(maybeRouter.get(), new mailbox_1.Envelope(addr, curr.actor, msg));
            curr.pushNumber(1);
        }
        else {
            var maybeCtx = e.getContext(addr);
            if (maybeCtx.isJust()) {
                deliver(maybeCtx.get(), msg);
                curr.pushNumber(1);
            }
            else if (e.system.configuration.hooks &&
                e.system.configuration.hooks.drop) {
                e.system.configuration.hooks.drop(new mailbox_1.Envelope(addr, e.self, msg));
                curr.pushNumber(1);
            }
            else {
                curr.pushNumber(0);
            }
        }
    };
    Tell.prototype.toLog = function (f) {
        return ['tell', [], [f.peek(), f.peek(1)]];
    };
    return Tell;
}());
exports.Tell = Tell;
var deliver = function (ctx, msg) {
    if (ctx.mailbox.isJust()) {
        timer_1.tick(function () { ctx.mailbox.get().push(msg); ctx.actor.notify(); });
    }
    else {
        ctx.actor.accept(msg);
    }
};
//# sourceMappingURL=tell.js.map
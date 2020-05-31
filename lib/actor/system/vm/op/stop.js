"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var error = require("../error");
var record_1 = require("@quenk/noni/lib/data/record");
var address_1 = require("../../../address");
var _1 = require("./");
/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
var Stop = /** @class */ (function () {
    function Stop() {
        this.code = _1.OP_CODE_STOP;
        this.level = _1.Level.Control;
    }
    Stop.prototype.exec = function (e) {
        var curr = e.current().get();
        var eitherAddress = curr.resolveAddress(curr.pop());
        if (eitherAddress.isLeft())
            return e.raise(eitherAddress.takeLeft());
        var addr = eitherAddress.takeRight();
        var addrs = address_1.isGroup(addr) ?
            e.getGroup(addr).orJust(function () { return []; }).get() : [addr];
        addrs.every(function (a) {
            if ((!address_1.isChild(curr.actor, a)) && (a !== curr.actor)) {
                e.raise(new error.IllegalStopErr(curr.actor, a));
                return false;
            }
            var maybeChilds = e.getChildren(a);
            if (maybeChilds.isJust()) {
                var ctxs = maybeChilds.get();
                record_1.map(ctxs, function (c, k) { c.actor.stop(); e.removeContext(k); });
            }
            var maybeTarget = e.getContext(a);
            if (maybeTarget.isJust()) {
                maybeTarget.get().actor.stop();
                e.removeContext(a);
            }
            e.clear();
            return true;
        });
    };
    Stop.prototype.toLog = function (f) {
        return ['stop', [], [f.peek()]];
    };
    return Stop;
}());
exports.Stop = Stop;
//# sourceMappingURL=stop.js.map
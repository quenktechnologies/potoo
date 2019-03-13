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
        if ((!address_1.isChild(curr.actor, addr)) && (addr !== curr.actor))
            return e.raise(new error.IllegalStopErr(curr.actor, addr));
        var maybeChilds = e.getChildren(addr);
        if (maybeChilds.isJust()) {
            var ctxs = maybeChilds.get();
            record_1.map(ctxs, function (c, k) { c.actor.stop(); e.removeContext(k); });
        }
        var maybeTarget = e.getContext(addr);
        if (maybeTarget.isJust()) {
            maybeTarget.get().actor.stop();
            e.removeContext(addr);
        }
        e.clear();
    };
    Stop.prototype.toLog = function (f) {
        return ['stop', [], [f.peek()]];
    };
    return Stop;
}());
exports.Stop = Stop;
//# sourceMappingURL=stop.js.map
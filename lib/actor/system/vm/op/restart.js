"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require("./");
/**
 * Restart the current actor.
 */
var Restart = /** @class */ (function () {
    function Restart() {
        this.code = _1.OP_CODE_RESTART;
        this.level = _1.Level.Control;
    }
    Restart.prototype.exec = function (e) {
        var curr = e.current().get();
        e
            .getContext(curr.actor)
            .map(function (ctx) {
            e.clear();
            ctx.actor.stop();
            var nctx = e.allocate(curr.actor, ctx.template);
            nctx.mailbox = ctx.mailbox;
            e.putContext(curr.actor, nctx);
        });
    };
    Restart.prototype.toLog = function () {
        return ['restart', [], []];
    };
    return Restart;
}());
exports.Restart = Restart;
//# sourceMappingURL=restart.js.map
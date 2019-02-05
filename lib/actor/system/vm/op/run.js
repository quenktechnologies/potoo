"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var timer_1 = require("@quenk/noni/lib/control/timer");
var _1 = require("./");
/**
 * Run invokes the run method of an actor given the address.
 *
 * Pops
 * 1. The address of the current actor or child to be run.
 */
var Run = /** @class */ (function () {
    function Run() {
        this.code = _1.OP_CODE_RUN;
        this.level = _1.Level.Control;
    }
    Run.prototype.exec = function (e) {
        var curr = e.current().get();
        curr
            .resolveAddress(curr.pop())
            .map(function (addr) {
            e
                .getContext(addr)
                .map(function (ctx) { return timer_1.tick(function () { return ctx.actor.run(); }); });
        })
            .lmap(function (err) { return e.raise(err); });
    };
    Run.prototype.toLog = function (f) {
        return ['run', [], [f.peek()]];
    };
    return Run;
}());
exports.Run = Run;
//# sourceMappingURL=run.js.map
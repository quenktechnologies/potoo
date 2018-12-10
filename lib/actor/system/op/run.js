"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var timer_1 = require("@quenk/noni/lib/control/timer");
var _1 = require("./");
/**
 * Run instruction.
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
var Run = /** @class */ (function (_super) {
    __extends(Run, _super);
    function Run(tag, actor, delay, func) {
        var _this = _super.call(this) || this;
        _this.tag = tag;
        _this.actor = actor;
        _this.delay = delay;
        _this.func = func;
        _this.code = _1.OP_RUN;
        _this.level = log.INFO;
        return _this;
    }
    Run.prototype.exec = function (_) {
        return execRun(this);
    };
    return Run;
}(_1.Op));
exports.Run = Run;
var execRun = function (_a) {
    var func = _a.func, delay = _a.delay;
    if (delay === 0)
        timer_1.tick(func);
    else
        setTimeout(func, delay);
};
//# sourceMappingURL=run.js.map
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../log");
var record_1 = require("@quenk/noni/lib/data/record");
var function_1 = require("@quenk/noni/lib/data/function");
var state_1 = require("../state");
var restart_1 = require("./restart");
var _1 = require("./");
/**
 * Stop instruction.
 */
var Stop = /** @class */ (function (_super) {
    __extends(Stop, _super);
    function Stop(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.code = _1.OP_STOP;
        _this.level = log.WARN;
        return _this;
    }
    Stop.prototype.exec = function (s) {
        return exports.execStop(s, this);
    };
    return Stop;
}(_1.Op));
exports.Stop = Stop;
/**
 * execStop
 *
 * If the template has the restart flag set,
 * the actor will be restarted instead.
 * Otherwised it is stopped and ejected from the system.
 */
exports.execStop = function (s, _a) {
    var address = _a.address;
    return state_1.get(s.state, address)
        .map(function (f) {
        record_1.map(state_1.getChildren(s.state, address), function (_, k) {
            return s.exec(new Stop(k));
        });
        if (f.template.restart) {
            s.exec(new restart_1.Restart(address));
        }
        else {
            f.actor.stop();
            s.state = state_1.remove(s.state, address);
        }
    })
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=stop.js.map
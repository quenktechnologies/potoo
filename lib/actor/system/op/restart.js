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
var function_1 = require("@quenk/noni/lib/data/function");
var state_1 = require("../state");
var run_1 = require("./run");
var _1 = require("./");
/**
 * Restart instruction.
 */
var Restart = /** @class */ (function (_super) {
    __extends(Restart, _super);
    function Restart(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.code = _1.OP_RESTART;
        _this.level = log.INFO;
        return _this;
    }
    Restart.prototype.exec = function (s) {
        return exports.execRestart(s, this);
    };
    return Restart;
}(_1.Op));
exports.Restart = Restart;
/**
 * execRestart
 *
 * Retains the actor's mailbox and stops the current instance.
 * It is then restart by creating a new instance and invoking its
 * run method.
 */
exports.execRestart = function (s, _a) {
    var address = _a.address;
    return s
        .actors
        .get(address)
        .map(function (f) {
        f.actor.stop();
        s.actors.put(address, new state_1.Frame([], f.template.create(s), [], f.flags, f.template));
        s.exec(new run_1.Run(address, 'restart', f.template.delay || 0, function () {
            return s.actors.runInstance(address);
        }));
    })
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=restart.js.map
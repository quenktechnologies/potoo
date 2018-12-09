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
var string_1 = require("@quenk/noni/lib/data/string");
var function_1 = require("@quenk/noni/lib/data/function");
var state_1 = require("../state");
var stop_1 = require("./stop");
var raise_1 = require("./raise");
var error_1 = require("../error");
var _1 = require("./");
var IllegalKillSignal = /** @class */ (function (_super) {
    __extends(IllegalKillSignal, _super);
    function IllegalKillSignal(child, parent) {
        var _this = _super.call(this, "The actor at address \"" + parent + "\" can not kill \"" + child + "\"!") || this;
        _this.child = child;
        _this.parent = parent;
        return _this;
    }
    return IllegalKillSignal;
}(error_1.SystemError));
exports.IllegalKillSignal = IllegalKillSignal;
/**
 * Kill instruction.
 */
var Kill = /** @class */ (function (_super) {
    __extends(Kill, _super);
    function Kill(actor, child) {
        var _this = _super.call(this) || this;
        _this.actor = actor;
        _this.child = child;
        _this.code = _1.OP_KILL;
        _this.level = log.WARN;
        return _this;
    }
    Kill.prototype.exec = function (s) {
        exports.execKill(s, this);
    };
    return Kill;
}(_1.Op));
exports.Kill = Kill;
/**
 * execKill
 *
 * Verify the target child is somewhere in the hierachy of the requesting
 * actor before killing it.
 */
exports.execKill = function (s, _a) {
    var child = _a.child, actor = _a.actor;
    return state_1.getAddress(s.state, actor)
        .map(function (addr) {
        return s.exec(string_1.startsWith(child, addr) ?
            new stop_1.Stop(child) :
            new raise_1.Raise(new IllegalKillSignal(addr, child), addr, addr));
    })
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=kill.js.map
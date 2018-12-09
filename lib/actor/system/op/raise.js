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
var template = require("../../template");
var function_1 = require("@quenk/noni/lib/data/function");
var address_1 = require("../../address");
var state_1 = require("../state");
var restart_1 = require("./restart");
var stop_1 = require("./stop");
var _1 = require("./");
/**
 * Raise instruction.
 */
var Raise = /** @class */ (function (_super) {
    __extends(Raise, _super);
    function Raise(error, src, dest) {
        var _this = _super.call(this) || this;
        _this.error = error;
        _this.src = src;
        _this.dest = dest;
        _this.code = _1.OP_RAISE;
        _this.level = log.ERROR;
        return _this;
    }
    /**
     * exec Raise
     */
    Raise.prototype.exec = function (s) {
        return exports.execRaise(s, this);
    };
    return Raise;
}(_1.Op));
exports.Raise = Raise;
/**
 * execRaise
 *
 * If the actor template came with a trap we apply it to determine
 * what action to take, one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1. until we hit the system actor.
 */
exports.execRaise = function (s, _a) {
    var error = _a.error, src = _a.src, dest = _a.dest;
    return state_1.getTemplate(s.state, dest)
        .map(function (t) {
        if (t.trap != null) {
            switch (t.trap(error)) {
                case template.ACTION_RAISE:
                    s.exec(new Raise(error, src, address_1.getParent(dest)));
                    break;
                case template.ACTION_IGNORE:
                    break;
                case template.ACTION_RESTART:
                    s.exec(new restart_1.Restart(src));
                    break;
                case template.ACTION_STOP:
                    s.exec(new stop_1.Stop(src));
                    break;
                default:
                    break; //ignore
            }
        }
        else {
            s.exec(new Raise(error, src, address_1.getParent(dest)));
        }
    })
        .map(function_1.noop)
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=raise.js.map
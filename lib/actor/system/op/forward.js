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
var state_1 = require("../state");
var _1 = require("./");
/**
 * Forward instruction.
 */
var Forward = /** @class */ (function (_super) {
    __extends(Forward, _super);
    function Forward(from, to) {
        var _this = _super.call(this) || this;
        _this.from = from;
        _this.to = to;
        _this.code = _1.OP_FORWARD;
        _this.level = log.INFO;
        return _this;
    }
    Forward.prototype.exec = function (s) {
        return exports.execForward(s, this);
    };
    return Forward;
}(_1.Op));
exports.Forward = Forward;
/**
 * execForward
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
exports.execForward = function (s, _a) {
    var from = _a.from, to = _a.to;
    s.state = state_1.putRoute(s.state, from, to);
};
//# sourceMappingURL=forward.js.map
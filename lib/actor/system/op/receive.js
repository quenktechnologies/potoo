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
var function_1 = require("@quenk/noni/lib/data/function");
var state_1 = require("../state");
var check_1 = require("./check");
var _1 = require("./");
/**
 * Receive instruction.
 */
var Receive = /** @class */ (function (_super) {
    __extends(Receive, _super);
    function Receive(address, immutable, behaviour) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.immutable = immutable;
        _this.behaviour = behaviour;
        _this.code = _1.OP_RECEIVE;
        _this.level = log.INFO;
        return _this;
    }
    Receive.prototype.exec = function (s) {
        return exports.execReceive(s, this);
    };
    return Receive;
}(_1.Op));
exports.Receive = Receive;
/**
 * execReceive
 *
 * Currently only one pending receive is allowed at a time.
 */
exports.execReceive = function (s, _a) {
    var address = _a.address, behaviour = _a.behaviour;
    return state_1.get(s.state, address)
        .map(function (f) {
        return f
            .behaviour
            .push(behaviour);
    })
        .map(function () { return s.exec(new check_1.Check(address)); })
        .map(function_1.noop)
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=receive.js.map
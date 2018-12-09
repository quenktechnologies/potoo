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
var read_1 = require("./read");
var _1 = require("./");
/**
 * Check instruction.
 */
var Check = /** @class */ (function (_super) {
    __extends(Check, _super);
    function Check(address) {
        var _this = _super.call(this) || this;
        _this.address = address;
        _this.code = _1.OP_CHECK;
        _this.level = log.INFO;
        return _this;
    }
    Check.prototype.exec = function (s) {
        return exports.execCheck(s, this);
    };
    return Check;
}(_1.Op));
exports.Check = Check;
/**
 * execCheck
 *
 * Peeks at the actors mailbox for new messages and
 * schedules a Read if for the oldest one.
 */
exports.execCheck = function (s, _a) {
    var address = _a.address;
    return state_1.getBehaviour(s.state, address)
        .chain(function () { return state_1.getMessage(s.state, address); })
        .map(function (e) { return s.exec(new read_1.Read(address, e)); })
        .map(function_1.noop)
        .orJust(function_1.noop)
        .get();
};
//# sourceMappingURL=check.js.map
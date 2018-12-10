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
var _1 = require("./");
/**
 * Discard instruction.
 *
 * Drops a message from the system.
 */
var Discard = /** @class */ (function (_super) {
    __extends(Discard, _super);
    function Discard(to, from, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.message = message;
        _this.code = _1.OP_DROP;
        _this.level = log.WARN;
        return _this;
    }
    Discard.prototype.exec = function (_) { };
    return Discard;
}(_1.Op));
exports.Discard = Discard;
//# sourceMappingURL=discard.js.map
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
var _1 = require("./");
/**
 * Drop instruction.
 */
var Drop = /** @class */ (function (_super) {
    __extends(Drop, _super);
    function Drop(to, from, message) {
        var _this = _super.call(this) || this;
        _this.to = to;
        _this.from = from;
        _this.message = message;
        _this.code = _1.OP_DROP;
        _this.level = log.WARN;
        return _this;
    }
    Drop.prototype.exec = function (_) { };
    return Drop;
}(_1.Op));
exports.Drop = Drop;
//# sourceMappingURL=drop.js.map
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
var Match_1 = require("../control/Match");
/**
 * Sum
 */
var Sum = (function () {
    function Sum() {
    }
    Sum.prototype.map = function (f) {
        return Match_1.match(this)
            .caseOf(Left, function (_a) {
            var x = _a.x;
            return new Left(x.map(f));
        })
            .caseOf(Right, function (_a) {
            var y = _a.y;
            return new Right(y.map(f));
        })
            .end();
    };
    return Sum;
}());
exports.Sum = Sum;
/**
 * Left
 */
var Left = (function (_super) {
    __extends(Left, _super);
    function Left(x) {
        var _this = _super.call(this) || this;
        _this.x = x;
        return _this;
    }
    return Left;
}(Sum));
exports.Left = Left;
/**
 * Right
 */
var Right = (function (_super) {
    __extends(Right, _super);
    function Right(y) {
        var _this = _super.call(this) || this;
        _this.y = y;
        return _this;
    }
    return Right;
}(Sum));
exports.Right = Right;
/**
 * left
 */
exports.left = function (v) { return new Left(v); };
/**
 * right
 */
exports.right = function (v) { return new Right(v); };
//# sourceMappingURL=Sum.js.map
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
var util_1 = require("../util");
/**
 * Either monad implementation
 */
var Either = (function () {
    function Either() {
    }
    Either.prototype.of = function (v) {
        return new Right(v);
    };
    Either.prototype.map = function (f) {
        return Match_1.match(this)
            .caseOf(Left, util_1.identity)
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return new Right(f(r));
        })
            .end();
    };
    /**
     * bimap does a map over either side.
     */
    Either.prototype.bimap = function (f, g) {
        return Match_1.match(this)
            .caseOf(Left, function (_a) {
            var l = _a.l;
            return exports.left(f(l));
        })
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return exports.right(g(r));
        })
            .end();
    };
    /**
     * chain
     */
    Either.prototype.chain = function (f) {
        return Match_1.match(this)
            .caseOf(Left, util_1.identity)
            .caseOf(Right, function (r) { return r.map(f).join(); })
            .end();
    };
    /**
     * join an inner monad value to the outer.
     */
    Either.prototype.join = function () {
        return Match_1.match(this)
            .caseOf(Left, util_1.identity)
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return r;
        })
            .end();
    };
    /**
     * orElse returns the result of f if the Either is left.
     */
    Either.prototype.orElse = function (f) {
        return Match_1.match(this)
            .caseOf(Left, function (_a) {
            var l = _a.l;
            return f(l);
        })
            .caseOf(Right, function (x) { return x; })
            .end();
    };
    /**
     * ap
     */
    Either.prototype.ap = function (e) {
        return Match_1.match(this)
            .caseOf(Left, util_1.identity)
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return e.map(function (f) { return f(r); });
        })
            .end();
    };
    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    Either.prototype.takeLeft = function () {
        return Match_1.match(this)
            .caseOf(Left, function (_a) {
            var l = _a.l;
            return l;
        })
            .caseOf(Right, function () { throw new TypeError("Not left!"); })
            .end();
    };
    /**
     * takeRight is the opposite of left
     * @summary Either<A,B> →  B|Error
     */
    Either.prototype.takeRight = function () {
        return Match_1.match(this)
            .caseOf(Left, function () { throw new TypeError("Not right!"); })
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return r;
        })
            .end();
    };
    /**
     * cata
     */
    Either.prototype.cata = function (f, g) {
        return Match_1.match(this)
            .caseOf(Left, function (_a) {
            var l = _a.l;
            return f(l);
        })
            .caseOf(Right, function (_a) {
            var r = _a.r;
            return g(r);
        })
            .end();
    };
    return Either;
}());
exports.Either = Either;
var Left = (function (_super) {
    __extends(Left, _super);
    function Left(l) {
        var _this = _super.call(this) || this;
        _this.l = l;
        return _this;
    }
    return Left;
}(Either));
exports.Left = Left;
var Right = (function (_super) {
    __extends(Right, _super);
    function Right(r) {
        var _this = _super.call(this) || this;
        _this.r = r;
        return _this;
    }
    return Right;
}(Either));
exports.Right = Right;
/**
 * left wraps a value on the left side.
 */
exports.left = function (v) { return new Left(v); };
/**
 * right wraps a value on the right side.
 */
exports.right = function (v) { return new Right(v); };
//# sourceMappingURL=Either.js.map
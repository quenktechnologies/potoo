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
 * Maybe
 */
var Maybe = (function () {
    function Maybe() {
    }
    /**
     * of wraps the passed value in a Maybe
     */
    Maybe.prototype.of = function (a) {
        return new Just(a);
    };
    /**
     * map
     */
    Maybe.prototype.map = function (f) {
        return Match_1.match(this)
            .caseOf(Nothing, util_1.identity)
            .caseOf(Just, function (_a) {
            var a = _a.a;
            return new Just(f(a));
        })
            .end();
    };
    /**
       * join
       */
    Maybe.prototype.join = function () {
        return Match_1.match(this)
            .caseOf(Nothing, util_1.identity)
            .caseOf(Just, function (_a) {
            var a = _a.a;
            return a;
        })
            .end();
    };
    /**
     * chain
     * @summary Maybe<A> →  (A →  Maybe<B>) →  Maybe<B>
     */
    Maybe.prototype.chain = function (f) {
        return Match_1.match(this)
            .caseOf(Nothing, util_1.identity)
            .caseOf(Just, function (j) { return j.map(f).join(); })
            .end();
    };
    /**
     * get the value wrapped by the Maybe
     * @throws {TypeError} if the Maybe is Nothing
     */
    Maybe.prototype.get = function () {
        return Match_1.match(this)
            .caseOf(Nothing, function () { throw new TypeError('Cannot get anything from Nothing!'); })
            .caseOf(Just, function (_a) {
            var a = _a.a;
            return a;
        })
            .end();
    };
    /**
     * orElse applies a function for transforming Nothing into a Just
     */
    Maybe.prototype.orElse = function (f) {
        return Match_1.match(this)
            .caseOf(Nothing, f)
            .caseOf(Just, util_1.identity)
            .end();
    };
    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    Maybe.prototype.orJust = function (f) {
        return Match_1.match(this)
            .caseOf(Nothing, function () { return exports.just(f()); })
            .caseOf(Just, util_1.identity)
            .end();
    };
    /**
     * cata applies the corresponding function to the Maybe
     */
    Maybe.prototype.cata = function (f, g) {
        return Match_1.match(this)
            .caseOf(Nothing, f)
            .caseOf(Just, g)
            .end();
    };
    return Maybe;
}());
Maybe.map = function (f) { return function (m) { return m.map(f); }; };
Maybe.chain = function (f) { return function (m) { return m.chain(f); }; };
Maybe.get = function (m) { return m.get(); };
Maybe.orElse = function (f) { return function (m) { return m.orElse(f); }; };
Maybe.orJust = function (f) { return function (m) { return m.orJust(f); }; };
exports.Maybe = Maybe;
/**
 * Nothing
 */
var Nothing = (function (_super) {
    __extends(Nothing, _super);
    function Nothing() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Nothing;
}(Maybe));
exports.Nothing = Nothing;
/**
 * Just
 */
var Just = (function (_super) {
    __extends(Just, _super);
    function Just(a) {
        var _this = _super.call(this) || this;
        _this.a = a;
        return _this;
    }
    return Just;
}(Maybe));
exports.Just = Just;
exports.map = function (m) { return function (f) {
    return Match_1.match(m)
        .caseOf(Nothing, util_1.identity)
        .caseOf(Just, function (_a) {
        var a = _a.a;
        return new Just(f(a));
    })
        .end();
}; };
/**
 * just wraps a value in a Just
 */
exports.just = function (a) { return new Just(a); };
;
/**
 * nothing constructs nothing
 */
exports.nothing = function () { return new Nothing(); };
/**
 * fromAny constructs a Maybe from a value that may be null.
 */
exports.fromAny = function (a) { return a == null ? new Nothing() : exports.just(a); };
//# sourceMappingURL=Maybe.js.map
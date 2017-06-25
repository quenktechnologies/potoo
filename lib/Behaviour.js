"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * MatchAny accepts any value.
 */
var MatchAny = (function () {
    function MatchAny(f) {
        this.f = f;
    }
    MatchAny.create = function (f) {
        return new MatchAny(f);
    };
    MatchAny.prototype.willConsume = function (_) {
        return true;
    };
    MatchAny.prototype.consume = function (m) {
        this.f(m);
    };
    return MatchAny;
}());
exports.MatchAny = MatchAny;
/**
 * MatchCase
 */
var MatchCase = (function () {
    function MatchCase(cases) {
        this.cases = cases;
    }
    MatchCase.prototype.willConsume = function (m) {
        console.log('called ', this.cases.some(function (c) { return c.matches(m); }), m);
        return this.cases.some(function (c) { return c.matches(m); });
    };
    MatchCase.prototype.consume = function (m) {
        this.cases.some(function (c) { return c.matches(m) ? (c.apply(m), true) : false; });
    };
    return MatchCase;
}());
exports.MatchCase = MatchCase;
//# sourceMappingURL=Behaviour.js.map
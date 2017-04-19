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
var util_1 = require("../util");
var Either_1 = require("./Either");
var Match_1 = require("../control/Match");
/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
var Free = (function () {
    function Free() {
    }
    /**
     * of
     */
    Free.prototype.of = function (a) {
        return new Return(a);
    };
    /**
     * map
     */
    Free.prototype.map = function (f) {
        return this.chain(util_1.compose(exports.free, f));
    };
    /**
     * chain
     */
    Free.prototype.chain = function (g) {
        return Match_1.match(this)
            .caseOf(Suspend, function (_a) {
            var f = _a.f;
            return (typeof f === 'function') ?
                new Suspend(function (x) { return f(x).chain(g); }) :
                new Suspend(f.map(function (free) { return free.chain(g); }));
        })
            .caseOf(Return, function (_a) {
            var a = _a.a;
            return g(a);
        })
            .end();
    };
    /**
     * ap
     */
    // ap<B>(f: Free<(a: A) => B>): Free<F,B> {
    ///  return this.chain(x => f.map(g => g(x)));
    //}
    /**
     * apRight
     * @summary Free<F,A> →  Free<F,B> →  Free<F,B>
     */
    //  apRight<B>(f: Free<(a: A) => B>): Free<B> {
    //    return f.ap(this.map(constant(identity)));
    // }
    /**
     * resume the next stage of the computation
     */
    Free.prototype.resume = function () {
        return Match_1.match(this)
            .caseOf(Suspend, function (_a) {
            var f = _a.f;
            return Either_1.left(f);
        })
            .caseOf(Return, function (_a) {
            var a = _a.a;
            return Either_1.right(a);
        })
            .end();
    };
    /**
     * hoist
     */
    Free.prototype.hoist = function (func) {
        return Match_1.match(this)
            .caseOf(Suspend, function (_a) {
            var f = _a.f;
            return new Suspend((func(f))
                .map(function (fr) { return fr.hoist(func); }));
        })
            .caseOf(Return, util_1.identity)
            .end();
    };
    /**
     * cata
     */
    Free.prototype.cata = function (f, g) {
        return this.resume().cata(f, g);
    };
    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    Free.prototype.go = function (f) {
        return Match_1.match(this)
            .caseOf(Suspend, function (s) {
            var r = s.resume();
            while (r instanceof Either_1.Left)
                r = (f(r.takeLeft())).resume();
            return r.takeRight();
        })
            .caseOf(Return, function (_a) {
            var a = _a.a;
            return a;
        })
            .end();
    };
    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    Free.prototype.run = function () {
        return this.go(function (next) { return next(); });
    };
    return Free;
}());
exports.Free = Free;
var Suspend = (function (_super) {
    __extends(Suspend, _super);
    function Suspend(f) {
        var _this = _super.call(this) || this;
        _this.f = f;
        return _this;
    }
    return Suspend;
}(Free));
exports.Suspend = Suspend;
var Return = (function (_super) {
    __extends(Return, _super);
    function Return(a) {
        var _this = _super.call(this) || this;
        _this.a = a;
        return _this;
    }
    return Return;
}(Free));
exports.Return = Return;
/**
 * free wraps a value in a free
 */
exports.free = function (a) { return new Return(a); };
/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
exports.suspend = function (f) { return new Suspend(util_1.compose(exports.free, f)); };
/**
 * liftF lifts a Functor into a Free.
 */
exports.liftF = function (f) { return new Suspend(f.map(exports.free)); };
//# sourceMappingURL=Free.js.map
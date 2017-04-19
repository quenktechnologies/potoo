"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * State is a monadic class that we use to hold information that changes
 * during computation.
 *
 * This implementation is influenced by:
 * @link https://en.wikipedia.org/wiki/Monad_(functional_programming)#State_monads
 * @property {s →  (a, s)} a
 */
var State = (function () {
    function State(f) {
        this.f = f;
    }
    /**
     * of wraps a value in the State monad.
     * @summary A →  State<S→ {A,S}>
     */
    State.prototype.of = function (a) {
        return new State(function (s) { return ([a, s]); });
    };
    /**
     * map
     * @summary State<S → {A,S}> →  (A →  B) →  State<S →  {C, S}>
     */
    State.prototype.map = function (f) {
        var _this = this;
        return new State(function (xs) {
            var _a = _this.run(xs), a = _a[0], s = _a[1];
            return [f(a), s];
        });
    };
    /**
     * join replaces the outer State with an inner State
     */
    State.prototype.join = function () {
        var _this = this;
        return new State(function (xs) {
            var _a = _this.run(xs), a = _a[0], s = _a[1];
            return a.run(s);
        });
    };
    /**
     * chain
     */
    State.prototype.chain = function (f) {
        return this.map(f).join();
    };
    /**
     * evaluate the State returning the final value
     */
    State.prototype.evaluate = function (s) {
        return this.run(s)[0];
    };
    /**
     * execute the State returning the final state.
     */
    State.prototype.execute = function (s) {
        return this.run(s)[1];
    };
    /**
     * run the State yielding the final value and state.
     * @summary State<S→ {A<S}> →  S →  {A,S}
     */
    State.prototype.run = function (s) {
        return this.f(s);
    };
    return State;
}());
exports.State = State;
/**
 * get the state from the internals of the monad
 */
exports.get = function () { return new State(function (s) { return ([s, s]); }); };
/**
 * put
 */
exports.put = function (s) { return new State(function () { return ([null, s]); }); };
/**
 * modify the state
 * @summary  (S →  S) →  State<S →  {A, S} >
 */
exports.modify = function (f) { return exports.get().chain(function (s) { return exports.put(f(s)); }); };
/**
 * gets applies a function to the state putting using the result
 * as the result of the computation.
 * @summary (S →  A) →  State<S →  {A, S}>
 */
exports.gets = function (f) { return exports.get().chain(function (s) { return exports.state(f(s)); }); };
/**
 * state create a new State monad
 */
exports.state = function (a) { return new State(function (s) { return ([a, s]); }); };
//# sourceMappingURL=State.js.map
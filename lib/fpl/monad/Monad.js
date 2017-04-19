"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * composeK two monadic functions into one.
 */
exports.composeK = function (f, g) {
    return function (x) { return g(x).chain(f); };
};
/**
 * pipeK the result of one monadic function into another.
 */
exports.pipeK = function (f, g) {
    return function (x) { return f(x).chain(g); };
};
/**
 * chain is a partially applied version of a Monad's chain.
 * It allows us to avoid anonymous functions when chaining monads.
 */
exports.chain = function (f) { return function (m) { return m.chain(f); }; };
//# sourceMappingURL=Monad.js.map
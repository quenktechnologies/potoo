"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * liftM promotes a function a Monad
 * @summary ((A →  B), Monad<A>) →  Monad<B>
 */
exports.liftM = function (f, m) { return m.chain(function (a) { return m.constructor.of(f(a)); }); };
//# sourceMappingURL=index.js.map
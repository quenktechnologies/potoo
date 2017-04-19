"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * map is a partially applied version of a Functor's map.
 * Its purpose is to allow us to map over Functors without creating anonymous functions.
 */
exports.map = function (f) { return function (m) { return m.map(f); }; };
//# sourceMappingURL=Functor.js.map
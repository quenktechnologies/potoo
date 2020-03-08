"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLAG_IMMUTABLE = 0x1;
exports.FLAG_BUFFERED = 0x2;
exports.FLAG_ROUTER = 0x3;
/**
 * isImmutable flag test.
 */
exports.isImmutable = function (f) {
    return (f & exports.FLAG_IMMUTABLE) === exports.FLAG_IMMUTABLE;
};
/**
 * isBuffered flag test.
 */
exports.isBuffered = function (f) {
    return (f & exports.FLAG_BUFFERED) === exports.FLAG_BUFFERED;
};
/**
 * isRouter flag test.
 */
exports.isRouter = function (f) {
    return (f & exports.FLAG_ROUTER) === exports.FLAG_ROUTER;
};
//# sourceMappingURL=flags.js.map
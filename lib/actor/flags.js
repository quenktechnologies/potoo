"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isResident = exports.isRouter = exports.isBuffered = exports.isImmutable = exports.FLAG_EXIT_AFTER_RUN = exports.FLAG_RESIDENT = exports.FLAG_ROUTER = exports.FLAG_EXIT_AFTER_RECEIVE = exports.FLAG_BUFFERED = exports.FLAG_IMMUTABLE = void 0;
exports.FLAG_IMMUTABLE = 1;
exports.FLAG_BUFFERED = 2;
exports.FLAG_EXIT_AFTER_RECEIVE = 4;
exports.FLAG_ROUTER = 8;
exports.FLAG_RESIDENT = 16;
exports.FLAG_EXIT_AFTER_RUN = 32;
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
/**
 * isResident flag test.
 */
exports.isResident = function (f) { return (f & exports.FLAG_RESIDENT) === exports.FLAG_RESIDENT; };
//# sourceMappingURL=flags.js.map
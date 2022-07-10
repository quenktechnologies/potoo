"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usesVMThread = exports.isResident = exports.isRouter = exports.isBuffered = exports.isImmutable = exports.FLAG_VM_THREAD = exports.FLAG_EXIT_AFTER_RUN = exports.FLAG_RESIDENT = exports.FLAG_ROUTER = exports.FLAG_EXIT_AFTER_RECEIVE = exports.FLAG_BUFFERED = exports.FLAG_IMMUTABLE = void 0;
exports.FLAG_IMMUTABLE = 1;
exports.FLAG_BUFFERED = 2;
exports.FLAG_EXIT_AFTER_RECEIVE = 4;
exports.FLAG_ROUTER = 8;
exports.FLAG_RESIDENT = 16;
exports.FLAG_EXIT_AFTER_RUN = 32;
exports.FLAG_VM_THREAD = 64;
/**
 * isImmutable flag test.
 */
const isImmutable = (f) => (f & exports.FLAG_IMMUTABLE) === exports.FLAG_IMMUTABLE;
exports.isImmutable = isImmutable;
/**
 * isBuffered flag test.
 */
const isBuffered = (f) => (f & exports.FLAG_BUFFERED) === exports.FLAG_BUFFERED;
exports.isBuffered = isBuffered;
/**
 * isRouter flag test.
 */
const isRouter = (f) => (f & exports.FLAG_ROUTER) === exports.FLAG_ROUTER;
exports.isRouter = isRouter;
/**
 * isResident flag test.
 */
const isResident = (f) => (f & exports.FLAG_RESIDENT) === exports.FLAG_RESIDENT;
exports.isResident = isResident;
/**
 * usesVMThread flag test.
 */
const usesVMThread = (f) => (f & exports.FLAG_VM_THREAD) === exports.FLAG_VM_THREAD;
exports.usesVMThread = usesVMThread;
//# sourceMappingURL=flags.js.map
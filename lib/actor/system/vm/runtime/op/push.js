"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 */
exports.pushui8 = function (_, f, args) {
    f.pushUInt8(args);
};
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 */
exports.pushui16 = function (_, f, args) {
    f.pushUInt16(args);
};
/**
 * pushstr pushes a string onto the stack.
 */
exports.pushstr = function (_, f, args) {
    f.pushString(args);
};
/**
 * pushTmpl pushes a template onto the stack.
 */
exports.pushtmpl = function (_, f, args) {
    f.pushTemplate(args);
};
//# sourceMappingURL=push.js.map
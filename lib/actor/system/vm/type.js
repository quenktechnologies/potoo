"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPE_STEP = 0x1000000;
exports.BYTE_TYPE = 0xFF000000;
exports.BYTE_INDEX = 0xFFFFFF;
exports.TYPE_VOID = 0x0;
exports.TYPE_UINT8 = exports.TYPE_STEP;
exports.TYPE_UINT16 = exports.TYPE_STEP * 2;
exports.TYPE_UINT32 = exports.TYPE_STEP * 3;
exports.TYPE_INT8 = exports.TYPE_STEP * 4;
exports.TYPE_INT16 = exports.TYPE_STEP * 5;
exports.TYPE_INT32 = exports.TYPE_STEP * 6;
exports.TYPE_BOOLEAN = exports.TYPE_STEP * 7;
exports.TYPE_STRING = exports.TYPE_STEP * 8;
exports.TYPE_OBJECT = exports.TYPE_STEP * 9;
exports.TYPE_ARRAY = exports.TYPE_STEP * 10;
exports.TYPE_FUN = exports.TYPE_STEP * 11;
exports.TYPE_CONS = exports.TYPE_STEP * 12;
/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
exports.getType = function (d) {
    return d & exports.BYTE_TYPE;
};
//# sourceMappingURL=type.js.map
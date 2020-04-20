"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var types = require("../type");
/**
 * VoidInfo
 */
var VoidInfo = /** @class */ (function () {
    function VoidInfo(name) {
        this.name = name;
        this.type = exports.voidType;
        this.descriptor = types.TYPE_VOID;
    }
    return VoidInfo;
}());
exports.VoidInfo = VoidInfo;
/**
 * NewUInt8Info
 */
var NewUInt8Info = /** @class */ (function () {
    function NewUInt8Info(name) {
        this.name = name;
        this.type = exports.uint8Type;
        this.descriptor = types.TYPE_UINT8;
    }
    return NewUInt8Info;
}());
exports.NewUInt8Info = NewUInt8Info;
/**
 * NewUInt16Info
 */
var NewUInt16Info = /** @class */ (function () {
    function NewUInt16Info(name) {
        this.name = name;
        this.type = exports.uint16Type;
        this.descriptor = types.TYPE_UINT16;
    }
    return NewUInt16Info;
}());
exports.NewUInt16Info = NewUInt16Info;
/**
 * NewUInt32Info
 */
var NewUInt32Info = /** @class */ (function () {
    function NewUInt32Info(name) {
        this.name = name;
        this.type = exports.uint32Type;
        this.descriptor = types.TYPE_UINT32;
    }
    return NewUInt32Info;
}());
exports.NewUInt32Info = NewUInt32Info;
/**
 * NewInt8Info
 */
var NewInt8Info = /** @class */ (function () {
    function NewInt8Info(name) {
        this.name = name;
        this.type = exports.int8Type;
        this.descriptor = types.TYPE_INT8;
    }
    return NewInt8Info;
}());
exports.NewInt8Info = NewInt8Info;
/**
 * NewInt16Info
 */
var NewInt16Info = /** @class */ (function () {
    function NewInt16Info(name) {
        this.name = name;
        this.type = exports.int16Type;
        this.descriptor = types.TYPE_INT16;
    }
    return NewInt16Info;
}());
exports.NewInt16Info = NewInt16Info;
/**
 * NewInt32Info
 */
var Int32Info = /** @class */ (function () {
    function Int32Info(name) {
        this.name = name;
        this.type = exports.int32Type;
        this.descriptor = types.TYPE_INT32;
    }
    return Int32Info;
}());
exports.Int32Info = Int32Info;
/**
 * NewBooleanInfo
 */
var NewBooleanInfo = /** @class */ (function () {
    function NewBooleanInfo(name) {
        this.name = name;
        this.type = exports.booleanType;
        this.descriptor = types.TYPE_BOOLEAN;
    }
    return NewBooleanInfo;
}());
exports.NewBooleanInfo = NewBooleanInfo;
/**
 * NewStringInfo
 */
var NewStringInfo = /** @class */ (function () {
    function NewStringInfo(name) {
        this.name = name;
        this.type = exports.stringType;
        this.descriptor = types.TYPE_STRING;
    }
    return NewStringInfo;
}());
exports.NewStringInfo = NewStringInfo;
/**
 * NewObjectInfo
 */
var NewObjectInfo = /** @class */ (function () {
    function NewObjectInfo(name) {
        this.name = name;
        this.type = exports.objectType;
        this.descriptor = types.TYPE_OBJECT;
    }
    return NewObjectInfo;
}());
exports.NewObjectInfo = NewObjectInfo;
/**
 * NewArrayInfo
 */
var NewArrayInfo = /** @class */ (function () {
    function NewArrayInfo(name, type) {
        this.name = name;
        this.type = type;
        this.descriptor = types.TYPE_ARRAY;
    }
    return NewArrayInfo;
}());
exports.NewArrayInfo = NewArrayInfo;
/**
 * NewFunInfo
 */
var NewFunInfo = /** @class */ (function () {
    function NewFunInfo(name, argc, code) {
        this.name = name;
        this.argc = argc;
        this.code = code;
        this.type = exports.funType;
        this.descriptor = types.TYPE_FUN;
        this.foreign = false;
    }
    return NewFunInfo;
}());
exports.NewFunInfo = NewFunInfo;
/**
 * NewForeignFunInfo
 */
var NewForeignFunInfo = /** @class */ (function () {
    function NewForeignFunInfo(name, argc, exec) {
        this.name = name;
        this.argc = argc;
        this.exec = exec;
        this.type = exports.funType;
        this.descriptor = types.TYPE_FUN;
        this.foreign = true;
        this.code = [];
    }
    return NewForeignFunInfo;
}());
exports.NewForeignFunInfo = NewForeignFunInfo;
/**
 * NewTypeInfo
 */
var NewTypeInfo = /** @class */ (function () {
    function NewTypeInfo(name, argc, properties, descriptor) {
        if (descriptor === void 0) { descriptor = types.TYPE_OBJECT; }
        this.name = name;
        this.argc = argc;
        this.properties = properties;
        this.descriptor = descriptor;
        this.type = exports.funType;
        this.code = [];
    }
    return NewTypeInfo;
}());
exports.NewTypeInfo = NewTypeInfo;
/**
 * NewArrayTypeInfo
 */
var NewArrayTypeInfo = /** @class */ (function () {
    function NewArrayTypeInfo(name, elements) {
        this.name = name;
        this.elements = elements;
        this.type = exports.funType;
        this.argc = 0;
        this.properties = [];
        this.code = [];
        this.descriptor = types.TYPE_ARRAY;
    }
    return NewArrayTypeInfo;
}());
exports.NewArrayTypeInfo = NewArrayTypeInfo;
/**
 * NewPropInfo
 */
var NewPropInfo = /** @class */ (function () {
    function NewPropInfo(name, type) {
        this.name = name;
        this.type = type;
    }
    return NewPropInfo;
}());
exports.NewPropInfo = NewPropInfo;
/**
 * voidType constructor.
 */
exports.voidType = new NewTypeInfo('void', 0, [], types.TYPE_VOID);
/**
 * int8Type constructor.
 */
exports.int8Type = new NewTypeInfo('int8', 1, [], types.TYPE_INT8);
/**
 * int16Type constructor.
 */
exports.int16Type = new NewTypeInfo('int16', 1, [], types.TYPE_INT16);
/**
 * int32type constructor.
 */
exports.int32Type = new NewTypeInfo('int32', 1, [], types.TYPE_INT32);
/**
 * uint8Type constructor.
 */
exports.uint8Type = new NewTypeInfo('uint8', 1, [], types.TYPE_UINT8);
/**
 * uint16Type constructor.
 */
exports.uint16Type = new NewTypeInfo('uint16', 1, [], types.TYPE_UINT16);
/**
 * uint32type constructor.
 */
exports.uint32Type = new NewTypeInfo('uint32', 1, [], types.TYPE_UINT32);
/**
 * booleanType constructor.
 */
exports.booleanType = new NewTypeInfo('boolean', 1, [], types.TYPE_BOOLEAN);
/**
 * stringType constructor.
 */
exports.stringType = new NewTypeInfo('string', 1, [], types.TYPE_STRING);
/**
 * arrayType constructor.
 */
exports.arrayType = new NewTypeInfo('array', 0, [], types.TYPE_ARRAY);
/**
 * objectCons
 */
exports.objectType = new NewTypeInfo('object', 0, [], types.TYPE_OBJECT);
/**
 * funType
 */
exports.funType = new NewTypeInfo('function', 0, [], types.TYPE_FUN);
//# sourceMappingURL=info.js.map
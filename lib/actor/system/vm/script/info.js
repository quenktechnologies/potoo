"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.funType = exports.objectType = exports.arrayType = exports.stringType = exports.booleanType = exports.uint32Type = exports.uint16Type = exports.uint8Type = exports.int32Type = exports.int16Type = exports.int8Type = exports.voidType = exports.NewPropInfo = exports.NewArrayTypeInfo = exports.NewTypeInfo = exports.NewForeignFunInfo = exports.NewFunInfo = exports.NewArrayInfo = exports.NewObjectInfo = exports.NewStringInfo = exports.NewBooleanInfo = exports.NewInt32Info = exports.NewInt16Info = exports.NewInt8Info = exports.NewUInt32Info = exports.NewUInt16Info = exports.NewUInt8Info = exports.VoidInfo = exports.NewInfo = void 0;
var types = require("../type");
/**
 * NewInfo
 */
var NewInfo = /** @class */ (function () {
    function NewInfo(name) {
        this.name = name;
    }
    return NewInfo;
}());
exports.NewInfo = NewInfo;
/**
 * VoidInfo
 */
var VoidInfo = /** @class */ (function (_super) {
    __extends(VoidInfo, _super);
    function VoidInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.voidType;
        _this.descriptor = types.TYPE_VOID;
        return _this;
    }
    return VoidInfo;
}(NewInfo));
exports.VoidInfo = VoidInfo;
/**
 * NewUInt8Info
 */
var NewUInt8Info = /** @class */ (function (_super) {
    __extends(NewUInt8Info, _super);
    function NewUInt8Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.uint8Type;
        _this.descriptor = types.TYPE_UINT8;
        return _this;
    }
    return NewUInt8Info;
}(NewInfo));
exports.NewUInt8Info = NewUInt8Info;
/**
 * NewUInt16Info
 */
var NewUInt16Info = /** @class */ (function (_super) {
    __extends(NewUInt16Info, _super);
    function NewUInt16Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.uint16Type;
        _this.descriptor = types.TYPE_UINT16;
        return _this;
    }
    return NewUInt16Info;
}(NewInfo));
exports.NewUInt16Info = NewUInt16Info;
/**
 * NewUInt32Info
 */
var NewUInt32Info = /** @class */ (function (_super) {
    __extends(NewUInt32Info, _super);
    function NewUInt32Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.uint32Type;
        _this.descriptor = types.TYPE_UINT32;
        return _this;
    }
    return NewUInt32Info;
}(NewInfo));
exports.NewUInt32Info = NewUInt32Info;
/**
 * NewInt8Info
 */
var NewInt8Info = /** @class */ (function (_super) {
    __extends(NewInt8Info, _super);
    function NewInt8Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.int8Type;
        _this.descriptor = types.TYPE_INT8;
        return _this;
    }
    return NewInt8Info;
}(NewInfo));
exports.NewInt8Info = NewInt8Info;
/**
 * NewInt16Info
 */
var NewInt16Info = /** @class */ (function (_super) {
    __extends(NewInt16Info, _super);
    function NewInt16Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.int16Type;
        _this.descriptor = types.TYPE_INT16;
        return _this;
    }
    return NewInt16Info;
}(NewInfo));
exports.NewInt16Info = NewInt16Info;
/**
 * NewInt32Info
 */
var NewInt32Info = /** @class */ (function (_super) {
    __extends(NewInt32Info, _super);
    function NewInt32Info() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.int32Type;
        _this.descriptor = types.TYPE_INT32;
        return _this;
    }
    return NewInt32Info;
}(NewInfo));
exports.NewInt32Info = NewInt32Info;
/**
 * NewBooleanInfo
 */
var NewBooleanInfo = /** @class */ (function (_super) {
    __extends(NewBooleanInfo, _super);
    function NewBooleanInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.booleanType;
        _this.descriptor = types.TYPE_BOOLEAN;
        return _this;
    }
    return NewBooleanInfo;
}(NewInfo));
exports.NewBooleanInfo = NewBooleanInfo;
/**
 * NewStringInfo
 */
var NewStringInfo = /** @class */ (function (_super) {
    __extends(NewStringInfo, _super);
    function NewStringInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.stringType;
        _this.descriptor = types.TYPE_STRING;
        return _this;
    }
    return NewStringInfo;
}(NewInfo));
exports.NewStringInfo = NewStringInfo;
/**
 * NewObjectInfo
 */
var NewObjectInfo = /** @class */ (function (_super) {
    __extends(NewObjectInfo, _super);
    function NewObjectInfo() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.type = exports.objectType;
        _this.descriptor = types.TYPE_OBJECT;
        return _this;
    }
    return NewObjectInfo;
}(NewInfo));
exports.NewObjectInfo = NewObjectInfo;
/**
 * NewArrayInfo
 */
var NewArrayInfo = /** @class */ (function (_super) {
    __extends(NewArrayInfo, _super);
    function NewArrayInfo(name, type) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.type = type;
        _this.descriptor = types.TYPE_ARRAY;
        return _this;
    }
    return NewArrayInfo;
}(NewInfo));
exports.NewArrayInfo = NewArrayInfo;
/**
 * NewFunInfo
 */
var NewFunInfo = /** @class */ (function (_super) {
    __extends(NewFunInfo, _super);
    function NewFunInfo(name, argc, code) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.argc = argc;
        _this.code = code;
        _this.type = exports.funType;
        _this.descriptor = types.TYPE_FUN;
        _this.foreign = false;
        return _this;
    }
    return NewFunInfo;
}(NewInfo));
exports.NewFunInfo = NewFunInfo;
/**
 * NewForeignFunInfo
 */
var NewForeignFunInfo = /** @class */ (function (_super) {
    __extends(NewForeignFunInfo, _super);
    function NewForeignFunInfo(name, argc, exec) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.argc = argc;
        _this.exec = exec;
        _this.type = exports.funType;
        _this.descriptor = types.TYPE_FUN;
        _this.foreign = true;
        _this.code = [];
        return _this;
    }
    return NewForeignFunInfo;
}(NewInfo));
exports.NewForeignFunInfo = NewForeignFunInfo;
/**
 * NewTypeInfo
 */
var NewTypeInfo = /** @class */ (function (_super) {
    __extends(NewTypeInfo, _super);
    function NewTypeInfo(name, argc, properties, descriptor) {
        if (descriptor === void 0) { descriptor = types.TYPE_OBJECT; }
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.argc = argc;
        _this.properties = properties;
        _this.descriptor = descriptor;
        _this.type = exports.funType;
        _this.code = [];
        return _this;
    }
    return NewTypeInfo;
}(NewInfo));
exports.NewTypeInfo = NewTypeInfo;
/**
 * NewArrayTypeInfo
 */
var NewArrayTypeInfo = /** @class */ (function (_super) {
    __extends(NewArrayTypeInfo, _super);
    function NewArrayTypeInfo(name, elements) {
        var _this = _super.call(this, name) || this;
        _this.name = name;
        _this.elements = elements;
        _this.type = exports.funType;
        _this.argc = 0;
        _this.properties = [];
        _this.code = [];
        _this.descriptor = types.TYPE_ARRAY;
        return _this;
    }
    return NewArrayTypeInfo;
}(NewInfo));
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
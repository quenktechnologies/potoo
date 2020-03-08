"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INFO_TYPE_FUNCTION = 'f';
exports.INFO_TYPE_VALUE = 'v';
exports.INFO_TYPE_CONSTRUCTOR = 'c';
/**
 * PVMValueInfo
 */
var PVMValueInfo = /** @class */ (function () {
    function PVMValueInfo(name, type, builtin, code) {
        this.name = name;
        this.type = type;
        this.builtin = builtin;
        this.code = code;
        this.infoType = exports.INFO_TYPE_VALUE;
        this.foreign = false;
    }
    return PVMValueInfo;
}());
exports.PVMValueInfo = PVMValueInfo;
/**
 * ForeignValueInfo
 */
var ForeignValueInfo = /** @class */ (function () {
    function ForeignValueInfo(name, type, builtin, value) {
        this.name = name;
        this.type = type;
        this.builtin = builtin;
        this.value = value;
        this.infoType = exports.INFO_TYPE_VALUE;
        this.foreign = true;
        this.code = [];
    }
    return ForeignValueInfo;
}());
exports.ForeignValueInfo = ForeignValueInfo;
/**
 * PVMFunInfo
 */
var PVMFunInfo = /** @class */ (function () {
    function PVMFunInfo(name, argc, type, builtin, code) {
        this.name = name;
        this.argc = argc;
        this.type = type;
        this.builtin = builtin;
        this.code = code;
        this.infoType = exports.INFO_TYPE_FUNCTION;
        this.foreign = false;
    }
    return PVMFunInfo;
}());
exports.PVMFunInfo = PVMFunInfo;
/**
 * ForeignFunInfo
 */
var ForeignFunInfo = /** @class */ (function () {
    function ForeignFunInfo(name, argc, type, builtin, exec) {
        this.name = name;
        this.argc = argc;
        this.type = type;
        this.builtin = builtin;
        this.exec = exec;
        this.infoType = exports.INFO_TYPE_FUNCTION;
        this.foreign = true;
        this.code = [];
    }
    return ForeignFunInfo;
}());
exports.ForeignFunInfo = ForeignFunInfo;
/**
 * PVMConsInfo
 */
var PVMConsInfo = /** @class */ (function () {
    function PVMConsInfo(name, argc, type, builtin, properties) {
        this.name = name;
        this.argc = argc;
        this.type = type;
        this.builtin = builtin;
        this.properties = properties;
        this.infoType = exports.INFO_TYPE_CONSTRUCTOR;
        this.foreign = false;
        this.code = [];
    }
    return PVMConsInfo;
}());
exports.PVMConsInfo = PVMConsInfo;
/**
 * ForeignConsInfo
 */
var ForeignConsInfo = /** @class */ (function () {
    function ForeignConsInfo(name, argc, type, builtin, properties, exec) {
        this.name = name;
        this.argc = argc;
        this.type = type;
        this.builtin = builtin;
        this.properties = properties;
        this.exec = exec;
        this.infoType = exports.INFO_TYPE_CONSTRUCTOR;
        this.foreign = true;
        this.code = [];
    }
    return ForeignConsInfo;
}());
exports.ForeignConsInfo = ForeignConsInfo;
/**
 * PVMPropInfo
 */
var PVMPropInfo = /** @class */ (function () {
    function PVMPropInfo(name, type) {
        this.name = name;
        this.type = type;
    }
    return PVMPropInfo;
}());
exports.PVMPropInfo = PVMPropInfo;
//# sourceMappingURL=info.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.funType = exports.objectType = exports.arrayType = exports.stringType = exports.booleanType = exports.uint32Type = exports.uint16Type = exports.uint8Type = exports.int32Type = exports.int16Type = exports.int8Type = exports.voidType = exports.NewPropInfo = exports.NewArrayTypeInfo = exports.NewTypeInfo = exports.NewForeignFunInfo = exports.NewFunInfo = exports.NewArrayInfo = exports.NewObjectInfo = exports.NewStringInfo = exports.NewBooleanInfo = exports.NewInt32Info = exports.NewInt16Info = exports.NewInt8Info = exports.NewUInt32Info = exports.NewUInt16Info = exports.NewUInt8Info = exports.VoidInfo = exports.NewInfo = void 0;
const types = require("../type");
/**
 * NewInfo
 */
class NewInfo {
    constructor(name) {
        this.name = name;
    }
}
exports.NewInfo = NewInfo;
/**
 * VoidInfo
 */
class VoidInfo extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.voidType;
        this.descriptor = types.TYPE_VOID;
    }
}
exports.VoidInfo = VoidInfo;
/**
 * NewUInt8Info
 */
class NewUInt8Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.uint8Type;
        this.descriptor = types.TYPE_UINT8;
    }
}
exports.NewUInt8Info = NewUInt8Info;
/**
 * NewUInt16Info
 */
class NewUInt16Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.uint16Type;
        this.descriptor = types.TYPE_UINT16;
    }
}
exports.NewUInt16Info = NewUInt16Info;
/**
 * NewUInt32Info
 */
class NewUInt32Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.uint32Type;
        this.descriptor = types.TYPE_UINT32;
    }
}
exports.NewUInt32Info = NewUInt32Info;
/**
 * NewInt8Info
 */
class NewInt8Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.int8Type;
        this.descriptor = types.TYPE_INT8;
    }
}
exports.NewInt8Info = NewInt8Info;
/**
 * NewInt16Info
 */
class NewInt16Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.int16Type;
        this.descriptor = types.TYPE_INT16;
    }
}
exports.NewInt16Info = NewInt16Info;
/**
 * NewInt32Info
 */
class NewInt32Info extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.int32Type;
        this.descriptor = types.TYPE_INT32;
    }
}
exports.NewInt32Info = NewInt32Info;
/**
 * NewBooleanInfo
 */
class NewBooleanInfo extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.booleanType;
        this.descriptor = types.TYPE_BOOLEAN;
    }
}
exports.NewBooleanInfo = NewBooleanInfo;
/**
 * NewStringInfo
 */
class NewStringInfo extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.stringType;
        this.descriptor = types.TYPE_STRING;
    }
}
exports.NewStringInfo = NewStringInfo;
/**
 * NewObjectInfo
 */
class NewObjectInfo extends NewInfo {
    constructor() {
        super(...arguments);
        this.type = exports.objectType;
        this.descriptor = types.TYPE_OBJECT;
    }
}
exports.NewObjectInfo = NewObjectInfo;
/**
 * NewArrayInfo
 */
class NewArrayInfo extends NewInfo {
    constructor(name, type) {
        super(name);
        this.name = name;
        this.type = type;
        this.descriptor = types.TYPE_ARRAY;
    }
}
exports.NewArrayInfo = NewArrayInfo;
/**
 * NewFunInfo
 */
class NewFunInfo extends NewInfo {
    constructor(name, argc, code) {
        super(name);
        this.name = name;
        this.argc = argc;
        this.code = code;
        this.type = exports.funType;
        this.descriptor = types.TYPE_FUN;
        this.foreign = false;
    }
}
exports.NewFunInfo = NewFunInfo;
/**
 * NewForeignFunInfo
 */
class NewForeignFunInfo extends NewInfo {
    constructor(name, argc, exec) {
        super(name);
        this.name = name;
        this.argc = argc;
        this.exec = exec;
        this.type = exports.funType;
        this.descriptor = types.TYPE_FUN;
        this.foreign = true;
        this.code = [];
    }
}
exports.NewForeignFunInfo = NewForeignFunInfo;
/**
 * NewTypeInfo
 */
class NewTypeInfo extends NewInfo {
    constructor(name, argc, properties, descriptor = types.TYPE_OBJECT) {
        super(name);
        this.name = name;
        this.argc = argc;
        this.properties = properties;
        this.descriptor = descriptor;
        this.type = exports.funType;
        this.code = [];
    }
}
exports.NewTypeInfo = NewTypeInfo;
/**
 * NewArrayTypeInfo
 */
class NewArrayTypeInfo extends NewInfo {
    constructor(name, elements) {
        super(name);
        this.name = name;
        this.elements = elements;
        this.type = exports.funType;
        this.argc = 0;
        this.properties = [];
        this.code = [];
        this.descriptor = types.TYPE_ARRAY;
    }
}
exports.NewArrayTypeInfo = NewArrayTypeInfo;
/**
 * NewPropInfo
 */
class NewPropInfo {
    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}
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
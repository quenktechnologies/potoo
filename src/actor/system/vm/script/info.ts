import * as types from '../type';

import { ForeignFun, TypeDescriptor } from '../type';
import { Instruction } from '../op';

/**
 * Info objects provide important information about named identifiers appearing
 * in the compiled source.
 */
export interface Info {
    /**
     * type is the TypeInfo object of the indentifier.
     */
    type: TypeInfo;

    /**
     * name of the identifier as it appears in source text.
     */
    name: string;

    /**
     * descriptor
     */
    descriptor: TypeDescriptor;
}

/**
 * TypeInfo holds type information about a named identifier.
 *
 * In effect, it describes the constructor of a symbol and is itself a symbol.
 */
export interface TypeInfo extends Info {
    /**
     * properties is an array of property info objects that describe the
     * properties of objects created with this constructor.
     */
    properties: PropInfo[];
}

/**
 * ArrayTypeInfo is a TypeInfo for array types.
 *
 * This structure exists because arrays can be recursive and may need to
 * retain nested type information on their elements.
 */
export interface ArrayTypeInfo extends TypeInfo {
    /**
     * elements indicates the type of the array's elements.
     */
    elements: TypeInfo;
}

/**
 * FunInfo maintains information about compiled functions.
 */
export interface FunInfo extends Info {
    /**
     * argc is the argument count of the function.
     */
    argc: number;

    /**
     * code section.
     */
    code: Instruction[];

    /**
     * foreign indicates whether the function is implemented using a JS
     * function.
     * If so, the exec property must be provided.
     */
    foreign: boolean;
}

/**
 * ForeignFunInfo maintains information about foreigin functions.
 */
export interface ForeignFunInfo extends FunInfo {
    /**
     * exec (foreign only).
     */
    exec: ForeignFun;
}

/**
 * PropInfo holds information about a property on an object.
 */
export interface PropInfo {
    /**
     * name of the property.
     */
    name: string;

    /**
     * type information about the property.
     */
    type: TypeInfo;
}

/**
 * NewInfo
 */
export abstract class NewInfo implements Info {
    constructor(public name: string) {}

    abstract type: TypeInfo;

    abstract descriptor: number;
}

/**
 * VoidInfo
 */
export class VoidInfo extends NewInfo {
    type = voidType;

    descriptor = types.TYPE_VOID;
}

/**
 * NewUInt8Info
 */
export class NewUInt8Info extends NewInfo {
    type = uint8Type;

    descriptor = types.TYPE_UINT8;
}

/**
 * NewUInt16Info
 */
export class NewUInt16Info extends NewInfo {
    type = uint16Type;

    descriptor = types.TYPE_UINT16;
}

/**
 * NewUInt32Info
 */
export class NewUInt32Info extends NewInfo {
    type = uint32Type;

    descriptor = types.TYPE_UINT32;
}

/**
 * NewInt8Info
 */
export class NewInt8Info extends NewInfo {
    type = int8Type;

    descriptor = types.TYPE_INT8;
}

/**
 * NewInt16Info
 */
export class NewInt16Info extends NewInfo {
    type = int16Type;

    descriptor = types.TYPE_INT16;
}

/**
 * NewInt32Info
 */
export class NewInt32Info extends NewInfo {
    type = int32Type;

    descriptor = types.TYPE_INT32;
}

/**
 * NewBooleanInfo
 */
export class NewBooleanInfo extends NewInfo {
    type = booleanType;

    descriptor = types.TYPE_BOOLEAN;
}

/**
 * NewStringInfo
 */
export class NewStringInfo extends NewInfo {
    type = stringType;

    descriptor = types.TYPE_STRING;
}

/**
 * NewObjectInfo
 */
export class NewObjectInfo extends NewInfo {
    type = objectType;

    descriptor = types.TYPE_OBJECT;
}

/**
 * NewArrayInfo
 */
export class NewArrayInfo extends NewInfo {
    constructor(
        public name: string,
        public type: ArrayTypeInfo
    ) {
        super(name);
    }

    descriptor = types.TYPE_LIST;
}

/**
 * NewFunInfo
 */
export class NewFunInfo extends NewInfo implements FunInfo {
    constructor(
        public name: string,
        public argc: number,
        public code: Instruction[]
    ) {
        super(name);
    }

    type = funType;

    descriptor = types.TYPE_FUN;

    foreign = false;
}

/**
 * NewForeignFunInfo
 */
export class NewForeignFunInfo extends NewInfo implements FunInfo {
    constructor(
        public name: string,
        public argc: number,
        public exec: ForeignFun
    ) {
        super(name);
    }

    type = funType;

    descriptor = types.TYPE_FUN;

    foreign = true;

    code = [];
}

/**
 * NewTypeInfo
 */
export class NewTypeInfo extends NewInfo implements TypeInfo {
    constructor(
        public name: string,
        public argc: number,
        public properties: PropInfo[],
        public descriptor = types.TYPE_OBJECT
    ) {
        super(name);
    }

    type = funType;

    code = [];
}

/**
 * NewArrayTypeInfo
 */
export class NewArrayTypeInfo extends NewInfo implements ArrayTypeInfo {
    constructor(
        public name: string,
        public elements: TypeInfo
    ) {
        super(name);
    }

    type = funType;

    argc = 0;

    properties = [];

    code = [];

    descriptor = types.TYPE_LIST;
}

/**
 * NewPropInfo
 */
export class NewPropInfo implements PropInfo {
    constructor(
        public name: string,
        public type: TypeInfo
    ) {}
}

/**
 * voidType constructor.
 */
export const voidType = new NewTypeInfo('void', 0, [], types.TYPE_VOID);

/**
 * int8Type constructor.
 */
export const int8Type = new NewTypeInfo('int8', 1, [], types.TYPE_INT8);

/**
 * int16Type constructor.
 */
export const int16Type = new NewTypeInfo('int16', 1, [], types.TYPE_INT16);

/**
 * int32type constructor.
 */
export const int32Type = new NewTypeInfo('int32', 1, [], types.TYPE_INT32);

/**
 * uint8Type constructor.
 */
export const uint8Type = new NewTypeInfo('uint8', 1, [], types.TYPE_UINT8);

/**
 * uint16Type constructor.
 */
export const uint16Type = new NewTypeInfo('uint16', 1, [], types.TYPE_UINT16);

/**
 * uint32type constructor.
 */
export const uint32Type = new NewTypeInfo('uint32', 1, [], types.TYPE_UINT32);

/**
 * booleanType constructor.
 */
export const booleanType = new NewTypeInfo(
    'boolean',
    1,
    [],
    types.TYPE_BOOLEAN
);

/**
 * stringType constructor.
 */
export const stringType = new NewTypeInfo('string', 1, [], types.TYPE_STRING);

/**
 * arrayType constructor.
 */
export const arrayType = new NewTypeInfo('array', 0, [], types.TYPE_LIST);

/**
 * objectCons
 */
export const objectType = new NewTypeInfo('object', 0, [], types.TYPE_OBJECT);

/**
 * funType
 */
export const funType = new NewTypeInfo('function', 0, [], types.TYPE_FUN);

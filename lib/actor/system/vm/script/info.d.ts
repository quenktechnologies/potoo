import { Instruction } from '../runtime';
import { ForeignFun, TypeDescriptor } from '../type';
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
 * VoidInfo
 */
export declare class VoidInfo implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewUInt8Info
 */
export declare class NewUInt8Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewUInt16Info
 */
export declare class NewUInt16Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewUInt32Info
 */
export declare class NewUInt32Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewInt8Info
 */
export declare class NewInt8Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewInt16Info
 */
export declare class NewInt16Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewInt32Info
 */
export declare class Int32Info implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewBooleanInfo
 */
export declare class NewBooleanInfo implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewStringInfo
 */
export declare class NewStringInfo implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewObjectInfo
 */
export declare class NewObjectInfo implements Info {
    name: string;
    constructor(name: string);
    type: NewTypeInfo;
    descriptor: number;
}
/**
 * NewArrayInfo
 */
export declare class NewArrayInfo implements Info {
    name: string;
    type: ArrayTypeInfo;
    constructor(name: string, type: ArrayTypeInfo);
    descriptor: number;
}
/**
 * NewFunInfo
 */
export declare class NewFunInfo implements FunInfo {
    name: string;
    argc: number;
    code: Instruction[];
    constructor(name: string, argc: number, code: Instruction[]);
    type: NewTypeInfo;
    descriptor: number;
    foreign: boolean;
}
/**
 * NewForeignFunInfo
 */
export declare class NewForeignFunInfo implements FunInfo {
    name: string;
    argc: number;
    exec: ForeignFun;
    constructor(name: string, argc: number, exec: ForeignFun);
    type: NewTypeInfo;
    descriptor: number;
    foreign: boolean;
    code: never[];
}
/**
 * NewTypeInfo
 */
export declare class NewTypeInfo implements TypeInfo {
    name: string;
    argc: number;
    properties: PropInfo[];
    descriptor: number;
    constructor(name: string, argc: number, properties: PropInfo[], descriptor?: number);
    type: NewTypeInfo;
    code: never[];
}
/**
 * NewArrayTypeInfo
 */
export declare class NewArrayTypeInfo implements TypeInfo {
    name: string;
    elements: TypeInfo;
    constructor(name: string, elements: TypeInfo);
    type: NewTypeInfo;
    argc: number;
    properties: never[];
    code: never[];
    descriptor: number;
}
/**
 * NewPropInfo
 */
export declare class NewPropInfo implements PropInfo {
    name: string;
    type: TypeInfo;
    constructor(name: string, type: TypeInfo);
}
/**
 * voidType constructor.
 */
export declare const voidType: NewTypeInfo;
/**
 * int8Type constructor.
 */
export declare const int8Type: NewTypeInfo;
/**
 * int16Type constructor.
 */
export declare const int16Type: NewTypeInfo;
/**
 * int32type constructor.
 */
export declare const int32Type: NewTypeInfo;
/**
 * uint8Type constructor.
 */
export declare const uint8Type: NewTypeInfo;
/**
 * uint16Type constructor.
 */
export declare const uint16Type: NewTypeInfo;
/**
 * uint32type constructor.
 */
export declare const uint32Type: NewTypeInfo;
/**
 * booleanType constructor.
 */
export declare const booleanType: NewTypeInfo;
/**
 * stringType constructor.
 */
export declare const stringType: NewTypeInfo;
/**
 * arrayType constructor.
 */
export declare const arrayType: NewTypeInfo;
/**
 * objectCons
 */
export declare const objectType: NewTypeInfo;
/**
 * funType
 */
export declare const funType: NewTypeInfo;

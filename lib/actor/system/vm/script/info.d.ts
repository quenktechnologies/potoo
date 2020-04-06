import { Instruction } from '../runtime';
import { PVM_Value } from './';
export declare const INFO_TYPE_FUNCTION = "f";
export declare const INFO_TYPE_VALUE = "v";
export declare const INFO_TYPE_CONSTRUCTOR = "c";
export declare const TYPE_VOID = 0;
export declare const TYPE_UINT8 = 1;
export declare const TYPE_UINT16 = 2;
export declare const TYPE_UINT32 = 3;
export declare const TYPE_STRING = 10;
export declare const TYPE_ARRAY = 20;
export declare const TYPE_OBJECT = 21;
export declare const TYPE_TEMPLATE = 32;
/**
 * Info objects provide information about named symbols appearing in the
 * scripts source.
 *
 * These are used by various opcodes.
 */
export declare type Info = FunInfo | ValueInfo;
/**
 * BaseInfo
 */
export interface BaseInfo {
    /**
     *infoType indicates the type of *Info object.
     */
    infoType: string;
    /**
     * type indicates the type of the symbol (or return type for functions).
     *
     * This is an index into into the pool of symbols or a builtin type number
     * if the builtin value is true.
     */
    type: number;
    /**
     * builtin indicates whether the type is a builtin primitive or
     * originates from a user defined constructor.
     */
    builtin: boolean;
    /**
     * name of the symbol as it appears in source text.
     */
    name: string;
    /**
     * foreign indicates whether the implementation is foreign (native).
     */
    foreign: boolean;
}
/**
 * ValueInfo stores information about variables at the top level script scope.
 */
export interface ValueInfo extends BaseInfo {
    /**
     * value (foreign only).
     *
     * This is the value of the global.
     */
    value?: PVM_Value;
}
/**
 * FunInfo maintains information about compiled functions in a script.
 */
export interface FunInfo extends BaseInfo {
    /**
     * argc is the argument count of the function.
     */
    argc: number;
    /**
     * type indicates the return type of the function.
     *
     * This is either a number indicating one of the primitive/builtin types
     * or a pointer into the cons section of the script.
     *
     * TODO: Review the feasibility of this pointer.
     */
    type: number;
    /**
     * code section of the function.
     */
    code: Instruction[];
    /**
     * exec (foreign only).
     */
    exec?: Function;
}
/**
 * ConstructorInfo holds information about constructor types.
 */
export interface ConstructorInfo extends FunInfo {
    /**
     * properties is an array of property info objects that describe the
     * properties of objects created with this constructor.
     */
    properties: PropInfo[];
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
     * has the same meaning as in FunInfo.
     */
    type: number;
}
/**
 * PVMValueInfo
 */
export declare class PVMValueInfo implements ValueInfo {
    name: string;
    type: number;
    builtin: boolean;
    code: Instruction[];
    constructor(name: string, type: number, builtin: boolean, code: Instruction[]);
    infoType: string;
    foreign: boolean;
}
/**
 * ForeignValueInfo
 */
export declare class ForeignValueInfo implements ValueInfo {
    name: string;
    type: number;
    builtin: boolean;
    value: PVM_Value;
    constructor(name: string, type: number, builtin: boolean, value: PVM_Value);
    infoType: string;
    foreign: boolean;
    code: never[];
}
/**
 * PVMFunInfo
 */
export declare class PVMFunInfo implements FunInfo {
    name: string;
    argc: number;
    type: number;
    builtin: boolean;
    code: Instruction[];
    constructor(name: string, argc: number, type: number, builtin: boolean, code: Instruction[]);
    infoType: string;
    foreign: boolean;
}
/**
 * ForeignFunInfo
 */
export declare class ForeignFunInfo implements FunInfo {
    name: string;
    argc: number;
    type: number;
    builtin: boolean;
    exec: Function;
    constructor(name: string, argc: number, type: number, builtin: boolean, exec: Function);
    infoType: string;
    foreign: boolean;
    code: never[];
}
/**
 * PVMConsInfo
 */
export declare class PVMConsInfo implements ConstructorInfo {
    name: string;
    argc: number;
    type: number;
    builtin: boolean;
    properties: PropInfo[];
    constructor(name: string, argc: number, type: number, builtin: boolean, properties: PropInfo[]);
    infoType: string;
    foreign: boolean;
    code: never[];
}
/**
 * ForeignConsInfo
 */
export declare class ForeignConsInfo implements ConstructorInfo {
    name: string;
    argc: number;
    type: number;
    builtin: boolean;
    properties: PropInfo[];
    exec: Function;
    constructor(name: string, argc: number, type: number, builtin: boolean, properties: PropInfo[], exec: Function);
    infoType: string;
    foreign: boolean;
    code: never[];
}
/**
 * PVMPropInfo
 */
export declare class PVMPropInfo implements PropInfo {
    name: string;
    type: number;
    constructor(name: string, type: number);
}

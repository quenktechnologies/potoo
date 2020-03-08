import { Instruction } from '../runtime';
import { PVM_Value } from './';

export const INFO_TYPE_FUNCTION = 'f';
export const INFO_TYPE_VALUE = 'v';
export const INFO_TYPE_CONSTRUCTOR = 'c';

/**
 * Info objects provide information about named symbols appearing in the
 * scripts source.
 *
 * These are used by various opcodes.
 */
export type Info
    = FunInfo
    | ValueInfo
    ;

/**
 * BaseInfo
 */
export interface BaseInfo {

    /**
     *infoType indicates the type of *Info object.
     */
    infoType: string,

    /**
     * type indicates the type of the symbol (or return type for functions).
     *
     * This is an index into into the pool of symbols or a builtin type number
     * if the builtin value is true.
     */
    type: number,

    /**
     * builtin indicates whether the type is a builtin primitive or 
     * originates from a user defined constructor.
     */
    builtin: boolean,

    /**
     * name of the symbol as it appears in source text.
     */
    name: string,

    /**
     * foreign indicates whether the implementation is foreign (native).
     */
    foreign: boolean

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
    value?: PVM_Value

}

/**
 * FunInfo maintains information about compiled functions in a script.
 */
export interface FunInfo extends BaseInfo {

    /**
     * argc is the argument count of the function.
     */
    argc: number,

    /**
     * type indicates the return type of the function.
     *
     * This is either a number indicating one of the primitive/builtin types
     * or a pointer into the cons section of the script.
     *
     * TODO: Review the feasibility of this pointer.
     */
    type: number,

    /**
     * code section of the function.
     */
    code: Instruction[],

    /**
     * exec (foreign only).
     */
    exec?: Function

}

/**
 * ConstructorInfo holds information about constructor types.
 */
export interface ConstructorInfo extends FunInfo {

    /**
     * properties is an array of property info objects that describe the 
     * properties of objects created with this constructor.
     */
    properties: PropInfo[]

}

/**
 * PropInfo holds information about a property on an object.
 */
export interface PropInfo {

    /**
     * name of the property.
     */
    name: string,

    /**
     * has the same meaning as in FunInfo.
     */
    type: number

}

/**
 * PVMValueInfo
 */
export class PVMValueInfo implements ValueInfo {

    constructor(
        public name: string,
        public type: number,
        public builtin: boolean,
        public code: Instruction[]) { }

    infoType = INFO_TYPE_VALUE;

    foreign = false;

}

/**
 * ForeignValueInfo
 */
export class ForeignValueInfo implements ValueInfo {

    constructor(
        public name: string,
        public type: number,
        public builtin: boolean,
        public value: PVM_Value[]) { }

    infoType = INFO_TYPE_VALUE;

    foreign = true;

    code = [];

}

/**
 * PVMFunInfo
 */
export class PVMFunInfo implements FunInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public builtin: boolean,
        public code: Instruction[]) { }

    infoType = INFO_TYPE_FUNCTION;

    foreign = false;

}

/**
 * ForeignFunInfo
 */
export class ForeignFunInfo implements FunInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public builtin: boolean,
        public exec: Function) { }

    infoType = INFO_TYPE_FUNCTION;

    foreign = true;

    code = [];

}

/**
 * PVMConsInfo
 */
export class PVMConsInfo implements ConstructorInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public builtin: boolean,
        public properties: PropInfo[]) { }

    infoType = INFO_TYPE_CONSTRUCTOR;

    foreign = false;

    code = [];

}

/**
 * ForeignConsInfo
 */
export class ForeignConsInfo implements ConstructorInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public builtin: boolean,
        public properties: PropInfo[],
        public exec: Function) { }

    infoType = INFO_TYPE_CONSTRUCTOR;

    foreign = true;

    code = [];

}

/**
 * PVMPropInfo
 */
export class PVMPropInfo implements PropInfo {

    constructor(public name: string, public type: number) { }

}

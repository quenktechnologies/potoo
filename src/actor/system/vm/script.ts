import { Template } from '../../template';
import { Message } from '../../message';
import { Receiver } from '../../context';
import { System } from '../';
import { HeapObject } from './runtime/heap';
import { Instruction } from './runtime';

export const CONSTANTS_INDEX_NUMBER = 0;
export const CONSTANTS_INDEX_STRING = 1;

export const INFO_TYPE_FUNCTION = 'f';

/**
 * PVMValue corresponds to the PVM supported data types that are stored
 * in the constants pool.
 */
export type PVM_Value
    = PVM_Number
    | PVM_String
    | PVM_Function
    | PVM_Object
    | PVM_Array
    | PVM_Receiver
    ;

/**
 * PVM_Number 
 *
 * This is of course the ECMAScript double however PVM only
 * supports 32 bit values.
 *
 * Anything more is considered unsafe.
 */
export type PVM_Number = number;

/**
 * PVM_String is a UTF-16 formatted string corresponding to the ECMAScript
 * string type.
 */
export type PVM_String = string;

/**
 * PVM_Function stores needed information about vm functions.
 */
export type PVM_Function = FunInfo;

/**
 * PVM_Object is any vm data object.
 */
export type PVM_Object = HeapObject;

/**
 * PVM_Array is any vm data array.
 */
export type PVM_Array
    = PVM_Number[]
    | PVM_String[]
    | PVM_Object[]
    ;

/**
 * PVM_Template is a potoo template used to spawn new actors.
 */
export type PVM_Template = Template<System>;

/**
 * PVM_Message is an opaque value that can be passed between actors.
 */
export type PVM_Message = Message;

/**
 * PVM_Receiver
 *
 * TODO: In future this may be merged into function.
 */
export type PVM_Receiver = Receiver;

/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 */
export type Constants = [PVM_Number[], PVM_String[]];

/**
 * FunInfo maintains information about compiled functions in a script.
 */
export interface FunInfo {

    /**
     *infoType indicates the type of *Info object.
     */
    infoType: string,

    /**
     * name of the function as it appears in source text
     */
    name: string,

    /**
     * argc is the argument count of the function.
     */
    argc: number,

    /**
     * type indicates the return type of the function.
     *
     * This is either a number indicating one of the primitive/builtin types
     * or a pointer into the cons section of the script.
     */
    type: number,

    /**
     * foreign indicates whether the implementation is foreign (native).
     */
    foreign: boolean,

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
 * ConsInfo holds information about constructor types.
 */
export interface ConsInfo extends FunInfo {

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
 * PVMFunInfo
 */
export class PVMFunInfo implements FunInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
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
        public exec: Function) { }

    infoType = INFO_TYPE_FUNCTION;

    foreign = true;

    code = [];

}

/**
 * PVMConsInfo
 */
export class PVMConsInfo implements FunInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public properties: PropInfo[]) { }

    infoType = INFO_TYPE_FUNCTION;

    foreign = false;

    code = [];

}

/**
 * ForeignConsInfo
 */
export class ForeignConsInfo implements FunInfo {

    constructor(
        public name: string,
        public argc: number,
        public type: number,
        public properties: PropInfo[],
        public exec: Function) { }

    infoType = INFO_TYPE_FUNCTION;

    foreign = true;

    code = [];

}

/**
 * PVMPropInfo
 */
export class PVMPropInfo implements PropInfo {

    constructor(public name: string, public type: number) { }

}

/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 *
 * @param constants - The constant pool for the actor where certain references
 *                    are resolved from.
 *
 * @param cons      - Information about compiled constructors occuring in the
 *                    script.
 *
 * @param funs      - Information about compiled functions occuring in 
 *                    the script.
 *
 * @param code      - The actual instructions the VM will execute.
 */
export class Script {

    constructor(
        public constants: Constants = [[], []],
        public cons: ConsInfo[] = [],
        public funs: FunInfo[] = [],
        public receivers: Receiver[] = [],
        public code: Instruction[] = []) { }

}

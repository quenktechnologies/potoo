import { Template } from '../../../template';
import { Message } from '../../../message';
import { HeapObject } from '../runtime/heap';
import { Instruction } from '../runtime';
import { System } from '../../';
import { Info, FunInfo } from './info';

export const CONSTANTS_INDEX_NUMBER = 0;
export const CONSTANTS_INDEX_STRING = 1;

export const INFO_TYPE_FUNCTION = 'f';
export const INFO_TYPE_GLOBAL = 'g';

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
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 */
export type Constants = [PVM_Number[], PVM_String[]];


/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 */
export interface Script {

    /**
     * name of the Script.
     * This is an absolute path or an id for dynamically generated scripts.
     */
    name: string,

    /**
     * constants pool for the actor where certain references are resolved from.
     */
    constants: Constants,

    /**
     * info is a table of various named structures within the script source.
     */
    info: Info[]

    /**    
     * code is the actual instructions the VM will execute.
     */
    code: Instruction[]

}

/**
 * PScript provides a constructor for creating Scripts.
 */
export class PScript implements Script {

    constructor(
        public name: string,
        public constants: Constants = [[], []],
        public info: Info[] = [],
        public code: Instruction[] = [],
        public immediate = false) { }

}

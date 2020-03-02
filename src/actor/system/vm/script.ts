import { Template } from '../../template';
import { Message } from '../../message';
import { Instruction } from './runtime';
import { System } from '..';

export const PVM_TYPE_INDEX_FLOAT64 = 0;
export const PVM_TYPE_INDEX_STRING = 1;
export const PVM_TYPE_INDEX_ADDRESS = 1;
export const PVM_TYPE_INDEX_TEMPLATE = 2;
export const PVM_TYPE_INDEX_MESSAGE = 3;

/**
 * PVMValue corresponds to the PVM supported data types that are stored
 * in the constants pool.
 */
export type PVM_Value
    = PVM_Float64
    | PVM_String
    | PVM_Template
    | PVM_Message
    ;

/**
 * PVM_Float64 is the IEEE 754 double.
 *
 * Corresponds to the ECMAScript number type.
 */
export type PVM_Float64 = number;

/**
 * PVM_String is a UTF-16 formatted string corresponding to the ECMAScript
 * string type.
 */
export type PVM_String = string;

/**
 * PVM_Template is a potoo template used to spawn new actors.
 */
export type PVM_Template = Template<System>;

/**
 * PVM_Message is an opaque value that can be passed between actors.
 */
export type PVM_Message = any;

/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 *
 * Access to these values happens by using first the index of its type
 * then the following index within the type's table.
 */
export type Constants = [PVM_Float64[], PVM_String[], PVM_Template[], Message[]];

/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 *
 * @param constants - The constant pool for the actor where certain references
 *                    are resolved from.
 *
 * @param code      - The actual instructions the VM will execute.
 */
export class Script {

    constructor(
        public constants: Constants = [[], [], [], [],],
        public code: Instruction[] = []) { }

}

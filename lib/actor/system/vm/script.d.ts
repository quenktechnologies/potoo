import { Template } from '../../template';
import { Message } from '../../message';
import { Instruction } from './runtime';
import { System } from '..';
export declare const PVM_TYPE_INDEX_FLOAT64 = 0;
export declare const PVM_TYPE_INDEX_STRING = 1;
export declare const PVM_TYPE_INDEX_ADDRESS = 1;
export declare const PVM_TYPE_INDEX_TEMPLATE = 2;
export declare const PVM_TYPE_INDEX_MESSAGE = 3;
/**
 * PVMValue corresponds to the PVM supported data types that are stored
 * in the constants pool.
 */
export declare type PVM_Value = PVM_Float64 | PVM_String | PVM_Template | PVM_Message;
/**
 * PVM_Float64 is the IEEE 754 double.
 *
 * Corresponds to the ECMAScript number type.
 */
export declare type PVM_Float64 = number;
/**
 * PVM_String is a UTF-16 formatted string corresponding to the ECMAScript
 * string type.
 */
export declare type PVM_String = string;
/**
 * PVM_Template is a potoo template used to spawn new actors.
 */
export declare type PVM_Template = Template<System>;
/**
 * PVM_Message is an opaque value that can be passed between actors.
 */
export declare type PVM_Message = any;
/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 *
 * Access to these values happens by using first the index of its type
 * then the following index within the type's table.
 */
export declare type Constants = [PVM_Float64[], PVM_String[], PVM_Template[], Message[]];
/**
 * Script contains the code and supporting information of an actor used by
 * the VM for code execution.
 *
 * @param constants - The constant pool for the actor where certain references
 *                    are resolved from.
 *
 * @param code      - The actual instructions the VM will execute.
 */
export declare class Script {
    constants: Constants;
    code: Instruction[];
    constructor(constants?: Constants, code?: Instruction[]);
}

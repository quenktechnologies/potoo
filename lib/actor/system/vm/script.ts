import { Template } from '../../template';
import { Message } from '../../message';
import { System } from '../';
import { Op } from './op';

/**
 * Function type.
 */
export type Function
    = () => Op[]
    ;

/**
 * Foreign function type.
 */
export type Foreign
    = (...arg: Value) => Value
    ;

/**
 * Value corresponds to the VM's supported types.
 */
export type Value
    = number
    | string
    | Function
    | Template<System>
    | Message
    ;

/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 *
 * Access to these values happens by using first the index of its type
 * then the following index within the type's table.
 */
export type Constants
    = [
        number[],
        string[],
        Function[],
        Template<System>[],
        Message[],
        Foreign[]
    ]
    ;

/**
 * Script is a "program" an actor submits to the Runtime run execute.
 *
 * It consists of the following sections:
 * 1. constants - Static values referenced in the code section.
 * 2. code - A list of one or more Op codes to execute in sequence.
 */
export class Script {

    constructor(
        public constants: Constants = [[], [], [], [], [], []],
        public code: Op[] = []) { }

}

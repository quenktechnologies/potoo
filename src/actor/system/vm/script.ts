import { Context } from '../../context';
import { Template } from '../../template';
import { Message } from '../../message';
import { System } from '../';
import { Op } from './op';

/**
 * Value correspond to the types of the VM's type system.
 */
export type Value<C extends Context, S extends System<C>>
    = number
    | string
    | Function<C, S>
    | Template<C, S>
    | Message
    ;

/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 *
 * Access to these values happens by using first the index of its type
 * then the following index within the type's table.
 */
export type Constants<C extends Context, S extends System<C>>
    = [
        number[],
        string[],
        Function<C, S>[],
        Template<C, S>[],
        Message[],
        Foreign<C, S>[]
    ]
    ;

/**
 * Function type.
 */
export type Function<C extends Context, S extends System<C>>
    = () => Op<C, S>[]
    ;

/**
 * Foreign function type.
 */
export type Foreign<C extends Context, S extends System<C>>
    = (...arg: Value<C, S>) => Value<C, S>
    ;

/**
 * Script is a "program" an actor submits to the Runtime run execute.
 *
 * It consists of the following sections:
 * 1. constants - Static values referenced in the code section.
 * 2. code - A list of one or more Op codes to execute in sequence.
 */
export class Script<C extends Context, S extends System<C>>  {

    constructor(
        public constants: Constants<C, S> = [[], [], [], [], [],[]],
        public code: Op<C, S>[] = []) { }

}

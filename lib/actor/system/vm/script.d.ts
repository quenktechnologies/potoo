import { Context } from '../../context';
import { Template } from '../../template';
import { Message } from '../../message';
import { System } from '../';
import { Op } from './op';
/**
 * Constants is a tuple of immutable values available to a
 * Script at runtime.
 *
 * Access to these values happens by using first the index of its type
 * then the following index within the type's table.
 */
export declare type Constants<C extends Context, S extends System<C>> = [number[], string[], Template<C, S>[], Message[], Function<C, S>[]];
/**
 * Function type.
 */
export declare type Function<C extends Context, S extends System<C>> = () => Op<C, S>[];
/**
 * Script is a "program" an actor submits to the Executor run execute.
 *
 * It consists of the following sections:
 * 1. constants - Static values referenced in the code section.
 * 2. code - A list of one or more Op codes to execute in sequence.
 */
export declare class Script<C extends Context, S extends System<C>> {
    constants: Constants<C, S>;
    code: Op<C, S>[];
    constructor(constants?: Constants<C, S>, code?: Op<C, S>[]);
}

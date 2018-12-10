import { Instance } from '../../';
import { Template } from '../../template';
import { Context } from '../../context';
import { Address } from '../../address';
import { SystemError } from '../error';
import { System } from '../';
import { Op, Executor } from './';
export declare const RUN_START_TAG = "start";
export declare class InvalidIdError extends SystemError {
    id: string;
    constructor(id: string);
}
export declare class DuplicateAddressError extends SystemError {
    address: Address;
    constructor(address: Address);
}
/**
 * Spawn instruction.
 *
 * Enters a child actor in the system.
 *
 * We first ensure the parent is still in the system then validate
 * the child id. After that we check for dupicated ids then finally
 * setup the new child.
 */
export declare class Spawn<C extends Context, S extends System<C>> extends Op<C, S> {
    parent: Instance;
    template: Template<C, S>;
    constructor(parent: Instance, template: Template<C, S>);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

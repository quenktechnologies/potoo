import { Instance } from '../../';
import { Template } from '../../template';
import { Context } from '../../context';
import { Address } from '../../address';
import { SystemError } from '../error';
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
 */
export declare class Spawn<C extends Context> extends Op<C> {
    parent: Instance;
    template: Template<C>;
    constructor(parent: Instance, template: Template<C>);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execSpawn instruction.
 *
 * Here we ensure the parent is still in the system then validate
 * the child id.
 *
 * If that is successfull we create and check for a duplicate id
 * then finally add the child to the system.
 */
export declare const execSpawn: <C extends Context>(s: Executor<C>, { parent, template }: Spawn<C>) => void;

import { Actor } from '../../';
import { Template } from '../../template';
import { Context } from '../state/context';
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
export declare class Spawn extends Op {
    parent: Actor;
    template: Template;
    constructor(parent: Actor, template: Template);
    code: number;
    level: number;
    exec<C extends Context>(s: Executor<C>): void;
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
export declare const execSpawn: <C extends Context>(s: Executor<C>, { parent, template }: Spawn) => void;

import { Actor } from '../../';
import { Template } from '../../template';
import { Frame } from '../state/frame';
import { Address } from '../../address';
import { Executor } from './';
import { SystemError } from '../error';
import { Op } from './';
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
    exec<F extends Frame>(s: Executor<F>): void;
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
export declare const execSpawn: <F extends Frame>(s: Executor<F>, { parent, template }: Spawn) => void;

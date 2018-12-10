import { Address } from '../../address';
import { Instance } from '../../';
import { Context } from '../../context';
import { SystemError } from '../error';
import { System } from '../';
import { Op, Executor } from './';
/**
 * IllegalKillSignalError
 */
export declare class IllegalKillSignalError extends SystemError {
    child: string;
    parent: string;
    constructor(child: string, parent: string);
}
/**
 * Kill instruction.
 *
 * An actor can only kill actors it is directly or indirectly the parent of.
 */
export declare class Kill<C extends Context, S extends System<C>> extends Op<C, S> {
    actor: Instance;
    child: Address;
    constructor(actor: Instance, child: Address);
    code: number;
    level: number;
    exec(s: Executor<C, S>): void;
}

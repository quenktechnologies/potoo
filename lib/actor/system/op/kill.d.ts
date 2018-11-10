import { Address } from '../../address';
import { Instance } from '../../';
import { Context } from '../../context';
import { SystemError } from '../error';
import { Op, Executor } from './';
export declare class IllegalKillSignal extends SystemError {
    child: string;
    parent: string;
    constructor(child: string, parent: string);
}
/**
 * Kill instruction.
 */
export declare class Kill<C extends Context> extends Op<C> {
    actor: Instance;
    child: Address;
    constructor(actor: Instance, child: Address);
    code: number;
    level: number;
    exec(s: Executor<C>): void;
}
/**
 * execKill
 *
 * Verify the target child is somewhere in the hierachy of the requesting
 * actor before killing it.
 */
export declare const execKill: <C extends Context>(s: Executor<C>, { child, actor }: Kill<C>) => void | Executor<C>;

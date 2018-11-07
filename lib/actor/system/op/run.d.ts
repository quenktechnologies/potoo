import { Address } from '../../address';
import { Context } from '../../context';
import { Executor } from './';
import { Op } from './';
/**
 * Run instruction.
 */
export declare class Run<C extends Context> extends Op<C> {
    tag: string;
    actor: Address;
    delay: number;
    func: () => void;
    constructor(tag: string, actor: Address, delay: number, func: () => void);
    code: number;
    level: number;
    exec<C extends Context>(_: Executor<C>): void;
}
/**
 * execRun
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export declare const execRun: <C extends Context>({ func, delay }: Run<C>) => void;

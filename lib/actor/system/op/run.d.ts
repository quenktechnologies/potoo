import { Address } from '../../address';
import { Context } from '../../context';
import { System } from '../';
import { Executor } from './';
import { Op } from './';
/**
 * Run instruction.
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export declare class Run<C extends Context, S extends System<C>> extends Op<C, S> {
    tag: string;
    actor: Address;
    delay: number;
    func: () => void;
    constructor(tag: string, actor: Address, delay: number, func: () => void);
    code: number;
    level: number;
    exec(_: Executor<C, S>): void;
}

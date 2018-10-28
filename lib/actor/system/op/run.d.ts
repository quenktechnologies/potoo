import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
/**
 * Run instruction.
 */
export declare class Run extends Op {
    tag: string;
    actor: Address;
    delay: number;
    func: () => void;
    constructor(tag: string, actor: Address, delay: number, func: () => void);
    code: number;
    level: number;
    exec<F extends Frame>(_: Executor<F>): void;
}
/**
 * execRun
 *
 * Runs a side-effectfull function in the "next-tick" or after
 * the duration provided.
 */
export declare const execRun: ({ func, delay }: Run) => void;

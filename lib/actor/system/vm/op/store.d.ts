import { Context } from '../../../context';
import { System } from '../../';
import { Executor } from '../';
import { Level, Op } from './';
export declare const OP_CODE_STORE = 17;
/**
 * Store the top most value on the stack in the locals array at the
 * location specified.
 *
 * Pops:
 * 1. Operand to store.
 */
export declare class Store<C extends Context, S extends System<C>> extends Op<C, S> {
    index: number;
    constructor(index: number);
    code: number;
    level: Level;
    exec(e: Executor<C, S>): void;
    toLog(): string;
}

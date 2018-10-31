import { Err } from '../../err';
import { Address } from '../../address';
import { Context } from '../state/context';
import { Op, Executor } from './';
/**
 * Raise instruction.
 */
export declare class Raise extends Op {
    error: Err;
    src: Address;
    dest: Address;
    constructor(error: Err, src: Address, dest: Address);
    code: number;
    level: number;
    /**
     * exec Raise
     *
     *
     */
    exec<C extends Context>(s: Executor<C>): void;
}
/**
 * execRaise
 *
 * If the actor template came with a trap we apply it to determine
 * what action to take, one of:
 * 1. Elevate the error to the parent actor.
 * 2. Ignore the error.
 * 3. Restart the actor.
 * 4. Stop the actor completely.
 *
 * If no trap is provided we do 1. until we hit the system actor.
 */
export declare const execRaise: <C extends Context>(s: Executor<C>, { error, src, dest }: Raise) => void;

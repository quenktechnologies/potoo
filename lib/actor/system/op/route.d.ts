import { Address } from '../../address';
import { Frame } from '../state/frame';
import { Executor } from './';
import { Op } from './';
/**
 * Route instruction.
 */
export declare class Route extends Op {
    from: Address;
    to: Address;
    constructor(from: Address, to: Address);
    code: number;
    level: number;
    exec<F extends Frame>(s: Executor<F>): void;
}
/**
 * execRoute
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export declare const execRoute: <F extends Frame>(s: Executor<F>, { from, to }: Route) => void;

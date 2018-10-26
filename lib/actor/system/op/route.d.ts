import { Address } from '../../address';
import { System } from '../';
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
    exec(s: System): void;
}
/**
 * execRoute
 *
 * Creates an entry in the system's state to allow messages
 * sent to one address to be forwarded to another actor.
 */
export declare const execRoute: (s: System, { from, to }: Route) => void;

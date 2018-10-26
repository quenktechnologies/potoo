import { Address } from '../../address';
import { Actor } from '../../';
import { System } from '../';
import { SystemError } from '../error';
import { Op } from './';
export declare class IllegalKillSignal extends SystemError {
    child: string;
    parent: string;
    constructor(child: string, parent: string);
}
/**
 * Kill instruction.
 */
export declare class Kill extends Op {
    child: Address;
    actor: Actor;
    constructor(child: Address, actor: Actor);
    code: number;
    level: number;
    exec(s: System): void;
}
/**
 * execKill
 *
 * Verify the target child is somewhere in the hierachy of the requesting
 * actor before killing it.
 */
export declare const execKill: (s: System, { child, actor }: Kill) => void;

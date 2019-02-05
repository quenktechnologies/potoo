import { Context } from '../../context';
import { Address } from '../../address';
import { System } from '../';
import { Script } from './script';
/**
 * Handle used by actors to interact with the System.
 */
export interface Handle<C extends Context, S extends System<C>> {
    /**
     * self is the address of the actor.
     */
    self: Address;
    /**
     * system the actor is part of.
     */
    system: System<C>;
    /**
     * exec a Script on behalf of the actor.
     */
    exec(s: Script<C, S>): void;
}
/**
 * Void Handle.
 */
export declare class Void<C extends Context, S extends System<C>> implements Handle<C, S> {
    self: Address;
    system: System<C>;
    constructor(self: Address, system: System<C>);
    exec(_: Script<C, S>): void;
}

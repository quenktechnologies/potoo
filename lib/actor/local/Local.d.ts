import * as Promise from 'bluebird';
import { System, Envelope } from '../../system';
import { Actor, Template, Address } from '..';
/**
 * Local are actors that directly exists in the current runtime.
 */
export declare abstract class Local implements Actor {
    __system: System;
    abstract run(): void;
    abstract accept<M>(m: Envelope<M>): void;
    /**
     * self retrieves the path of this actor from the system.
     */
    self: () => string;
    constructor(__system: System);
    /**
     * spawn a new child actor.
     */
    spawn(t: Template): Address;
    /**
     * tell a message to an actor address.
     */
    tell<P>(ref: string, m: P): void;
    /**
     * ask for a reply from a message sent to an address.
     */
    ask<M, R>(ref: string, m: M): Promise<R>;
    /**
     * kill another actor.
     */
    kill(addr: Address): void;
    /**
     * exit instructs the system to kill of this actor.
     */
    exit(): void;
    terminate(): void;
}

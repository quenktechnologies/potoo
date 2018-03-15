import * as Promise from 'bluebird';
import { System, Envelope } from '../../system';
import { Actor, Template, Address } from '..';
/**
 * Local are actors that directly exists in the current runtime.
 */
export declare abstract class Local implements Actor {
    __system: System;
    abstract run(path: Address): Local;
    abstract accept<M>(m: Envelope<M>): Local;
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
    tell<M>(ref: string, m: M): Local;
    /**
     * ask for a reply from a message sent to an address.
     */
    ask<M, R>(ref: string, m: M): Promise<R>;
    /**
     * kill another actor.
     */
    kill(addr: Address): Local;
    /**
     * exit instructs the system to kill of this actor.
     */
    exit(): void;
    terminate(): void;
}

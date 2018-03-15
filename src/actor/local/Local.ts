import * as Promise from 'bluebird';
import { System, PsuedoSystem, Envelope } from '../../system';
import { Actor, Template, Address } from '..';

/**
 * Local are actors that directly exists in the current runtime.
 */
export abstract class Local implements Actor {

    abstract run(path: Address): Local;

    abstract accept<M>(m: Envelope<M>): Local;

    /**
     * self retrieves the path of this actor from the system.
     */
    self = () => this.__system.toAddress(this).get();

    constructor(public __system: System) { }

    /**
     * spawn a new child actor.
     */
    spawn(t: Template): Address {

        return this.__system.putChild(this, t);

    }

    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Local {

        this.__system.putMessage(new Envelope(ref, this.self(), m));
        return this;

    }

    /**
     * ask for a reply from a message sent to an address.
     */
    ask<M, R>(ref: string, m: M): Promise<R> {

        return this.__system.askMessage<M, R>(new Envelope(ref, this.self(), m));

    }

    /**
     * kill another actor.
     */
    kill(addr: Address): Local {

        this.__system.removeActor(this, addr);
        return this;

    }

    /**
     * exit instructs the system to kill of this actor.
     */
    exit(): void {

        this.kill(this.self());

    }

    terminate(): void {

        this.__system = new PsuedoSystem(this.__system.log());

    }

}

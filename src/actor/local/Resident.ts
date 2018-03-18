import * as Promise from 'bluebird';
import { System, PsuedoSystem, Envelope } from '../../system';
import { LocalActor } from '.';
import { Template, Address } from '..';

/**
 * Resident provides a LocalActor impleemntation.
 */
export abstract class Resident implements LocalActor {

    abstract run(path: Address): Resident;

    abstract accept(m: Envelope): Resident;

    self = () => this.system.toAddress(this).get();

    constructor(public system: System) { }

    spawn(t: Template): Address {

        return this.system.putChild(this, t);

    }

    tell<M>(ref: string, m: M): Resident {

        this.system.putMessage(new Envelope(ref, this.self(), m));
        return this;

    }

    ask<M, R>(ref: string, m: M, time = Infinity): Promise<R> {

        return this.system.askMessage<R>(new Envelope(ref, this.self(), m), time);

    }

    kill(addr: Address): Resident {

        this.system.removeActor(this, addr);
        return this;

    }

    exit(): void {

        this.kill(this.self());

    }

    terminate(): void {

        this.system = new PsuedoSystem(this.system.log());

    }

}

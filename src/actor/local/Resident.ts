import * as Promise from 'bluebird';
import { System, PsuedoSystem, Envelope } from '../../system';
import { Cases, LocalActor } from '.';
import { Template, Address, Result } from '..';

/**
 * Resident provides a LocalActor impleemntation.
 */
export abstract class Resident implements LocalActor {

    abstract accept(m: Envelope): Result;

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

    select<T>(_: Cases<T>): Resident {

        return this;

    }

    run(_:Address) { }

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

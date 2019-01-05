import { fromBoolean } from '@quenk/noni/lib/data/either';
import { just } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { ADDRESS_DISCARD, Address, isRestricted, make } from '../address';
import { Spawn } from '../system/op/spawn';
import { Tell } from '../system/op/tell';
import { Kill } from '../system/op/kill';
import { Discard } from '../system/op/discard';
import { Receive } from '../system/op/receive';
import { DetachedSystem } from '../system/detached';
import { Message } from '../message';
import { Envelope } from '../mailbox';
import { System } from '../system';
import { Template } from '../template';
import { Context } from '../context';
import { Case } from './case';
import { Actor } from '../';

/**
 * Ref function type.
 */
export type Ref = (addr: Address) => Reference;

/**
 * Self function type.
 */
export type Self = () => Address;

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<C extends Context, S extends System<C>> extends Actor<C> {

    /**
     * ref provides a handle for sending mesages to an address.
     */
    ref: Ref;

    /**
     * self retrieves the path of this actor from the system.
     */
    self: Self;

    /**
     * spawn a new child actor.
     *
    spawn(t: Template<C, S>): Address;

    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Resident<C, S>;

    /**
     * select the next message to be processed, applying each Case 
     * until one matches.
     */
    select<T>(c: Case<T>[]): Resident<C, S>;

    /**
     * kill a child actor.
     */
    kill(addr: Address): Resident<C, S>;

    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;

}

/**
 * AbstractResident implementation.
 */
export abstract class AbstractResident<C extends Context, S extends System<C>>
    implements Resident<C, S> {

    constructor(public system: System<C>) { }

    ref = (addr: Address) => (m: Message) => this.tell(addr, m);

    self = () => this.system.identify(this);

    abstract init(c: C): C;

    accept({ to, from, message }: Envelope) {

        this.system.exec(new Discard(to, from, message));
        return this;

    }

    spawn(t: Template<C, S>): Address {

        this.system.exec(new Spawn(this, t));

        return isRestricted(t.id) ?
            ADDRESS_DISCARD :
            make(this.self(), t.id);

    }

    tell<M>(ref: Address, m: M): AbstractResident<C, S> {

        this.system.exec(new Tell(ref, this.self(), m));
        return this;

    }

    abstract select<T>(_: Case<T>[]): AbstractResident<C, S>;

    kill(addr: Address): AbstractResident<C, S> {

        this.system.exec(new Kill(this, addr));
        return this;

    }

    exit(): void {

        this.kill(this.self());

    }

    stop(): void {

        this.system = new DetachedSystem();

    }

    abstract run(): void;

}

/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T, C extends Context, S extends System<C>>
    extends AbstractResident<C, S> {

    /**
     * receive is a static list of Case classes 
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];

    init(c: C): C {

        c.behaviour.push(ibehaviour(this));
        c.mailbox = just([]);
        c.flags.immutable = true;
        c.flags.buffered = true;
        return c;

    }

    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T, C, S> {

        return this;

    }

}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable<C extends Context, S extends System<C>>
    extends AbstractResident<C, S> {

    receive: Case<void>[] = [];

    init(c: C): C {

        c.mailbox = just([]);
        c.flags.immutable = false;
        c.flags.buffered = true;

        return c;

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<C, S> {

        this.system.exec(new Receive(this.self(), false, mbehaviour(cases)));
        return this;

    }

}

const mbehaviour = <T>(cases: Case<T>[]) => (m: Message) =>
    fromBoolean(cases.some(c => c.match(m)))
        .lmap(() => m)
        .map(noop);

const ibehaviour = <T, C extends Context, S extends System<C>>
    (i: Immutable<T, C, S>) => (m: Message) =>
        fromBoolean(i.receive.some(c => c.match(m)))
            .lmap(() => m)
            .map(noop);

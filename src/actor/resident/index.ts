import { fromBoolean } from '@quenk/noni/lib/data/either';
import { just } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { StopScript } from '../system/vm/runtime/scripts';
import { SpawnScript } from '../system/framework/scripts';
import { Handle, Void } from '../system/vm/handle';
import { System } from '../system';
import { ADDRESS_DISCARD, Address, isRestricted, make } from '../address';
import { Message } from '../message';
import { Template } from '../template';
import { Context } from '../context';
import { Actor } from '../';
import { Case } from './case';
import { Api } from './api';
import { TellScript, AcceptScript, ReceiveScript,NotifyScript } from './scripts';

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<C extends Context, S extends System<C>>
    extends Api<C, S>, Actor<C> { }

/**
 * AbstractResident implementation.
 */
export abstract class AbstractResident<C extends Context, S extends System<C>>
    implements Resident<C, S> {

    constructor(public handle: Handle<C, S>) { }

    abstract init(c: C): C;

    abstract select<T>(_: Case<T>[]): AbstractResident<C, S>;

    abstract run(): void;

    notify() {

this.handle.exec(new NotifyScript());

    }

    self() {

        return this.handle.self;

    }

    accept(m: Message) {

        this.handle.exec(new AcceptScript(m));

    }

    spawn(t: Template<C, S>): Address {

        this.handle.exec(new SpawnScript(t));

        return isRestricted(t.id) ?
            ADDRESS_DISCARD :
            make(this.self(), t.id);

    }

    tell<M>(ref: Address, m: M): AbstractResident<C, S> {

        this.handle.exec(new TellScript(ref, m));
        return this;

    }


    kill(addr: Address): AbstractResident<C, S> {

        this.handle.exec(new StopScript(addr));
        return this;

    }

    exit(): void {

        this.handle.exec(new StopScript(this.self()));

    }

    stop(): void {

        this.handle = new Void('?', this.handle.system);

    }

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

    run() { }

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

        this.handle.exec(new ReceiveScript(mbehaviour(cases)));
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

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref = <C extends Context, S extends System<C>>
    (res: Resident<C, S>, addr: Address): Reference =>
    (m: Message) =>
        res.tell(addr, m);


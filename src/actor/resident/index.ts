import { fromBoolean } from '@quenk/noni/lib/data/either';
import { just } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { Err } from '@quenk/noni/lib/control/error';
import { map, merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';

import { StopScript } from '../system/vm/runtime/scripts';
import { SpawnScript } from '../system/framework/scripts';
import { System, Void } from '../system';
import {
    ADDRESS_DISCARD,
    Address,
    AddressMap,
    isRestricted,
    make,
    randomID
} from '../address';
import { Message } from '../message';
import { Template, Templates, Spawnable } from '../template';
import { Context } from '../context';
import { Actor } from '../';
import { Case } from './case';
import { Api } from './api';
import {
    TellScript,
    AcceptScript,
    ReceiveScript,
    NotifyScript,
    RaiseScript
} from './scripts';

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;


/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<C extends Context, S extends System>
    extends Api<C, S>, Actor<C> { }

/**
 * AbstractResident implementation.
 */
export abstract class AbstractResident<C extends Context, S extends System>
    implements Resident<C, S> {

    constructor(public system: S) { }

    abstract init(c: C): C;

    abstract select<T>(_: Case<T>[]): AbstractResident<C, S>;

    abstract run(): void;

    notify() {

        this.system.exec(this, new NotifyScript());

    }

    self() {

        return this.system.ident(this);

    }

    accept(m: Message) {

        this.system.exec(this, new AcceptScript(m));

    }

    spawn(t: Spawnable<S>): Address {

        let id = randomID();

        let tmpl = isObject(t) ?
            merge({ id }, <Template<System>>t) :
            { id, create: t };

        this.system.exec(this, new SpawnScript(this.self(), tmpl));

        return isRestricted(<string>tmpl.id) ?
            ADDRESS_DISCARD :
            make(this.self(), tmpl.id);

    }

    spawnGroup(group: string | string[], tmpls: Templates<S>): AddressMap {

        return map(tmpls, (t: Spawnable<S>) => this.spawn(isObject(t) ?
            merge(t, { group: group }) : { group, create: t }));

    }

    tell<M>(ref: Address, m: M): AbstractResident<C, S> {

        this.system.exec(this, new TellScript(ref, m));
        return this;

    }

    raise(e: Err): AbstractResident<C, S> {

        this.system.exec(this, new RaiseScript(e));
        return this;

    }

    kill(addr: Address): AbstractResident<C, S> {

        this.system.exec(this, new StopScript(addr));
        return this;

    }

    exit(): void {

        this.system.exec(this, new StopScript(this.self()));

    }

    stop(): void {

        //XXX: this is a temp hack to avoid the system parameter being of type
        //System<C>. As much as possibl we want to keep the system type to
        //make implementing an actor system simple.
        //
        //In future revisions we may wrap the system in a Maybe or have
        //the runtime check if the actor is the valid instance but for now,
        //we force void. This may result in some crashes if not careful.
        this.system = <any>new Void();

    }

}

/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T, C extends Context, S extends System>
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
export abstract class Mutable<C extends Context, S extends System>
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

        this.system.exec(this, new ReceiveScript(mbehaviour(cases)));
        return this;

    }

}

const mbehaviour = <T>(cases: Case<T>[]) => (m: Message) =>
    fromBoolean(cases.some(c => c.match(m)))
        .lmap(() => m)
        .map(noop);

const ibehaviour = <T, C extends Context, S extends System>
    (i: Immutable<T, C, S>) => (m: Message) =>
        fromBoolean(i.receive.some(c => c.match(m)))
            .lmap(() => m)
            .map(noop);

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref = <C extends Context, S extends System>
    (res: Resident<C, S>, addr: Address): Reference =>
    (m: Message) =>
        res.tell(addr, m);

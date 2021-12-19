import * as events from '../system/vm/event';

import { Future } from '@quenk/noni/lib/control/monad/future';
import { map, merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';
import { Err } from '@quenk/noni/lib/control/error';

import { Context } from '../system/vm/runtime/context';
import { NewForeignFunInfo } from '../system/vm/script/info';
import { System } from '../system';
import {
    ADDRESS_DISCARD,
    Address,
    AddressMap
} from '../address';
import { Message } from '../message';
import { Templates, Spawnable } from '../template';
import { FLAG_IMMUTABLE, FLAG_BUFFERED, FLAG_TEMPORARY } from '../flags';
import { Actor, Eff } from '../';
import { Case } from './case';
import { Api } from './api';

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident
    extends
    Api,
    Actor { }

/**
 * AbstractResident implementation.
 */
export abstract class AbstractResident
    implements
    Resident {

    constructor(public system: System) { }

    self = (): Address => ADDRESS_DISCARD;

    abstract init(c: Context): Context;

    abstract select<T>(_: Case<T>[]): AbstractResident;

    notify() {

        this.system.getPlatform().exec(this, 'notify');

    }

    accept(_: Message) { }

    spawn(t: Spawnable): Address {

        return this.system.getPlatform().spawn(this, t);

    }

    spawnGroup(group: string | string[], tmpls: Templates): AddressMap {

        return map(tmpls, (t: Spawnable) => this.spawn(isObject(t) ?
            merge(t, { group: group }) : { group, create: t }));

    }

    tell<M>(ref: Address, m: M): AbstractResident {

        let vm = this.system.getPlatform();
        this.exec('tell', [vm.heap.addString(ref), vm.heap.addForeign(m)]);
        return this;

    }

    raise(e: Err): AbstractResident {

        this.exec('raise', [this.system.getPlatform().heap.addString(e+'')]);
        return this;

    }

    kill(addr: Address): AbstractResident {

        this.exec('kill', [this.system.getPlatform().heap.addString(addr)]);
        return this;

    }

    exit(): void {

        this.kill(this.self());

    }

    start(addr: Address): Eff {

        this.self = () => addr;

        return this.run();

    }

    run(): void { }

    stop(): void { }

    /**
     * exec calls a VM function by name on behalf of this actor.
     */
    exec(fname: string, args: number[]) {

        let vm = this.system.getPlatform();
        vm.exec(this, fname, args);

    }

}

/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T> extends AbstractResident {

    init(c: Context): Context {

        c.flags = c.flags | FLAG_IMMUTABLE | FLAG_BUFFERED;

        c.receivers.push(receiveFun(this.receive()));

        return c;

    }

    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T> {

        return this;

    }

    /**
     * receive provides a static list of Case classes that the actor will 
     * always use to process messages.
     */
    receive(): Case<T>[] {

        return [];

    }

}

/**
 * Temp automatically removes itself from the system after a succesfull match
 * of any of its cases.
 */
export abstract class Temp<T> extends Immutable<T> {

    init(c: Context): Context {

        c.flags = c.flags | FLAG_TEMPORARY | FLAG_BUFFERED;

        c.receivers.push(receiveFun(this.receive()));

        return c;

    }

}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable extends AbstractResident {

    receive: Case<void>[] = [];

    init(c: Context): Context {

        c.flags = c.flags | FLAG_BUFFERED;

        return c;

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable {

        let vm = this.system.getPlatform();
        vm.exec(this, 'receive', [vm.heap.addFun(receiveFun(cases))]);
        return this;

    }

}

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref =
    (res: Resident, addr: Address): Reference =>
        (m: Message) =>
            res.tell(addr, m);

const receiveFun = (cases: Case<Message>[]) =>
    new NewForeignFunInfo('receive', 1, (r, m) => {

        if (cases.some(c => {

            let ok = c.test(m);

            if (ok) {

                let ft = c.apply(m);

                if (ft != null) r.wait(<Future<void>>ft);

            }

            return ok;

        })) {

            r.vm.trigger(r.context.address, events.EVENT_MESSAGE_READ, m);

        } else {

            r.vm.trigger(r.context.address, events.EVENT_MESSAGE_DROPPED, m);

        }

        return 0;

    });

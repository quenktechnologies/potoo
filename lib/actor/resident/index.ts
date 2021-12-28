
import { map, merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';
import { Err } from '@quenk/noni/lib/control/error';

import { Context } from '../system/vm/runtime/context';
import { Foreign } from '../system/vm/type';
import { System } from '../system';
import {
    Address,
    AddressMap
} from '../address';
import { Message } from '../message';
import { Templates, Spawnable } from '../template';
import { Actor, Eff } from '../';
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
 * AbstractResident is a base implementation of a Resident actor.
 */
export abstract class AbstractResident
    implements
    Resident {

    constructor(public system: System) { }

    self = getSelf(this);

    abstract init(c: Context): Context;

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

        this.exec('tell', [ref, m]);
        return this;

    }

    raise(e: Err): AbstractResident {

        this.system.getPlatform().raise(this, e );
        return this;

    }

    kill(addr: Address): AbstractResident {

        this.system.getPlatform().kill(this, addr).fork(e => this.raise(e));
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
    exec(fname: string, args: Foreign[]) {

        let vm = this.system.getPlatform();
        vm.exec(this, fname, args);

    }

}

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref =
    (res: Resident, addr: Address): Reference =>
        (m: Message) =>
            res.tell(addr, m);

const getSelf = (actor: AbstractResident) => {

    let _self = '?';

    return () => {

        if (_self === '?')
            _self = actor
                .system
                .getPlatform()
                .identify(actor)
                .orJust(() => '?').get();

        return _self;

    }

}

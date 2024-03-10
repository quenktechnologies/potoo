import { merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';
import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';

import { Context } from '../system/vm/runtime/context';
import { Runtime } from '../system/vm/runtime';
import { Address, AddressMap } from '../address';
import { Message } from '../message';
import { Templates, Spawnable, fromSpawnable } from '../template';
import { FLAG_VM_THREAD } from '../flags';
import { Actor, Eff } from '../';
import { Api } from './api';

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident extends Api, Actor {}

/**
 * AbstractResident is a base implementation of a Resident actor.
 */
export abstract class AbstractResident implements Resident {
    constructor(public runtime: Runtime) {}

    self = getSelf(this);

    init(c: Context): Context {
        c.flags = c.flags | FLAG_VM_THREAD;

        return c;
    }

    notify() {
        this.runtime.exec('notify');
    }

    accept(_: Message) {}

    spawn(target: Spawnable): Future<Address> {
        return this.runtime.spawn(fromSpawnable(target));
     }

    spawnGroup(group: string | string[], tmpls: Templates): Future<AddressMap> {
        return Future.do(async () => {
            let result: AddressMap = {};

            for await (let [key, tmpl] of Object.entries(tmpls)) {
                let addr = await this.spawn(
                    isObject(tmpl)
                        ? merge(tmpl, { group: group })
                        : { group, create: tmpl }
                );
                result[key] = addr;
            }

            return Future.of(result);
        });
    }

    tell<M>(addr: Address, msg: M): Future<void> {
      return this.runtime.send(addr, msg);
    }

    raise(e: Err) {
        this.runtime.raise(e);
    }

    kill(addr: Address) {
        return Future.do(async () => {
            await this.runtime.exec<void>('kill', [
                this.runtime.vm.registry.addString(addr)
            ]);
        });
    }

    exit(): void {
        this.kill(this.self());
    }

    start(addr: Address): Eff {
        this.self = () => addr;

        return this.run();
    }

    run(): void {}

    stop(): void {}

    wait(_ft: Future<void>) {
        // TODO: Implement this.
    }
}

/**
 * ref produces a function for sending messages to an actor address.
 */
export const ref =
    (res: Resident, addr: Address): Reference =>
    (m: Message) =>
        res.tell(addr, m);

const getSelf = (_actor: AbstractResident) => {
    let _self = '?';

    return () => {
        /* TODO: This should be given to the runtime now. */
        /*if (_self === '?')
            _self = actor.system
                .getPlatform()
                .identify(actor)
                .orJust(() => '?')
                .get();
*/
        return _self;
    };
};

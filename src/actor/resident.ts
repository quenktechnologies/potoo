import { merge } from '@quenk/noni/lib/data/record';
import { isObject } from '@quenk/noni/lib/data/type';
import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { TypeCase } from '@quenk/noni/lib/control/match/case';

import { Runtime } from './system/vm/runtime';
import { Address, AddressMap } from './address';
import { Message } from './message';
import { Templates, Spawnable } from './template';
import { Actor } from './';
import { Api, AsyncTask } from './api';

/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident extends Api, Actor {}

/**
 * AbstractResident is a base implementation of a Resident actor.
 */
export abstract class AbstractResident implements Resident {
    constructor(public runtime: Runtime) {}

    self = this.runtime.self;

    accept(_: Message) {}

    spawn(target: Spawnable): Future<Address> {
        return this.runtime.spawn(target);
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
        return this.runtime.tell(addr, msg);
    }

    raise(err: Err) {
        return this.runtime.raise(err);
    }

    kill(addr: Address) {
        return this.runtime.kill(addr);
    }

    exit() {
        return this.runtime.exit();
    }

    async start() {
        return this.run();
    }

    async run() {}

    async stop() {}

    watch<T>(task: AsyncTask<T>) {
        return this.runtime.watch(task);
    }
}

/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
export abstract class Immutable<T> extends AbstractResident {
    /**
     * receive provides the list of Case classes that the actor will be used
     * to process incomming messages.
     */
    receive(): TypeCase<T>[] {
        return [];
    }

    async start() {
        await this.run();
        while (this.runtime.isValid())
            await this.runtime.receive(this.receive());
    }
}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable extends AbstractResident {
    /**
     * receive a message from the actor's mailbox.
     */
    receive<T>(cases: TypeCase<T>[] = []): Future<T> {
        return Future.do(async () => this.runtime.receive(cases));
    }
}

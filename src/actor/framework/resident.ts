import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { TypeCase } from '@quenk/noni/lib/control/match/case';

import { Runtime } from '../system/vm/runtime';
import { Address } from '../address';
import { Spawnable } from '../template';
import { Api } from '../api';
import { Message, Actor } from '../';

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

    async notify(msg: Message) {
        await this.runtime.notify(msg);
    }

    spawn(target: Spawnable) {
        return this.runtime.spawn(target);
    }

    async tell<M>(addr: Address, msg: M) {
        await this.runtime.tell(addr, msg);
    }

    async raise(err: Err) {
        await this.runtime.raise(err);
    }

    async kill(addr: Address) {
        await this.runtime.kill(addr);
    }

    async exit() {
        await this.runtime.kill(this.self);
    }

    async start() {
        return this.run();
    }

    async run() {}

    async stop() {}

    abstract receive<T>(cases?: TypeCase<T>[]): Promise<T>;

    watch<T>(task: () => Promise<T>) {
        return this.runtime.watch(task);
    }
}

/**
 * Immutable actors do not change their receiver behaviour after receiving
 * a message. The same receiver is applied to each and every message.
 */
export abstract class Immutable<T> extends AbstractResident {
    /**
     * match provides the list of Case classes that the actor will be used
     * to process incoming messages.
     */
    match(): TypeCase<T>[] {
        return [];
    }

    async start() {
        await this.run();
        while (this.runtime.isValid()) await this.runtime.receive(this.match());
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

import { Err } from '@quenk/noni/lib/control/error';

import { Runtime } from '../system/vm/runtime';
import { Address } from '../address';
import { Spawnable } from '../template';
import { Api } from '../api';
import { Message, Actor } from '../';
import { Case } from '.';

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

    async receive<T>(cases: Case<T>[] = []) {
        return this.runtime.receive(cases);
    }

    watch<T>(task: () => Promise<T>) {
        return this.runtime.watch(task);
    }
}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable extends AbstractResident {}

/**
 * Immutable is an actor whose behaviour does not change when a message is
 * received.
 *
 * For each message received, the same set of TypeCase classes are applied.
 * This class is useful for simple request/response style actors that do
 * not require much complicated logic.
 *
 * @typeparam T - The type of messages the actor is interested in receiving.
 */
export abstract class Immutable extends AbstractResident {
    /**
     * selectors provides the list of TypeCase classes that will be applied to
     * all incoming messages.
     */
    selectors(): Case<Promise<void> | void>[] {
        return [];
    }

    async start() {
        await this.run();
        while (this.runtime.isValid()) await this.receive(this.selectors());
    }
}

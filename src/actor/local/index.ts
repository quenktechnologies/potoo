import { Err } from '@quenk/noni/lib/control/error';
import { Case } from '@quenk/noni/lib/control/match/case';

import { MessagePredicate, Runtime } from '../system/vm/runtime';
import { Address } from '../address';
import { Forkable, Spawnable } from '../template';
import { Api } from '../api';
import { Message, Actor, Runnable } from '../';

export { TypeCase, Default } from '@quenk/noni/lib/control/match/case';
export { Case };

/**
 * Local is an actor that exists in the current runtime.
 */
export interface Local extends Api, Actor {}

/**
 * BaseLocal is a base implementation of a Local actor.
 */
export abstract class BaseLocal implements Local {
    constructor(public runtime: Runtime) {}

    self = this.runtime.self;

    async notify(msg: Message) {
        await this.runtime.notify(msg);
    }

    spawn(target: Spawnable) {
        return this.runtime.spawn(target);
    }

    fork<T>(t: Forkable<T>): Promise<T> {
        return this.runtime.fork(t);
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

    async start() {}

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
export abstract class Mutable extends BaseLocal {
    async start() {
        return this.run();
    }

    async run() {}
}

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
export abstract class Immutable extends BaseLocal {
    /**
     * selectors provides the list of TypeCase classes that will be applied to
     * all incoming messages.
     */
    selectors(): Case<Promise<void> | void>[] {
        return [];
    }

    async run() {}

    async start() {
        await this.run();
        while (this.runtime.isValid()) await this.receive(this.selectors());
    }
}

/**
 * Fork is a short lived actor spawned primarily for the result of its run()
 * method.
 *
 * These actors can communicate with the rest of the system if needed but
 * should limit communication with the parent as much as possible to the
 * final result.
 *
 * A Fork is like an Immutable except it does not automatically start
 * receiving messages on start. This must be manually triggered using
 * receiveUntil() or just receive() if Mutable like behaviour is preferred.
 */
export abstract class Fork<T> extends BaseLocal implements Runnable<T> {
    selectors<M>(): Case<Promise<M> | M>[] {
        return [];
    }

    /**
     * receiveUntil uses the internal selctors define to keep processing
     * incomming messages until the conditions of the predicate function
     * are met.
     *
     * Use this to block the actor until it is ready to return a value.s
     */
    async receiveUntil<M>(f: MessagePredicate): Promise<M> {
        return this.runtime.receiveUntil(this.selectors(), f);
    }

    abstract run(): Promise<T>;

    async start() {
        this.runtime.finalValue = await this.run();
        this.exit();
    }
}

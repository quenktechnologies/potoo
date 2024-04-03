import { Future } from '@quenk/noni/lib/control/monad/future';

import { Context } from './system/vm/runtime/context';
import { Message } from './message';

/**
 * Eff is used in various places to represent the potentially sync or async
 * side-effect of an actor operation.
 */
export type Eff = void | Future<void>;

/**
 * Instance of an actor that resides within the system.
 *
 * The interface is implemented by actors to react to the lifecycle the
 * system takes them through.
 */
export interface Instance {
    /**
     * accept a message directly.
     *
     * This method is used by actors that skip the mailbox.
     */
    accept(m: Message): void;

    /**
     * start the Instance.
     *
     * A Promise is returned here to make the method an async function.
     * Actual execution will be handled via Futures.
     */
    start(): Promise<void>;

    /**
     * stop the Instance.
     *
     * A Promise is returned here to make the method an async function.
     * Actual execution will be handled via Futures.
     */
    stop(): Promise<void>;
}

/**
 * Actor common interface.
 *
 * The system expects all actors to satisfy this interface so they
 * can be managed properly.
 */
export interface Actor extends Instance {
    /**
     * init the Actor.
     *
     * This method allows an actor to configure its Context just
     * before it is added to the system.
     */
    init(c: Context): Context;
}

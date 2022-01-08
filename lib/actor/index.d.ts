import { Future } from '@quenk/noni/lib/control/monad/future';
import { Context } from './system/vm/runtime/context';
import { Message } from './message';
import { Address } from './address';
/**
 * Eff is used in various places to represent the potentially sync or async
 * side-effect of an actor operation.
 */
export declare type Eff = void | Future<void>;
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
     * If a Future is returned, the actor will block its thread until it is
     * complete.
     * The address provided is the address of the newly spawned instance.
     */
    start(addr: Address): Eff;
    /**
     * notify is called by the system to indicate new messages
     * have been placed in the actor's mailbox.
     */
    notify(): void;
    /**
     * stop the Instance.
     */
    stop(): Eff;
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

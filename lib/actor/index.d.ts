import { Either } from '@quenk/noni/lib/data/either';
import { Context } from './system/vm/runtime/context';
import { Message } from './message';
/**
 * Behaviour of an actor.
 *
 * Behaviours are procedures that return an
 * Either type indicating whether a message
 * was processed or rejected.
 */
export declare type Behaviour = (m: Message) => Either<Message, void>;
/**
 * Instance of an actor that resides within the system.
 *
 * The interface is implemetned by actors to react to the lifecycle the
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
     */
    start(): void;
    /**
     * notify is called by the system to indicate new messages
     * have been placed in the actor's mailbox.
     */
    notify(): void;
    /**
     * stop the Instance.
     */
    stop(): void;
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

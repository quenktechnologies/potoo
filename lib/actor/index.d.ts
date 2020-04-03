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
 * Instance of an actor already running in its context.
 */
export interface Instance {
    /**
     * accept a message directly.
     *
     * Some actors may have a mailbox disabling usage
     * of this method.
     */
    accept(m: Message): void;
    /**
     * run the actor instance.
     *
     * Once instantiated this method is called to allow the actor to begin
     * execution.
     */
    run(): void;
    /**
     * notify is called by the system to indicate new messages
     * have been placed in the actor's mailbox.
     *
     * (Buffered actors only!)
     */
    notify(): void;
    /**
     * stop the actor instance.
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

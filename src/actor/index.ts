import { Type } from '@quenk/noni/lib/data/type';

/**
 * Message is any (ideally wire-safe) value that can be sent between actors.
 */
export type Message = Type;

/**
 * Actor is the main interface implemented by actors that are part of the system.
 */
export interface Actor {
    /**
     * start the Actor.
     *
     * At this point resources have been allocated within the system for the
     * actor and it can begin sending messages.
     */
    start(): Promise<void>;

    /**
     * notify is called when a message is received from another actor.
     *
     * Some actors may process the message immediately, others may store it to
     * a mailbox for later.
     */
    notify(m: Message): Promise<void>;

    /**
     * stop the Actor.
     *
     * A this point resources for the actor have been removed from the system
     * and any additional clean up needed can be done.
     */
    stop(): Promise<void>;
}

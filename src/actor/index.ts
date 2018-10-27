import { Either } from '@quenk/noni/lib/data/either';
import { Envelope } from './system/mailbox';
import { Flags } from './system/state/frame';

/**
 * Behaviour of an actor.
 *
 * Behaviours are represented by imperative side-effectfull
 * functions that return an Either that indicates whether
 * the message is rejected or will/was processed.
 */
export type Behaviour = <M>(m: M) => Either<M, void>;

/**
 * Actor common interface.
 *
 * The system expects all actors to satisfy this interface so they 
 * can be managed.
 */
export interface Actor {

    /**
     * flags method.
     *
     * This method provides information to the system
     * about how to prepare state frames for the actor.
     */
    flags(): Flags

    /**
     * accept an enveloped message.
     *
     * For some actors, this message allows bypassing the mailbox
     * system and handling messages directly.
     */
    accept(e: Envelope): Actor;

    /**
     * run this actor.
     */
    run(): void;

    /**
     * stop is called by the system to stop the actor.
     */
    stop(): void;

}

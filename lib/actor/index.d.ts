import { Either } from '@quenk/noni/lib/data/either';
import { Envelope } from './mailbox';
import { Context } from './context';
/**
 * Behaviour of an actor.
 *
 * Behaviours are represented by imperative side-effectfull
 * functions that return an Either that indicates whether
 * the message is rejected or will/was processed.
 */
export declare type Behaviour = <M>(m: M) => Either<M, void>;
/**
 * Actor common interface.
 *
 * The system expects all actors to satisfy this interface so they
 * can be managed.
 */
export interface Actor<C extends Context> {
    /**
     * init method.
     *
     * This method allows an actor to configure its Context just
     * before it is added to the system.
     */
    init(c: C): C;
    /**
     * accept an enveloped message.
     *
     * For some actors, this message allows bypassing the mailbox
     * system and handling messages directly.
     */
    accept(e: Envelope): Actor<C>;
    /**
     * run this actor.
     */
    run(): void;
    /**
     * stop is called by the system to stop the actor.
     */
    stop(): void;
}

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
export type Behaviour = <M>(m: M) => Either<M, void>;

/**
 * Contexts map.
 */
export interface Contexts<C extends Context> {

    [key: string]: C

}

/**
 * Instance is a running actor that has already initialized its context.
 */
export interface Instance {

    /**
     * accept an enveloped message.
     *
     * For some actors, this message allows bypassing the mailbox
     * system and handling messages directly.
     */
    accept(e: Envelope): Instance;

    /**
     * run this actor instance.
     */
    run(): void;

    /**
     * stop is called by the system to stop the actor.
     */
    stop(): void;

}

/**
 * Actor common interface.
 *
 * The system expects all actors to satisfy this interface so they 
 * can be managed.
 */
export interface Actor<C extends Context> extends Instance {

    /**
     * init method.
     *
     * This method allows an actor to configure its Context just
     * before it is added to the system.
     */
    init(c: C): C;

}

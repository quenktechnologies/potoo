import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as log from './log';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { Configuration, ActorTable, Envelope, System } from '.';
/**
 * ActorSystem.
 *
 * The system treats all actors equally ignoring implementation details
 * instead leaving that to the `create` function of their Templates.
 *
 * Actors are stored in the internal actors table and should never
 * be modified directly. This class provides all the methods needed for
 * actor implementations to interact with the system.
 *
 * Each implementation could be seen as a sort of "driver" that hooks into
 * a "kernel" implementation to provide functionality to an application.
 */
export declare class ActorSystem implements System, actor.Actor {
    config: Configuration;
    logging: log.LogLogic;
    /**
     * path is the static path of the system.
     *
     * Messages can be sent to this address and will be processed
     * by the system if supported.
     */
    path: actor.Address;
    /**
     * actors is the ActorTable where all known actor's are stored.
     */
    actors: ActorTable;
    constructor(config?: Configuration, logging?: log.LogLogic);
    /**
     * create a new system
     */
    static create(c?: Configuration): ActorSystem;
    /**
     * parentActor returns the immediate parent for an actor from the ActorTable, given
     * its address.
     */
    parentActor(addr: actor.Address): Maybe<actor.Actor>;
    /**
     * toAddress turns an actor instance into an address.
     *
     * Unknown actors result in an error returning the invalid address.
     */
    toAddress(a: actor.Actor): Maybe<string>;
    /**
     * spawn a new top level actor within the system.
     *
     * Actors spawned at this level are not prefixed system
     * path and can be seen as 'root' actors.
     */
    spawn(t: actor.Template): ActorSystem;
    putChild(parent: actor.Actor, t: actor.Template): actor.Address;
    discard<M>(m: Envelope<M>): ActorSystem;
    putActor(path: string, actor: actor.Actor): ActorSystem;
    putMessage<M>(e: Envelope<M>): ActorSystem;
    putError(_src: actor.Actor, e: Error): System;
    askMessage<M, R>(m: Envelope<M>, time?: number): Promise<R>;
    removeActor(parent: actor.Actor, addr: actor.Address): ActorSystem;
    log(): log.LogLogic;
    /**
     * accept a message bound for the system.
     *
     * It will be discarded.
     */
    accept<M>(e: Envelope<M>): ActorSystem;
    /**
     * run does nothing.
     */
    run(): ActorSystem;
    terminate(): void;
}

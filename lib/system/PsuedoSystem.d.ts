import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as log from './log';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '.';
/**
 * PsuedoSystem satisfies the system interface but is really a fraud.
 *
 * An actor that has a reference to this has most likely been removed
 * from the system.
 */
export declare class PsuedoSystem implements System {
    logging: log.LogLogic;
    constructor(logging: log.LogLogic);
    toAddress(_: actor.Actor): Maybe<string>;
    putMessage<M>(e: Envelope<M>): PsuedoSystem;
    askMessage<M, R>(e: Envelope<M>): Promise<R>;
    removeActor(_: actor.Actor, addr: string): PsuedoSystem;
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(_parent: actor.Actor, _: actor.Template): actor.Address;
    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    discard<M>(e: Envelope<M>): PsuedoSystem;
    putActor(_path: string, _actor: actor.Actor): PsuedoSystem;
    log(): log.LogLogic;
}

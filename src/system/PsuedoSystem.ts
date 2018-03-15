import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as log from './log';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { System, Envelope, DEAD_ADDRESS } from '.';

/**
 * PsuedoSystem satisfies the system interface but is really a fraud.
 *
 * An actor that has a reference to this has most likely been removed
 * from the system.
 */
export class PsuedoSystem implements System {

    constructor(public logging: log.LogLogic) { }

    toAddress(_: actor.Actor): Maybe<string> {

        return Maybe.fromString(DEAD_ADDRESS);

    }

    putMessage<M>(e: Envelope<M>): PsuedoSystem {

        this.logging.messageRejected(e);
        return this;

    }

    askMessage<M, R>(e: Envelope<M>, _ = Infinity): Promise<R> {

        this.logging.messageRejected(e)
        return Promise.resolve(undefined);

    }

    removeActor(_: actor.Actor, addr: string): PsuedoSystem {

        this.logging.error(new Error(`removeActor(): Cannot removed actor "${addr}" from isolated system!`));
        return this;

    }

    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(_parent: actor.Actor, _: actor.Template): actor.Address {

        this.logging.error(new Error(`putChild(): Cannot put an actor in an isolated system!`));
        return DEAD_ADDRESS;

    }

    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    discard<M>(e: Envelope<M>): PsuedoSystem {

        this.logging.messageDropped(e);
        return this;

    }

    putActor(_path: string, _actor: actor.Actor): PsuedoSystem {

        this.logging.error(new Error(`putActor(): Cannot put an actor into an isolated system!`));
        return this;

    }

    putError(_: actor.Actor, e: Error): PsuedoSystem {

        this.logging.error(e);
        return this;

    }

    log(): log.LogLogic {

        return this.logging;

    }

}

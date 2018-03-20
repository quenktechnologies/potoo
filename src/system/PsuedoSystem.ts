import * as Promise from 'bluebird';
import * as actor from '../actor';
import * as event from './log/event';
import { Maybe } from 'afpl/lib/monad/Maybe';
import { Event } from './log/event';
import { System, Envelope, DEAD_ADDRESS } from '.';

/**
 * PsuedoSystem satisfies the system interface but is really a fraud.
 *
 * An actor that has a reference to this has most likely been removed
 * from the system.
 */
export class PsuedoSystem implements System {

    constructor(public system: System) { }

    toAddress(_: actor.Actor): Maybe<string> {

        return Maybe.fromString(DEAD_ADDRESS);

    }

    putMessage(e: Envelope): PsuedoSystem {

        this.system.log(new event.MessageRejectedEvent(e.to, e.from, e.message));
        return this;

    }

    askMessage<R>(e: Envelope, _ = Infinity): Promise<R> {

        this.system.log(new event.MessageRejectedEvent(e.to, e.from, e.message));
        return Promise.resolve(undefined);

    }

    removeActor(_: actor.Actor, addr: string): PsuedoSystem {

        let msg = `removeActor(): Cannot removed actor "${addr}" from isolated system!`;

        this.system.log(new event.ErrorEvent(new Error(msg)));

        return this;

    }

    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(_parent: actor.Actor, _: actor.Template): actor.Address {

        let msg = `putChild(): Cannot put an actor in an isolated system!`;

        this.system.log(new event.ErrorEvent(new Error(msg)));

        return DEAD_ADDRESS;

    }

    /**
     * discard a message.
     *
     * An event will be logged to the system log.
     */
    discard(e: Envelope): PsuedoSystem {

        this.system.discard(e);
        return this;

    }

    putActor(_path: string, _actor: actor.Actor): PsuedoSystem {

        let msg = `putActor(): Cannot put an actor into an isolated system!`;

        this.system.log(new event.ErrorEvent(Error(msg)));
        return this;

    }

    putError(_: actor.Actor, e: Error): PsuedoSystem {

        this.system.log(new event.ErrorEvent(e));
        return this;

    }

    log(e: Event): PsuedoSystem {

        this.system.log(e);
        return this;

    }

}

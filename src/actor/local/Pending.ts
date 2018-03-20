import { Actor, Result, rejected, accepted } from '..';
import { System, Envelope } from '../../system';

/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export class Pending<R> implements Actor {

    constructor(
        public askee: string,
        public original: Actor,
        public resolve: (r: R) => void,
        public system: System) { }

    accept(e: Envelope): Result {

        if (e.from !== this.askee) {

            //TODO: store the message instead of rejecting. 
            return rejected(e);

        } else {

            return this
                .system
                .toAddress(this)
                .map(addr =>
                    this
                        .system
                        .putActor(addr, this.original))
                .map(() => this.resolve(<R>e.message))
                .map(() => accepted(e))
                .get();

        }

    }

    run() { }

    terminate() { }

}

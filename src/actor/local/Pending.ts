import { Actor } from '..';
import { System, Envelope } from '../../system';

/**
 * Pending is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export class Pending<M> implements Actor {

    constructor(
        public askee: string,
        public original: Actor,
        public resolve: (m: M) => void,
        public system: System) { }

    accept(e: Envelope<any>) {

        if (e.from !== this.askee) {

            this.system.discard(e);

        } else {

            this
                .system
                .toAddress(this)
                .map(addr =>
                    this
                        .system
                        .putActor(addr, this.original))
                .map(() => this.resolve(e.message))
                .get();

        }

    }

    run() { }

    terminate() { }

}

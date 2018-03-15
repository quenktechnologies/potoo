import { Envelope } from '../../system';
import { Local, Cases } from '.';

/**
 * Immutable actors do not change their behaviour. 
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T> extends Local {

    abstract receive: Cases<T>

    run(): Immutable<T> { return this; }

    accept<M>(e: Envelope<M | T>): Immutable<T> {

        let r = Array.isArray(this.receive) ? this.receive : [this.receive];

        this.system.log().messageAccepted(e);

        if (!r.some(c => c.match(<T>e.message)))
            this.system.discard(e);

        return this;

    }

}

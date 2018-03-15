import { Envelope } from '../../system';
import { Local, Cases } from '.';

/**
 * Static actors do not change their behaviour. 
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Static<T> extends Local {

    abstract receive: Cases<T>

    run(): Static<T> { return this; }

    accept<M>(e: Envelope<M|T>): Static<T> {

        let r = Array.isArray(this.receive) ? this.receive : [this.receive];

        this.__system.log().messageAccepted(e);

        if (!r.some(c => c.match(<T>e.message)))
            this.__system.discard(e);

        return this;

    }

}

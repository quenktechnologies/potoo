import { Envelope } from '../../system';
import { Resident, Cases } from '.';
import { Result, rejected, accepted } from '..';

/**
 * Immutable actors do not change their behaviour. 
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T> extends Resident {

    abstract receive: Cases<T>

    accept(e: Envelope): Result {

        let r = Array.isArray(this.receive) ? this.receive : [this.receive];

        return (r.some(c => c.match(<T>e.message))) ? accepted(e) : rejected(e);

    }

    run() { }

}

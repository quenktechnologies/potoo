import { System, Envelope } from '../../system';
import { ConsumeResult, Case } from '.';

/**
 * Select is for selective receives.
 */
export class Select<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    consume(m: Envelope): ConsumeResult {

        if (this.cases.some(c => c.match(<T>m.message))) {

            this.system.log().messageReceived(m);
            return null;

        } else {

            this.system.log().messageDropped(m);
            return this;

        }

    }

}

import { System, Envelope } from '../../system';
import { ConsumeResult, Case } from '.';

/**
 * Select is for selective receives.
 */
export class Select<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    consume<M>(m: Envelope<M>): ConsumeResult {

        if (this.cases.some(c => c.match(m.value))) {

            this.system.log().messageReceived(m);
            return null;

        } else {

            this.system.log().messageDropped(m);
            return this;

        }

    }

}

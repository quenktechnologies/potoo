import { System,Envelope } from '../../system';
import {ConsumeResult, Case} from '.';

/**
 * Receive block for messages.
 */
export class Receive<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    consume<M>(e: Envelope<M>): ConsumeResult {

        if (this.cases.some(c => c.match(e.message))) {

            this.system.log().messageReceived(e);

        } else {

            this.system.log().messageDropped(e);

        }

        return this;

    }

}

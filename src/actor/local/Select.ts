import * as event from '../../system/log/event';
import { Maybe, just, nothing } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Case } from '.';

/**
 * Select is for selective receives.
 */
export class Select<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    apply(e: Envelope): Maybe<Select<T>> {

        if (this.cases.some(c => c.match(<T>e.message))) {

            this.system.log(new event.MessageReceivedEvent(e.to, e.from, e.message));
            return nothing<Select<T>>();

        } else {

            this.system.discard(e);
            return just(this);

        }

    }

    merge<A>(cases: Case<T>[]): Select<T | A> {

        return new Select(this.cases.concat(cases), this.system);

    }

}

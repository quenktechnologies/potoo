import {Maybe, just, nothing} from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Case } from '.';

/**
 * Select is for selective receives.
 */
export class Select<T> {

    constructor(public cases: Case<T>[], public system: System) { }

    apply(m: Envelope): Maybe<Select<T>> {

        if (this.cases.some(c => c.match(<T>m.message))) {

            this.system.log().messageReceived(m);
            return nothing<Select<T>>();

        } else {

            this.system.log().messageDropped(m);
            return just(this);

        }

    }

    merge<A>(cases: Case<T>[]): Select<T | A> {

        return new Select(this.cases.concat(cases), this.system);

    }

}

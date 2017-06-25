import { Case } from './Case';

/**
 * Behaviour of an actor
 */
export interface Behaviour {

    willConsume<M>(m: M): boolean;
    consume<M>(m: M): void;

}

/**
 * MatchAny accepts any value.
 */
export class MatchAny<M> implements Behaviour {

    constructor(public f: (m: M) => void) { }

    static create<M>(f: (m: M) => void) {

        return new MatchAny(f);

    }

    willConsume(_: M) {

        return true;

    }

    consume(m: M) {

        this.f(m);

    }

}


/**
 * MatchCase 
 */
export class MatchCase<T> implements Behaviour {

    constructor(public cases: Case<T>[]) { }

    willConsume<M>(m: M) {

        return this.cases.some(c => c.matches(m));

    }

    consume(m: T) {

        this.cases.some(c => c.matches(m) ? (c.apply(m), true) : false);

    }

}



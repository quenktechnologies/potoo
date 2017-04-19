import { match } from '../control/Match';
import { Monad } from './Monad';
import { identity } from '../util';

/**
 * Maybe
 */
export class Maybe<A> implements Monad<A> {

    static map = <A, B>(f: (a: A) => B) => (m: Maybe<A>): Maybe<B> => m.map(f);

    static chain = <A, B>(f: (a: A) => Maybe<B>) => (m: Maybe<A>): Maybe<B> => m.chain(f);

    static get = <A>(m: Maybe<A>): A => m.get();

    static orElse = <A, B>(f: () => Maybe<B>) => (m: Maybe<A>): Maybe<B> => m.orElse(f);

    static orJust = <A, B>(f: () => B) => (m: Maybe<A>): Maybe<B> => m.orJust(f);

    /**
     * of wraps the passed value in a Maybe
     */
    of(a: A): Maybe<A> {

        return new Just(a);
    }

    /**
     * map
     */

    map<B>(f: (a: A) => B): Maybe<B> {

        return match(this)
            .caseOf(Nothing, identity)
            .caseOf(Just, ({ a }) => new Just(f(a)))
            .end();

    }

    /**
       * join
       */
    join(): A {

        return match(this)
            .caseOf(Nothing, identity)
            .caseOf(Just, ({ a }) => a)
            .end();

    }

    /**
     * chain
     * @summary Maybe<A> →  (A →  Maybe<B>) →  Maybe<B>
     */
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B> {

        return match(this)
            .caseOf(Nothing, identity)
            .caseOf(Just, j => j.map(f).join())
            .end();

    }
    /**
     * get the value wrapped by the Maybe
     * @throws {TypeError} if the Maybe is Nothing
     */
    get(): A {

        return match(this)
            .caseOf(Nothing, () => { throw new TypeError('Cannot get anything from Nothing!'); })
            .caseOf(Just, ({ a }) => a)
            .end();

    }

    /**
     * orElse applies a function for transforming Nothing into a Just
     */
    orElse<B>(f: () => Maybe<B>): Maybe<B> {

        return match(this)
            .caseOf(Nothing, f)
            .caseOf(Just, identity)
            .end();

    }

    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    orJust<B>(f: () => B): Maybe<B> {

        return match(this)
            .caseOf(Nothing, () => just(f()))
            .caseOf(Just, identity)
            .end();
    }

    /**
     * cata applies the corresponding function to the Maybe
     */
    cata<C>(f: () => C, g: (A) => C): C {

        return match(this)
            .caseOf(Nothing, f)
            .caseOf(Just, g)
            .end();

    }

}

/**
 * Nothing
 */
export class Nothing extends Maybe<null> { }

/**
 * Just
 */
export class Just<A> extends Maybe<A> {

    constructor(public a: A) {

        super();

    }

}

export const map = <A, B>(m: Maybe<A>) => (f: (a: A) => B): Maybe<B> => {

    return match(m)
        .caseOf(Nothing, identity)
        .caseOf(Just, ({ a }) => new Just(f(a)))
        .end();

}

/**
 * just wraps a value in a Just
 */
export const just = <A>(a: A): Maybe<A> => new Just(a);;

/**
 * nothing constructs nothing
 */
export const nothing = (): Nothing => new Nothing();

/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export const fromAny = <A>(a: A): Maybe<A> => a == null ? new Nothing() : just(a);

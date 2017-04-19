import { Monad } from './Monad';

/**
 * Identity
 */
export class Identity<A> implements Monad<A> {

    a: A;

    constructor(a: A) {

        this.a = a;

    }

    /**
     * of
     */
    of(a: A): Identity<A> {

        return new Identity(a);

    }

    /**
     * map
     */
    map<B>(f: (a: A) => B): Identity<B> {

        return new Identity(f(this.get()));

    }

    /**
     * chain
     */
    chain<B>(f: (a: A) => Identity<B>): Identity<B> {

        return f(this.get());

    }

    /**
     * ap
     */
    ap<B>(i: Identity<(a: A) => B>): Identity<B> {

        return i.map(f => f(this.get()));

    }

    /**
     * get the value of an Identity
     * @summary get :: Identity<A> →  A
     */
    get(): A {

        return this.a;

    }

}


import { Monad } from './Monad';
/**
 * Identity
 */
export declare class Identity<A> implements Monad<A> {
    a: A;
    constructor(a: A);
    /**
     * of
     */
    of(a: A): Identity<A>;
    /**
     * map
     */
    map<B>(f: (a: A) => B): Identity<B>;
    /**
     * chain
     */
    chain<B>(f: (a: A) => Identity<B>): Identity<B>;
    /**
     * ap
     */
    ap<B>(i: Identity<(a: A) => B>): Identity<B>;
    /**
     * get the value of an Identity
     * @summary get :: Identity<A> →  A
     */
    get(): A;
}

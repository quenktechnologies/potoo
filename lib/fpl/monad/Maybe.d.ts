import { Monad } from './Monad';
/**
 * Maybe
 */
export declare class Maybe<A> implements Monad<A> {
    static map: <A, B>(f: (a: A) => B) => (m: Maybe<A>) => Maybe<B>;
    static chain: <A, B>(f: (a: A) => Maybe<B>) => (m: Maybe<A>) => Maybe<B>;
    static get: <A>(m: Maybe<A>) => A;
    static orElse: <A, B>(f: () => Maybe<B>) => (m: Maybe<A>) => Maybe<B>;
    static orJust: <A, B>(f: () => B) => (m: Maybe<A>) => Maybe<B>;
    /**
     * of wraps the passed value in a Maybe
     */
    of(a: A): Maybe<A>;
    /**
     * map
     */
    map<B>(f: (a: A) => B): Maybe<B>;
    /**
       * join
       */
    join(): A;
    /**
     * chain
     * @summary Maybe<A> →  (A →  Maybe<B>) →  Maybe<B>
     */
    chain<B>(f: (a: A) => Maybe<B>): Maybe<B>;
    /**
     * get the value wrapped by the Maybe
     * @throws {TypeError} if the Maybe is Nothing
     */
    get(): A;
    /**
     * orElse applies a function for transforming Nothing into a Just
     */
    orElse<B>(f: () => Maybe<B>): Maybe<B>;
    /**
     * orJust will turn Nothing into Just, wrapping the value specified.
     */
    orJust<B>(f: () => B): Maybe<B>;
    /**
     * cata applies the corresponding function to the Maybe
     */
    cata<C>(f: () => C, g: (A) => C): C;
}
/**
 * Nothing
 */
export declare class Nothing extends Maybe<null> {
}
/**
 * Just
 */
export declare class Just<A> extends Maybe<A> {
    a: A;
    constructor(a: A);
}
export declare const map: <A, B>(m: Maybe<A>) => (f: (a: A) => B) => Maybe<B>;
/**
 * just wraps a value in a Just
 */
export declare const just: <A>(a: A) => Maybe<A>;
/**
 * nothing constructs nothing
 */
export declare const nothing: () => Nothing;
/**
 * fromAny constructs a Maybe from a value that may be null.
 */
export declare const fromAny: <A>(a: A) => Maybe<A>;

import { Monad } from '../monad/Monad';
/**
 * Either monad implementation
 */
export declare class Either<L, R> implements Monad<R> {
    of(v: R): Either<L, R>;
    map<B>(f: (r: R) => B): Either<L, B>;
    /**
     * bimap does a map over either side.
     */
    bimap<LL, RR>(f: (l: L) => LL, g: (r: R) => RR): Either<LL, RR>;
    /**
     * chain
     */
    chain<B>(f: (r: R) => Either<L, B>): Either<L, B>;
    /**
     * join an inner monad value to the outer.
     */
    join(): R;
    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse<B>(f: (l: L) => B): Either<L, B>;
    /**
     * ap
     */
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B>;
    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    takeLeft(): L;
    /**
     * takeRight is the opposite of left
     * @summary Either<A,B> →  B|Error
     */
    takeRight(): R;
    /**
     * cata
     */
    cata<B>(f: (l: L) => B, g: (r: R) => B): B;
}
export declare class Left<L, R> extends Either<L, R> {
    l: L;
    constructor(l: L);
}
export declare class Right<L, R> extends Either<L, R> {
    r: R;
    constructor(r: R);
}
/**
 * left wraps a value on the left side.
 */
export declare const left: <A, B>(v: A) => Left<A, B>;
/**
 * right wraps a value on the right side.
 */
export declare const right: <A, B>(v: B) => Right<A, B>;

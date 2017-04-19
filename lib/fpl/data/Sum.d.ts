import { Functor } from './Functor';
/**
 * Sum
 */
export declare abstract class Sum<A> implements Functor<A> {
    map<B>(f: (A) => B): Sum<B>;
}
/**
 * Left
 */
export declare class Left<F, A> extends Sum<A> {
    x: Functor<F>;
    constructor(x: Functor<F>);
}
/**
 * Right
 */
export declare class Right<G> extends Sum<G> {
    y: Functor<G>;
    constructor(y: Functor<G>);
}
/**
 * left
 */
export declare const left: <A>(v: Functor<A>) => Sum<A>;
/**
 * right
 */
export declare const right: <B>(v: Functor<B>) => Sum<B>;

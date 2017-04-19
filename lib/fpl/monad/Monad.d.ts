import { Functor } from '../data/Functor';
export interface ChainFunction<A, B> {
    (a: A): Monad<B>;
}
/**
 * Monad
 */
export interface Monad<A> extends Functor<A> {
    of(t: A): Monad<A>;
    chain<B>(f: (a: A) => Monad<B>): Monad<B>;
}
/**
 * composeK two monadic functions into one.
 */
export declare const composeK: <A, B, C>(f: ChainFunction<B, C>, g: ChainFunction<A, B>) => ChainFunction<A, C>;
/**
 * pipeK the result of one monadic function into another.
 */
export declare const pipeK: <A, B, C>(f: ChainFunction<A, B>, g: ChainFunction<B, C>) => ChainFunction<A, C>;
/**
 * chain is a partially applied version of a Monad's chain.
 * It allows us to avoid anonymous functions when chaining monads.
 */
export declare const chain: <A, B>(f: ChainFunction<A, B>) => (m: Monad<A>) => Monad<B>;

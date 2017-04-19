import { Either } from './Either';
import { Monad } from './Monad';
import { Functor } from '../data/Functor';
/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export declare abstract class Free<F, A> implements Monad<A> {
    /**
     * of
     */
    of(a: A): Free<F, A>;
    /**
     * map
     */
    map<B>(f: (a: A) => B): any;
    /**
     * chain
     */
    chain<B>(g: (a: A) => Free<F, B>): Free<F, B>;
    /**
     * ap
     */
    /**
     * apRight
     * @summary Free<F,A> →  Free<F,B> →  Free<F,B>
     */
    /**
     * resume the next stage of the computation
     */
    resume(): Either<F, A>;
    /**
     * hoist
     */
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<F, A>;
    /**
     * cata
     */
    cata<B>(f: (f: F) => B, g: (a: A) => B): B;
    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    go<F>(f: (g: F) => Free<F, A>): A;
    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    run<F>(): A;
}
export declare class Suspend<F, A> extends Free<F, A> {
    f: F;
    constructor(f: F);
}
export declare class Return<A> extends Free<any, A> {
    a: A;
    constructor(a: A);
}
/**
 * free wraps a value in a free
 */
export declare const free: <A>(a: A) => Return<A>;
/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
export declare const suspend: <A>(f: () => A) => Suspend<(x: {}) => Return<{}>, {}>;
/**
 * liftF lifts a Functor into a Free.
 */
export declare const liftF: <F extends Functor<A>, A>(f: F) => Suspend<Functor<Return<A>>, {}>;

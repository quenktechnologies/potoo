import { Functor } from './Functor';
import { Either } from '../monad/Either';
/**
 * CoProduct
 */
export declare class CoProduct<L extends Functor<A>, R extends Functor<A>, A> implements Functor<A> {
    e: Either<L, R>;
    constructor(e: Either<L, R>);
    map<LB extends Functor<B>, RB extends Functor<B>, B>(f: (a: A) => B): CoProduct<LB, RB, B>;
    cata<C>(f: (l: L) => C, g: (r: R) => C): C;
}
/**
 * left
 */
export declare const left: <L extends Functor<A>, R extends Functor<A>, A>(f: L) => CoProduct<L, R, A>;
/**
 * right
 */
export declare const right: <L extends Functor<A>, R extends Functor<A>, A>(f: R) => CoProduct<L, R, A>;

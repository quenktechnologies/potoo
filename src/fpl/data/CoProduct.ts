import { Functor } from './Functor';
import { Left, Right, Either } from '../monad/Either';

/**
 * CoProduct
 */
export class CoProduct<L extends Functor<A>, R extends Functor<A>, A> implements Functor<A> {

    constructor(public e: Either<L, R>) { }

    map<LB extends Functor<B>, RB extends Functor<B>, B>
        (f: (a: A) => B): CoProduct<LB, RB, B> {

        return new CoProduct<LB, RB, B>(this.cata(
            (l: L) => new Left(l.map(f)),
            (r: R) => new Right(r.map(f))));

    }

    cata<C>(f: (l: L) => C, g: (r: R) => C): C {

        return this.e.cata(f, g);

    }

}

/**
 * left
 */
export const left = <L, R>(f: L) => new CoProduct(new Left<L, R>(f));

/**
 * right
 */
export const right = <R>(g: Functor<R>) => new CoProduct(new Right(g));

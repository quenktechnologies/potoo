import { Functor } from './Functor';
import { Left, Right, Either } from '../monad/Either';

/**
 * CoProduct
 */
export class CoProduct<L extends Functor<A>, R extends Functor<A>, A> implements Functor<A> {

    constructor(public e: Either<L, R>) { }

    map<LB extends Functor<B>, RB extends Functor<B>, B>(f: (a: A) => B): CoProduct<LB, RB, B> {

        return new CoProduct<LB, RB, B>(this.cata<any>(
            (l: Functor<A>) => new Left(l.map(f)),
            (r: Functor<A>) => new Right(r.map(f))));

    }

    cata<C>(f: (l: L) => C, g: (r: R) => C): C {

        return this.e.cata(f, g);

    }

}

/**
 * left
 */
export const left = <L extends Functor<A>, R extends Functor<A>, A>(f: L) =>
    new CoProduct<L, R, A>(new Left<L, R>(f));

/**
 * right
 */
export const right = <L extends Functor<A>, R extends Functor<A>, A>(f: R) =>
    new CoProduct<L, R, A>(new Right<L, R>(f));



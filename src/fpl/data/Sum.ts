import { match } from '../control/Match';
import { Functor } from './Functor';

/**
 * Sum
 */
export abstract class Sum<A> implements Functor<A> {

    map<B>(f: (A) => B): Sum<B> {

        return match(this)
            .caseOf(Left, ({ x }) => new Left(x.map(f)))
            .caseOf(Right, ({ y }) => new Right(y.map(f)))
            .end();

    }

}

/**
 * Left
 */
export class Left<F, A> extends Sum<A> {

    x: Functor<F>

    constructor(x: Functor<F>) {

        super();
        this.x = x;

    }

}

/**
 * Right
 */
export class Right<G> extends Sum<G> {

    y: Functor<G>

    constructor(y: Functor<G>) {

        super();
        this.y = y;

    }

}

/**
 * left
 */
export const left = <A>(v: Functor<A>): Sum<A> => new Left(v);

/**
 * right
 */
export const right = <B>(v: Functor<B>): Sum<B> => new Right(v);

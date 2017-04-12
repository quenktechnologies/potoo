import { Functor } from '../data/Functor';
import { Monad } from '../monad/Monad';
import { match } from '../control/Match';
import { identity } from '../util';

/**
 * Either monad implementation
 */
export abstract class Either<L, R> implements Functor<R>, Monad<R> {

    l: L;
    r: R;

    of(v: R): Either<R, R> {

        return right(v);

    }

    map<B>(f: (r: R) => B): Either<L, B> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, ({ r }: Right<R>) => right(f(r)))
            .end();

    }

    /**
     * chain
     */
    chain<A>(f: (R) => Either<L, A>): Either<L, R> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, r => r.map(f).join())
            .end();

    }

    /**
     * join an inner monad value to the outer.
     */
    join(): Either<L, R> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, ({ r }) => r)
            .end();

    }

    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse<A>(f: (l: L) => A): Either<A, R> {

        return match(this)
            .caseOf(Left, ({ a }) => f(a))
            .caseOf(Right, x => x)
            .end();

    }

    /**
     * ap
     */
    ap<C>(e: Either<L, ((R) => C)>): Either<L, C> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, ({ r }) => e.map(f => f(r)))
            .end();

    }

    /**
      * takeLeft extracts the left value of an Either, throwing an error if the Either is right.
      */
    takeLeft(): L {

        return match(this)
            .caseOf(Left, ({ l }) => l)
            .caseOf(Right, () => { throw new TypeError(`Not left!`); })
            .end();

    }

    /**
     * takeRight is the opposite of left
     * @summary Either<A,B> →  B|Error
     */
    takeRight(): R {

        return match(this)
            .caseOf(Left, () => { throw new TypeError(`Not right!`); })
            .caseOf(Right, ({ r }) => r)
            .end();

    }

    /**
     * cata
     */
    cata<A>(f: (l: L) => A, g: (r: R) => A): A {

        return match(this)
            .caseOf(Left, ({ l }: Left<L>) => f(l))
            .caseOf(Right, ({ r }) => g(r))
            .end();

    }

}

export class Left<L> extends Either<L, L> {

    constructor(l: L) {
        super();
        this.l = l;
    }

}

export class Right<R> extends Either<R, R>  {

    constructor(r: R) {
        super();
        this.r = r;
    }

}

/**
 * left wraps a value on the left side.
 */
export const left = <A>(v: A): Either<A, A> => new Left(v);

/**
 * right wraps a value on the right side.
 */
export const right = <B>(v: B): Either<B, B> => new Right(v);

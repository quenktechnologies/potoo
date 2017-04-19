import { Monad } from '../monad/Monad';
import { match } from '../control/Match';
import { identity } from '../util';

/**
 * Either monad implementation
 */
export class Either<L, R> implements Monad<R> {

    of(v: R): Either<L, R> {

        return new Right<L, R>(v);

    }

    map<B>(f: (r: R) => B): Either<L, B> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, ({ r }) => new Right<L, B>(f(r)))
            .end();

    }


    /**
     * bimap does a map over either side.
     */
    bimap<LL, RR>(f: (l: L) => LL, g: (r: R) => RR): Either<LL, RR> {

        return match(this)
            .caseOf(Left, ({ l }) => left<LL, RR>(f(l)))
            .caseOf(Right, ({ r }) => right<LL, RR>(g(r)))
            .end();

    }

    /**
     * chain
     */
    chain<B>(f: (r: R) => Either<L, B>): Either<L, B> {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, r => r.map(f).join())
            .end();

    }

    /**
     * join an inner monad value to the outer.
     */
    join(): R {

        return match(this)
            .caseOf(Left, identity)
            .caseOf(Right, ({ r }) => r)
            .end();

    }

    /**
     * orElse returns the result of f if the Either is left.
     */
    orElse<B>(f: (l: L) => B): Either<L, B> {

        return match(this)
            .caseOf(Left, ({ l }) => f(l))
            .caseOf(Right, x => x)
            .end();

    }

    /**
     * ap
     */
    ap<B>(e: Either<L, (r: R) => B>): Either<L, B> {

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
    cata<B>(f: (l: L) => B, g: (r: R) => B): B {

        return match(this)
            .caseOf(Left, ({ l }) => f(l))
            .caseOf(Right, ({ r }) => g(r))
            .end();

    }

}

export class Left<L, R> extends Either<L, R> {

    constructor(public l: L) { super(); }

}

export class Right<L, R> extends Either<L, R>  {

    constructor(public r: R) { super(); }

}

/**
 * left wraps a value on the left side.
 */
export const left = <A, B>(v: A) => new Left<A, B>(v);

/**
 * right wraps a value on the right side.
 */
export const right = <A, B>(v: B) => new Right<A, B>(v);

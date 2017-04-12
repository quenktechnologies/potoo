import { compose, constant, identity } from '../util';
import { left, right, Left, Right, Either } from './Either';
import { match } from '../control/Match';
import { Monad } from './Monad';
import { Functor } from '../data/Functor';

/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export abstract class Free<A> implements Monad<A> {

    /**
     * of
     */
    of(a: A): Free<A> {

        return new Return(a);

    }

    /**
     * map
     */
    map<B>(f: (a: A) => B): Free<B> {

        return this.chain(<(a: A) => Free<B>>compose(free, f));

    }

    /**
     * chain
     */
    chain<B>(g: (a: A) => Free<B>): Free<B> {

        return match(this)
            .caseOf(Suspend, ({ f }) =>
                (typeof f === 'function') ?
                    new Suspend(x => f(x).chain(g)) :
                    new Suspend(f.map(free => free.chain(g))))
            .caseOf(Return, ({ a }) =>
                g(a))
            .end();

    }

    /**
     * ap
     */
    ap<B>(f: Free<(a: A) => B>): Free<B> {

        return this.chain(x => f.map(g => g(x)));

    }

    /**
     * apRight
     * @summary Free<F,A> →  Free<F,B> →  Free<F,B>
     */
    apRight<B>(f: Free<(a: A) => B>): Free<B> {

        return f.ap(this.map(constant(identity)));

    }

    /**
     * resume the next stage of the computation
     */
    resume<F>(): Either<F, A> {

        return match(this)
            .caseOf(Suspend, ({ f }) => left(f))
            .caseOf(Return, ({ a }) => right(a))
            .end();

    }

    /**
     * hoist
     */
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<A> {

        return match(this)

            .caseOf(Suspend, ({ f }) =>
                new Suspend((func(f))
                    .map((fr: B): Free<B> => (<Free<B>><any>fr).hoist(func))))

            .caseOf(Return, identity)
            .end();

    }

    /**
     * fold provides a transformation from a Free chain to a Monad.
     * note: since we don't have a way to know what that Monad is we return
     * Return which is a Monad, pattern match on it to get the final Monad.
     * @summary Free<F<A>> →  (F<X> →  Monad<X>) →  Monad<A>
     */
    fold<F>(g: (f: F) => Monad<A>): Monad<A> {

        return match(this)
            .caseOf(Suspend, ({ f }) => g(f).chain((x: Free<A>) => x.fold(g)))
            .caseOf(Return, x => g(x))
            .end();

    }


    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    go<F>(f: (g: F) => Free<A>): A {

        return match(this)
            .caseOf(Suspend, s => {

                let r = s.resume();

                while (r instanceof Left)
                    r = (f(r.takeLeft())).resume();

                return r.takeRight();

            })
            .caseOf(Return, ({ a }) => a)
            .end();

    }
    /**
     * run the Free chain to completion
     * @summary run :: Free<A→ A,A> →  A
     */
    run<F>(): A {

        return this.go((next: F): Free<A> => (<Function><any>next)());

    }

}

export class Suspend<F> extends Free<F> {

    f: F;

    constructor(f: F) {

        super();
        this.f = f;

    }

}

export class Return<A> extends Free<A> {

    a: A;

    constructor(a: A) {

        super();
        this.a = a;

    }

}

/**
 * free wraps a value in a free
 */
export const free = <A>(a: A): Free<A> => new Return(a);

/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
export const suspend = <A>(f: Function): Free<Function> =>
    new Suspend(<() => Free<A>>compose(free, f))

/**
 * liftF lifts a Functor into a Free.
 */
export const liftF = <A>(f: Functor<A>): Free<Functor<Free<A>>> => new Suspend(f.map(free));

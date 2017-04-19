import { compose, identity } from '../util';
import { left, right, Left, Either } from './Either';
import { match } from '../control/Match';
import { Monad } from './Monad';
import { Functor } from '../data/Functor';

/**
 * Free is a Free monad that also implements a Free Applicative (almost).
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export abstract class Free<F, A> implements Monad<A> {

    /**
     * of
     */
    of(a: A): Free<F, A> {

        return new Return(a);

    }

    /**
     * map
     */
    map<B>(f: (a: A) => B) {

        return this.chain(compose(free, f));

    }

    /**
     * chain
     */
    chain<B>(g: (a: A) => Free<F, B>): Free<F, B> {

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
    // ap<B>(f: Free<(a: A) => B>): Free<F,B> {

    ///  return this.chain(x => f.map(g => g(x)));

    //}

    /**
     * apRight
     * @summary Free<F,A> →  Free<F,B> →  Free<F,B>
     */
    //  apRight<B>(f: Free<(a: A) => B>): Free<B> {

    //    return f.ap(this.map(constant(identity)));

    // }

    /**
     * resume the next stage of the computation
     */
    resume(): Either<F, A> {

        return match(this)
            .caseOf(Suspend, ({ f }) => left<F, A>(f))
            .caseOf(Return, ({ a }) => right<F, A>(a))
            .end();

    }

    /**
     * hoist
     */
    hoist<B>(func: (fb: Functor<B>) => Functor<B>): Free<F, A> {

        return match(this)
            .caseOf(Suspend, ({ f }) =>
                new Suspend((func(f))
                    .map((fr: B): Free<F, B> => (<Free<F, B>><any>fr).hoist(func))))
            .caseOf(Return, identity)
            .end();

    }

    /**
     * cata 
     */
    cata<B>(f: (f: F) => B, g: (a: A) => B): B {

        return this.resume().cata(f, g);

    }

    /**
     * go runs the computation to completion using f to extract each stage.
     * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
     */
    go<F>(f: (g: F) => Free<F, A>): A {

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

        return this.go((next: F): Free<F, A> => (<Function><any>next)());

    }

}

export class Suspend<F, A> extends Free<F, A> {

    f: F;

    constructor(f: F) {

        super();
        this.f = f;

    }

}

export class Return<A> extends Free<any, A> {

    a: A;

    constructor(a: A) {

        super();
        this.a = a;

    }

}

/**
 * free wraps a value in a free
 */
export const free = <A>(a: A) => new Return(a);

/**
 * suspend lifts a function into a Free monad to mimic tail call recursion.
 */
export const suspend = <A>(f: () => A) => new Suspend(compose(free, f));

/**
 * liftF lifts a Functor into a Free.
 */
export const liftF = <F extends Functor<A>, A>(f: F) => new Suspend(f.map(free));

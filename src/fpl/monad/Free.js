import { isFunction, compose } from '../util';
import { left, right, Left } from './Either';
import { match } from '../control/Match';

/**
 * Free
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
export class Free {

    constructor() {

        this.map = map(this);
        this.chain = chain(this);
        this.resume = ()=>resume(this);
        this.go = go(this);

    }

}

export class Suspend extends Free {

    constructor(f) {

        super();
        this.f = f;

    }

}

export class Return extends Free {

    constructor(a) {

        super();
        this.a = a;

    }

}

/**
 * of wraps a value in a Free
 * @summary of :: A →  Free<F,A>
 */
export const of = a => new Return(a);

/**
 * liftF lifts a functor into a Free
 * @summary liftF :: Functor<A> →  Free<F,A>
 */
export const liftF = f => typeof f === 'function' ?
    new Suspend(compose(of, f)) :
    new Suspend(f.map(of))

/**
 * map
 * @summary map :: Free<F,A> →  (A →  B)  →  Free<F, B>
 */
export const map = fr => f => fr.chain(compose(of, isFunction(f)));

/**
 * chain
 * @summary chain :: Free<F,A> →  (A →  Free<F,B) →  Free<F,B>
 */
export const chain = fr => g => match(fr)
    .caseOf(Suspend, ({ f }) => (typeof fr.f === 'function') ?
        new Suspend(x => f(x).chain(isFunction(g))) :
        new Suspend(f.map(free => free.chain(isFunction(g)))))
    .caseOf(Return, ({ a }) => isFunction(g).call(null, a))
    .end();

/**
 * resume the next stage of the computation
 * @summary resume :: Free<F<*>,A> →  Either<F<Free<F,A>>, A>
 */
export const resume = fr => match(fr)
    .caseOf(Suspend, ({ f }) => left(f))
    .caseOf(Return, ({ a }) => right(a))
    .end();

/**
 * go runs the computation to completion using f to extract each stage.
 * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
 */
export const go = fr => f => match(fr)
    .caseOf(Suspend, sus => {

        let r = sus.resume();

        while (r instanceof Left)
            r = (isFunction(f)(r.left())).resume();

        return r.right();

    })
    .caseOf(Return, ({ a }) => a)
    .end();

/**
 * run the Free chain to completion
 * @summary run :: Free<A→ A,A> →  A
 */
export const run = fr => fr.go(f => f());

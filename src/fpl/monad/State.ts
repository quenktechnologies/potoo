import { Monad } from './Monad';

export interface StateCallback<A, S> {

    (s: S): [A, S]

}

/**
 * State is a monadic class that we use to hold information that changes
 * during computation.
 *
 * This implementation is influenced by:
 * @link https://en.wikipedia.org/wiki/Monad_(functional_programming)#State_monads
 * @property {s →  (a, s)} a
 */
export class State<A, S> implements Monad<A> {

    f: StateCallback<A, S>;

    constructor(f: StateCallback<A, S>) {

        this.f = f;

    }

    /**
     * of wraps a value in the State monad.
     * @summary A →  State<S→ {A,S}>
     */
    of(a: A): State<A, S> {

        return new State((s: S) => ([a, s]));

    }

    /**
     * map
     * @summary State<S → {A,S}> →  (A →  B) →  State<S →  {C, S}>
     */
    map<B>(f: (a: A) => B): State<B, S> {

        return new State((xs: S) => {
            let [a, s] = this.run(xs);
            return [f(a), s];
        })

    }

    /**
     * join replaces the outer State with an inner State
     */
    join(): State<A, S> {

        return new State((xs: S): [A, S] => {
            let [a, s] = this.run(xs);
            return (<State<A, S>><any>a).run(s);
        });

    }

    /**
     * chain
     */
    chain<B>(f: (a: A) => State<B, S>): State<B, S> {

        return (this.map(f) as any as State<B, S>).join();

    }

    /**
     * evaluate the State returning the final value
     */
    evaluate(s: S): A {

        return this.run(s)[0];

    }

    /**
     * execute the State returning the final state.
     */
    execute(s: S): S {

        return this.run(s)[1];

    }

    /**
     * run the State yielding the final value and state.
     * @summary State<S→ {A<S}> →  S →  {A,S}
     */
    run(s: S): [A, S] {

        return this.f(s);

    }

}

/**
 * get the state from the internals of the monad
 */
export const get = <S>() => new State((s: S) => ([s, s]));

/**
 * put
 */
export const put = <S>(s: S) => new State(() => ([null, s]));

/**
 * modify the state
 * @summary  (S →  S) →  State<S →  {A, S} >
 */
export const modify = <S>(f: (s: S) => S) => get().chain((s: S) => put(f(s)));

/**
 * gets applies a function to the state putting using the result
 * as the result of the computation.
 * @summary (S →  A) →  State<S →  {A, S}>
 */
export const gets = <S, A>(f: (s: S) => A) => get().chain((s: S) => state(f(s)));

/**
 * state create a new State monad
 */
export const state = <A, S>(a: A) => new State((s: S) => ([a, s]));


import { Monad } from './Monad';
export interface StateCallback<A, S> {
    (s: S): [A, S];
}
/**
 * State is a monadic class that we use to hold information that changes
 * during computation.
 *
 * This implementation is influenced by:
 * @link https://en.wikipedia.org/wiki/Monad_(functional_programming)#State_monads
 * @property {s →  (a, s)} a
 */
export declare class State<A, S> implements Monad<A> {
    f: StateCallback<A, S>;
    constructor(f: StateCallback<A, S>);
    /**
     * of wraps a value in the State monad.
     * @summary A →  State<S→ {A,S}>
     */
    of(a: A): State<A, S>;
    /**
     * map
     * @summary State<S → {A,S}> →  (A →  B) →  State<S →  {C, S}>
     */
    map<B>(f: (a: A) => B): State<B, S>;
    /**
     * join replaces the outer State with an inner State
     */
    join(): State<A, S>;
    /**
     * chain
     */
    chain<B>(f: (a: A) => State<B, S>): State<B, S>;
    /**
     * evaluate the State returning the final value
     */
    evaluate(s: S): A;
    /**
     * execute the State returning the final state.
     */
    execute(s: S): S;
    /**
     * run the State yielding the final value and state.
     * @summary State<S→ {A<S}> →  S →  {A,S}
     */
    run(s: S): [A, S];
}
/**
 * get the state from the internals of the monad
 */
export declare const get: <S>() => State<S, S>;
/**
 * put
 */
export declare const put: <S>(s: S) => State<any, S>;
/**
 * modify the state
 * @summary  (S →  S) →  State<S →  {A, S} >
 */
export declare const modify: <S>(f: (s: S) => S) => State<any, {}>;
/**
 * gets applies a function to the state putting using the result
 * as the result of the computation.
 * @summary (S →  A) →  State<S →  {A, S}>
 */
export declare const gets: <S, A>(f: (s: S) => A) => State<A, {}>;
/**
 * state create a new State monad
 */
export declare const state: <A, S>(a: A) => State<A, S>;

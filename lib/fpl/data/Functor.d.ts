/**
 * Functor a simple Functor that can be mapped.
 */
export interface Functor<A> {
    map<B>(f: MapFunction<A, B>): Functor<B>;
}
export interface MapFunction<A, B> {
    (a: A): B;
}
/**
 * map is a partially applied version of a Functor's map.
 * Its purpose is to allow us to map over Functors without creating anonymous functions.
 */
export declare const map: <A, B>(f: MapFunction<A, B>) => (m: Functor<A>) => Functor<B>;

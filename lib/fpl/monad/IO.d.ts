/**
 * IO monadic type for containing interactions with the 'real world'.
 */
export declare class IO<A> {
    private effect;
    constructor(effect: () => A);
    static chain: <A, B>(f: (a: A) => IO<B>) => (m: IO<A>) => IO<B>;
    of(v: A): IO<A>;
    map<B>(f: (a: A) => B): IO<B>;
    mapIn<B>(b: B): IO<B>;
    /**
     * chain
     */
    chain<B>(f: (a: A) => IO<B>): IO<B>;
    chainIn<B>(b: B): IO<B>;
    /**
     * run
     */
    run(): A;
}
/**
 * wrapIO a value in the IO monad
 */
export declare const wrapIO: <A>(a: A) => IO<A>;
/**
 * safeIO accepts a function that has side effects and wrapIOs it in an IO Monad.
 */
export declare const safeIO: <A>(f: () => A) => IO<A>;

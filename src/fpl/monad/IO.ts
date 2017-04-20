/**
 * IO monadic type for containing interactions with the 'real world'.
 */
export class IO<A> {

    constructor(private effect: () => A) { }

    static chain = <A, B>(f: (a: A) => IO<B>) => (m: IO<A>): IO<B> => m.chain(f);

    of(v: A): IO<A> {

        return new IO(() => v);

    }

    map<B>(f: (a: A) => B): IO<B> {

        return new IO(() => f(this.effect()));

    }

    mapIn<B>(b: B): IO<B> {

        return this.map(() => b);

    }

    /**
     * chain
     */
    chain<B>(f: (a: A) => IO<B>): IO<B> {

        return new IO(() => f(this.effect()).run());

    }

    chainIn<B>(b: B): IO<B> {

        return this.chain(() => wrapIO(b));

    }

    /**
     * run
     */
    run(): A {

        return this.effect();

    }

}

/**
 * wrapIO a value in the IO monad
 */
export const wrapIO = <A>(a: A) => new IO(() => a);

/**
 * safeIO accepts a function that has side effects and wrapIOs it in an IO Monad.
 */
export const safeIO = <A>(f: () => A) => new IO(f);

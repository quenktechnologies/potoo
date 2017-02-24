/**
 * Identity
 * @param {*} value
 */
export class Identity {

    constructor(value) {

        this._value = value;

    }

    map(f) {

        return new Identity(f(this._value));

    }

    chain(f) {

        return f(this._value);

    }

    ap(m) {

        return m.map(this._value);

    }

}

/**
 * Maybe
 */
export class Maybe {

    static not(v) {

        return v == null ? new Nothing() : new Just(v);

    }

    static of(v) {

        return new Just(v);

    }

}

/**
 * Nothing
 */
export class Nothing {

    chain() {

        return this;

    }

    orElse(f) {

        return f();

    }

    just() {

        throw new TypeError('just() is not implemented on Nothing!');

    }

    cata(l, r) {

        return r();

    }

}

/**
 * Just
 */
export class Just {

    constructor(v) {

        this.value = v;

    }

    chain(f) {

        return this.value == null ? new Nothing() : f(this.value);

    }

    orElse(f) {

        return this.value == null ? f() : this;

    }

    just() {

        return this.value;

    }

    cata(l, r) {

        return this.value == null ? l(this.value) : r(this.value);

    }

}

/**
 * Either monad.
 * @abstract
 */
export class Either {

    constructor(v) {

        this._value = v;

    }

    join() {

        return this.chain(x => x);

    }

    cata(l, r) {

        return (this instanceof Left) ? l(this._value) : r(this._value);

    }

}

/**
 * Right represents the correct thing.
 */
export class Right extends Either {

    map(f) {

        return new Right(f(this._value));

    }

    chain(f) {

        return f(this._value);

    }

    orElse() {

        return this;

    }

    ap(either) {

        return either.map(fn => fn(this._value));

    }

}

export class Left extends Either {

    map() {

        return this;

    }

    chain() {

        return this;

    }

    orElse(f) {

        return f(this._value);

    }

    ap() {

        return this;

    }

}

export class Reader {

    constructor(f) {

        this._value = f;

    }

    map(f) {

        return new Reader(config =>
            f(this.run(config)));

    }

    chain() {

        return new Reader(config =>
            this.run(config).run(config));
    }

    ap(reader) {

        reader.map(fn => fn(this._value));

    }

    run(config) {

        return this._value(config);

    }

}

/**
 * State is a monadic class that we use to hold information that changes
 * during compilation. It keeps the changes insolated from the
 * rest of the process until needed so we can have a 'pure' compilation.
 *
 * This implementation is influenced by:
 * @link https://en.wikipedia.org/wiki/Monad_(functional_programming)#State_monads
 * @param {*} value
 */
export class State {

    constructor(value) {

        this._value = value;

    }

    static unit(value) {

        return new State(state => ({ value, state }));

    }

    static get() {

        return new State(state => ({ value: state, state }));

    }

    static put(state) {

        return new State(() => ({ value: null, state }));

    }

    static modify(f) {

        return State.get().chain(state =>
            State.put(f(state)));
    }

    static gets(f) {

        return State.get().chain(state =>
            State.unit(f(state)))

    }

    map(f) {

        return new State(s => {
            let { value, state } = this.run(s);
            return { value: f(value), state };
        });

    }

    join() {

        return new State(s => {
            let { value, state } = this.run(s);
            return value.run(state);
        });

    }

    chain(f) {

        return this.map(f).join();

    }

    evalState(initState) {

        return this.run(initState).value;

    }

    execState(initState) {

        return this.run(initState).state;

    }

    run(s) {

        return this._value(s);

    }

}

/**
 * IO monadic type for containing interactions with the 'real world'.
 */
export class IO {

    constructor(f) {

        this.f = f;

    }

    static of(v) {

        return new IO(typeof v === 'function' ? v : () => v);

    }

    map(f) {

        return new IO(() => f(this.f()));
    }

    chain(f) {

        return new IO(() => f(this.f()).run());
    }

    ap(io) {

        return io.map(f => f(this.f()));
    }

    run() {
        return this.f()
    }

}

/**
 * identity returns an Identity monad with.
 * @param {*} value
 */
export const identity = v => new Identity(v);

/**
 * right constructs a new Right type.
 * @param {*} value
 * @returns {Right}
 */
export function right(value) {

    return new Right(value);

}



/**
 * left constructs a new Left type.
 * @param {*} value
 * @returns {Left}
 */
export function left(value) {

    return new Left(value);

}

export const state = (value) =>
    State.unit(value);

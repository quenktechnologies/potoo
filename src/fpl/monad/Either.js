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

    left() {

        if (this instanceof Left)
            return this._value;

        throw new TypeError(`Either#left(): '${this.constructor.name}' is not instance of Left!`);

    }

    right() {

        if (this instanceof Right)
            return this._value;

        throw new TypeError(`Either#right(): '${this.constructor.name}' is not instance of Right!`);

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



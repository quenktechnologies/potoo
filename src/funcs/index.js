import beof from 'beof';

export const OK = true;

/**
 * This module provides some Callables that make
 * filtering messages less onerous.
 */

/**
 * InstanceOf preforms an instanceof check on the input before execution.
 * @param {function} predicate
 * @param {function} f
 * @implements {Callable}
 */
export class InstanceOf {

    constructor(predicate, f) {

        beof({ predicate }).function();
        beof({ f }).function();

        this._predicate = predicate;
        this._f = f;

    }

    call(context, value) {

        return (value instanceof this._predicate) ? this._f.call(context, value) : null;

    }

}

/**
 * insof checks if the value supplied is an instance of the predicate.
 * @param {function} predicate
 * @param {function} f
 * @returns {Callable}
 */
export function insof(predicate, f) {

    var c = new InstanceOf(predicate, f);
    return function(v) { return c.call(this, v); }

}

/**
 * Or preforms a logical 'or' between two Callables.
 * @param {Callable} left
 * @param {Callable} right
 * @implements {Callable}
 */
export class Or {

    constructor(left, right) {

        beof({ left }).function();
        beof({ right }).function();

        this._left = left;
        this._right = right;

    }

    call(context, value) {

        return this._left.call(context, value) || this._right.call(context, value);

    }

}

/**
 * Or preforms a logical 'or' between two Callables
 * @param {Callable} right
 * @param {Callable} right
 */
export function or(left, right) {

    var c = new Or(left, right);
    return function(v) { return c.call(this, v); }

}

/**
 * Type preforms a type check before executing it's function.
 * @param {string} type
 * @param {Callable} f
 */
export class Type {

    constructor(type, f) {

        beof({ type }).string();
        beof({ f }).function();

        this._type = type;
        this._f = f;

    }

    call(context, value) {

        return (typeof value === this._type) ? this._f(value) : null;

    }

}

/**
 * Type preforms a type check before executing it's function.
 * @param {string} type
 * @param {Callable} f
 */
export function type(type, f) {

    var c = new Type(type, f);
    return function(v) { return c.call(this, v); }

}


/**
 * Is preforms a stricy equality comparison between it's predicate
 * and input before executing it's function.
 * @param {*} value
 * @param {function} f
 */
export class Is {

    constructor(value, f) {

        beof({ value }).string();
        beof({ f }).function();

        this._value = value;
        this._f = f;

    }

    call(context, value) {

        return (value === this._value) ? this._f(value) : null;

    }

}

/**
 * is preforms a stricy equality comparison between it's predicate
 * and input before executing it's function.
 * @param {*} value
 * @param {function} f
 */
export function is(value, f) {

    var c = new Is(value, f);
    return function(v) { return c.call(this, v); }

}

/**
 * Required executes its function when an object has the required keys.
 * @param {object} keys
 * @param {Callable} f
 */
export class Required {

    constructor(keys, f) {

        beof({ keys }).object();
        beof({ f }).function();

        this._keys = keys;
        this._f = f;

    }

    call(context, value) {

        var keys = this._keys;

        if (typeof value !== 'object') return null;

        value = Object.keys(keys).reduce((prev, key) => {
            console.log('previous va ', prev);
            if (prev == null) return prev;

            if (keys[key]) {

                if (prev.hasOwnProperty(key))
                    return prev;

            } else {

                if (!value.hasOwnProperty(key))
                    return prev;
            }

            return null;

        }, value);

        return (value == null) ? value : this._f(value);

    }

}

/**
 * required requires the value to posses a set of keys.
 * @param {object} keys
 * @param {Callable} f
 * @returns {Callable}
 */
export function required(value, f) {

    var c = new Required(value, f);
    return function(v) { return c.call(this, v); }

}

/**
 * ok accepts a boolean value to decide whether or not to excute its
 * Callable.
 * @param {boolean} check
 * @param {Callable} f
 * @return {Callbale}
 */
export function ok(check, f) {

    return function(v) { return check ? f(v) : null };

}



/**
 * Equals executes its function if the value is strictly equal to its check.
 * @param {*} check
 * @param {Callable} f
 * @implements {Callable}
 */
export class Equals {

    constructor(check, f) {

        beof({ f }).function();

        this._check = check;
        this._f = f;

    }

    call(context, value) {

        return (value === this._check) ? this._f(value) : null;

    }

}

/**
 * eql
 * @param {*} check
 * @param {Callable} f
 */
export function eql(check, f) {

    var c = new Equals(check, f);
    return function(v) { return c.call(this, v); }

}

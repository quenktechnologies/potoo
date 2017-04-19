/**
 * identity is the famed identity function.
 */
export const identity = <A>(a: A): A => a;

/**
 * merge two objects easily
 */
export const merge = (o1: Object, o2: Object): Object => Object.assign({}, o1, o2);

/**
 * reduce an object 
 */
export const reduce = <A>(o: Object, f: (A, string, Object) => A, i: A) =>
    Object.keys(o).reduce((p, k) => f(p, o[k], o), i);

/**
 * pipe the results of one function into the following.
 */
export const pipe = function <A, B>(..._f: ((a: A) => B)[]): (a: A) => B {

    let i = arguments.length;
    let args = [];

    while (i--) args[i] = arguments[i];
    return x => args.reduce((v, n) => n(v), x);

}

/**
 * compose k functions into one.
 */
export const composeK = function <A, B>(..._f: ((a: A) => B)[]): (a: A) => B {

    let i = 0;
    let args = [];

    while (i++ <= arguments.length) args[i] = arguments[i];
    return x => args.reduce((v, n) => n(v), x);

}

/**
 * compose two functions into one.
 */
export const compose = <A, B, C>(f: (a: B) => C, g: (a: A) => B) => (x: A) => f(g(x));

/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
export const fling = (s, o) => {

    if ((o == null) || (o.constructor !== Object))
        throw new TypeError('fling(): only works with object literals!');

    return Object.keys(o).reduce((o2, k) => k === s ? o2 : merge(o2, {
        [k]: o[k]
    }), {});

}

/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
export const head = list => list[0];

/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
export const tail = list => list[list.length - 1];

/**
 * partial is a poor man's way of turning a function of arity 1-3 into
 * a function that accepts one argumment. Recognizes a Function.length of 3 max
 * @summary {(Function, *) →  (* →  *)}
 */
export const partial = <A>(f: Function, a: A) =>
    f.length === 1 ?
        () => f(a) :
        f.length === 2 ?
            b => f(a, b) :
            f.length === 3 ?
                (b, c) => f(a, b, c) :
                f.length === 4 ?
                    (b, c, d) => f(a, b, c, d) :
                    (() => { throw new RangeError(`Function ${f} has an arity of ${f.length} (> 4)`) })();

/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
export const constant = <A>(a: A): ((any) => A) => () => a;

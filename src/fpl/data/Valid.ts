import { left, right, Right, Either } from '../monad/Either';

/**
 * @module be
 *
 * This is a module for faking strong types in javascript. The reasoning
 * behind it is that javascript's duck typing can lead to frustrating
 * sublte errors as a code base grows. Alternatives exists such as
 * TypeScript, Flow etc. however this works without introducing
 * too much complexity on an existing code base.
 */

const merge = (x, y) => Object.assign({}, x, y);
const basket = () => Object.create(null);

/**
 * builtins is a set of functions that expand errors into more descriptive
 * meanings.
 */
export const builtins = {

};

/**
 * ListError is a container for all the errors that occured in a list.
 * @param {object} errors
 */
export function ListError(errors) {

    this.message = 'list-error';
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;
    this.errors = errors;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

ListError.prototype = Object.create(Error.prototype);
ListError.prototype.constructor = ListError;

const expected = (what: string, v: any) =>
    `Expected ${what} but got (${typeof v}) ` +
    `${v ? v.constructor ? v.constructor.name : v : v}`;

/**
 * hope a value passes its test, throws an error if not returns the value otherwise.
 * @param {string} name
 * @param {*} value
 * @param {function} test
 * @summary {(string, * , * → Either<Error,*>) →  Either<Error,*>}
 */
export const hope = (k, v, test) => test(v).cata(e => {
    throw new Error(`Error occured while processing key '${k}': \n ${e.stack}`);
}, x => x);

/**
 * nothing allows the value to be null or undefined.
 * @return {function}
 * @summary {* →  Either<Error, *>}
 */
export const nothing = v => (v == null) ? right(v) : right(v);

/**
 * any means anything goes
 * @param {*} v
 * @returns {Either}
 * @summary {* → Either<Error, *>}
 */
export const any = v => right(v);

/**
 * type requires the functor value to be an instance of the specified user type.
 * @param {*} T
 * @return {function}
 * @summary {class →  * →  Either<Error, *>}
 */
export const type = C => v =>
    (C === String) ?
        (typeof v === 'string') ?
            right(v) : left(new TypeError(expected('string', v))) :

        (C === Boolean) ?
            (typeof v === 'boolean') ?
                right(v) : left(new TypeError(expected('boolean', v))) :

            (C === Number) ?
                (typeof v === 'number') ?
                    right(v) : left(new TypeError(expected('number', v))) :

                !(v instanceof C) ?
                    left(new TypeError(expected(`instance of '${C.name}'`, v))) : right(v);

/**
 * kind
 */
export const kind = Iface => v => {

    if (typeof Iface !== 'function')
        throw new TypeError(`kind(): Cannot use non-class ` +
            `(${typeof Iface}) ${Iface} as an interface!`);

    let o = new Iface();
    let proto = Object.getPrototypeOf(o);

    return type(Object)(v).cata(x => x, v => {

        let missing = Object.getOwnPropertyNames(proto).
            filter(k => (k === 'constructor') ? false :
                (typeof v[k] === typeof proto[k]) ?
                    false :
                    true);

        return (missing.length !== 0) ?
            left(expected(`kind of ${Iface.name} (missing methods ${missing.join(',')})`, v)) :
            right(v);

    });

}

/**
 * every checks that the supplied array contains acceptable values.
 * It combines an array type check to accomplish this.
 * @param {*} check
 * @return {function}
 * @summary { (* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
export const every = check => v =>
    type(Array)(v)
        .map(v => v.reduce(({ errs, vals }, member, index) =>
            check(member)
                .cata(e =>
                    ({
                        errs: merge(errs, {
                            [index]: e
                        }),
                        vals
                    }),
                v =>
                    ({ errs, vals: vals.concat(v) })), { errs: basket(), vals: [] }))
        .chain(({ errs, vals }) =>
            (Object.keys(errs).length > 0) ?
                left(new ListError(errs)) :
                right(vals));

/**
 * seq calls the functions supplied from left to right passing the result of
 * the previous into the next
 * @param {function} ...f
 * @return {function}
 * @summary {...(* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
export const seq = function() {

    let n = arguments.length;
    let a = [];

    while (--n)
        a[n] = arguments[n];

    return x => a.reduce((p, c) => p.chain(c), right(x));

}

/**
 * defaults sets the value if not specified
 * @param {*} dv
 * @returns {function}
 * @summary { * →  * →  Either<Error,*>}
 */
export const defaults = dv => v => (v == null) ? right(dv) : right(v);

/**
 * set the value to x
 * @param {*} x
 * @return {function}
 * @summary {* → * → Either<Error, *>}
 */
export const set = x => () => right(x);

/**
 * call
 */
export const call = f => x => right(f(x));

/**
 * or is a logical or between two Either yielding functions
 * @returns {function}
 * @summary { (*→ Either<Error, *>, * → Either<Error, *>) →  * →  Either<Error, *> }
 */
export const or = <A, B>(l: (A) => Either<Error, A>, r: (A) => Either<Error, B>) => {

    return v => l(v).orElse(() => r(v));

}

/**
 * bool converts an Either into a boolean value
 * left = false, right = true
 * @summary {( * →  Either<Error, *>) →  * →  boolean
 */
export const bool = test => v => (test(v) instanceof Right) ? true : false;

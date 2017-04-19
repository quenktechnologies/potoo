"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Either_1 = require("../monad/Either");
/**
 * @module be
 *
 * This is a module for faking strong types in javascript. The reasoning
 * behind it is that javascript's duck typing can lead to frustrating
 * sublte errors as a code base grows. Alternatives exists such as
 * TypeScript, Flow etc. however this works without introducing
 * too much complexity on an existing code base.
 */
var merge = function (x, y) { return Object.assign({}, x, y); };
var basket = function () { return Object.create(null); };
/**
 * builtins is a set of functions that expand errors into more descriptive
 * meanings.
 */
exports.builtins = {};
/**
 * ListError is a container for all the errors that occured in a list.
 * @param {object} errors
 */
function ListError(errors) {
    this.message = 'list-error';
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;
    this.errors = errors;
    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);
}
exports.ListError = ListError;
ListError.prototype = Object.create(Error.prototype);
ListError.prototype.constructor = ListError;
var expected = function (what, v) {
    return "Expected " + what + " but got (" + typeof v + ") " +
        ("" + (v ? v.constructor ? v.constructor.name : v : v));
};
/**
 * hope a value passes its test, throws an error if not returns the value otherwise.
 * @param {string} name
 * @param {*} value
 * @param {function} test
 * @summary {(string, * , * → Either<Error,*>) →  Either<Error,*>}
 */
exports.hope = function (k, v, test) { return test(v).cata(function (e) {
    throw new Error("Error occured while processing key '" + k + "': \n " + e.stack);
}, function (x) { return x; }); };
/**
 * nothing allows the value to be null or undefined.
 * @return {function}
 * @summary {* →  Either<Error, *>}
 */
exports.nothing = function (v) { return (v == null) ? Either_1.right(v) : Either_1.right(v); };
/**
 * any means anything goes
 * @param {*} v
 * @returns {Either}
 * @summary {* → Either<Error, *>}
 */
exports.any = function (v) { return Either_1.right(v); };
/**
 * type requires the functor value to be an instance of the specified user type.
 * @param {*} T
 * @return {function}
 * @summary {class →  * →  Either<Error, *>}
 */
exports.type = function (C) { return function (v) {
    return (C === String) ?
        (typeof v === 'string') ?
            Either_1.right(v) : Either_1.left(new TypeError(expected('string', v))) :
        (C === Boolean) ?
            (typeof v === 'boolean') ?
                Either_1.right(v) : Either_1.left(new TypeError(expected('boolean', v))) :
            (C === Number) ?
                (typeof v === 'number') ?
                    Either_1.right(v) : Either_1.left(new TypeError(expected('number', v))) :
                !(v instanceof C) ?
                    Either_1.left(new TypeError(expected("instance of '" + C.name + "'", v))) : Either_1.right(v);
}; };
/**
 * kind
 */
exports.kind = function (Iface) { return function (v) {
    if (typeof Iface !== 'function')
        throw new TypeError("kind(): Cannot use non-class " +
            ("(" + typeof Iface + ") " + Iface + " as an interface!"));
    var o = new Iface();
    var proto = Object.getPrototypeOf(o);
    return exports.type(Object)(v).cata(function (x) { return x; }, function (v) {
        var missing = Object.getOwnPropertyNames(proto).
            filter(function (k) { return (k === 'constructor') ? false :
            (typeof v[k] === typeof proto[k]) ?
                false :
                true; });
        return (missing.length !== 0) ?
            Either_1.left(expected("kind of " + Iface.name + " (missing methods " + missing.join(',') + ")", v)) :
            Either_1.right(v);
    });
}; };
/**
 * every checks that the supplied array contains acceptable values.
 * It combines an array type check to accomplish this.
 * @param {*} check
 * @return {function}
 * @summary { (* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
exports.every = function (check) { return function (v) {
    return exports.type(Array)(v)
        .map(function (v) { return v.reduce(function (_a, member, index) {
        var errs = _a.errs, vals = _a.vals;
        return check(member)
            .cata(function (e) {
            return ({
                errs: merge(errs, (_a = {},
                    _a[index] = e,
                    _a)),
                vals: vals
            });
            var _a;
        }, function (v) {
            return ({ errs: errs, vals: vals.concat(v) });
        });
    }, { errs: basket(), vals: [] }); })
        .chain(function (_a) {
        var errs = _a.errs, vals = _a.vals;
        return (Object.keys(errs).length > 0) ?
            Either_1.left(new ListError(errs)) :
            Either_1.right(vals);
    });
}; };
/**
 * seq calls the functions supplied from left to right passing the result of
 * the previous into the next
 * @param {function} ...f
 * @return {function}
 * @summary {...(* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
exports.seq = function () {
    var n = arguments.length;
    var a = [];
    while (--n)
        a[n] = arguments[n];
    return function (x) { return a.reduce(function (p, c) { return p.chain(c); }, Either_1.right(x)); };
};
/**
 * defaults sets the value if not specified
 * @param {*} dv
 * @returns {function}
 * @summary { * →  * →  Either<Error,*>}
 */
exports.defaults = function (dv) { return function (v) { return (v == null) ? Either_1.right(dv) : Either_1.right(v); }; };
/**
 * set the value to x
 * @param {*} x
 * @return {function}
 * @summary {* → * → Either<Error, *>}
 */
exports.set = function (x) { return function () { return Either_1.right(x); }; };
/**
 * call
 */
exports.call = function (f) { return function (x) { return Either_1.right(f(x)); }; };
/**
 * or is a logical or between two Either yielding functions
 * @returns {function}
 * @summary { (*→ Either<Error, *>, * → Either<Error, *>) →  * →  Either<Error, *> }
 */
exports.or = function (l, r) {
    return function (v) { return l(v).orElse(function () { return r(v); }); };
};
/**
 * bool converts an Either into a boolean value
 * left = false, right = true
 * @summary {( * →  Either<Error, *>) →  * →  boolean
 */
exports.bool = function (test) { return function (v) { return (test(v) instanceof Either_1.Right) ? true : false; }; };
//# sourceMappingURL=Valid.js.map
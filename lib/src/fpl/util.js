"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * identity is the famed identity function.
 */
exports.identity = function (a) { return a; };
/**
 * merge two objects easily
 */
exports.merge = function (o1, o2) { return Object.assign({}, o1, o2); };
/**
 * reduce an object
 */
exports.reduce = function (o, f, i) {
    return Object.keys(o).reduce(function (p, k) { return f(p, o[k], o); }, i);
};
/**
 * pipe the results of one function into the following.
 */
exports.pipe = function () {
    var _f = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _f[_i] = arguments[_i];
    }
    var i = arguments.length;
    var args = [];
    while (i--)
        args[i] = arguments[i];
    return function (x) { return args.reduce(function (v, n) { return n(v); }, x); };
};
/**
 * compose k functions into one.
 */
exports.composeK = function () {
    var _f = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        _f[_i] = arguments[_i];
    }
    var i = 0;
    var args = [];
    while (i++ <= arguments.length)
        args[i] = arguments[i];
    return function (x) { return args.reduce(function (v, n) { return n(v); }, x); };
};
/**
 * compose two functions into one.
 */
exports.compose = function (f, g) { return function (x) { return f(g(x)); }; };
/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
exports.fling = function (s, o) {
    if ((o == null) || (o.constructor !== Object))
        throw new TypeError('fling(): only works with object literals!');
    return Object.keys(o).reduce(function (o2, k) {
        return k === s ? o2 : exports.merge(o2, (_a = {},
            _a[k] = o[k],
            _a));
        var _a;
    }, {});
};
/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
exports.head = function (list) { return list[0]; };
/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
exports.tail = function (list) { return list[list.length - 1]; };
/**
 * partial is a poor man's way of turning a function of arity 1-3 into
 * a function that accepts one argumment. Recognizes a Function.length of 3 max
 * @summary {(Function, *) →  (* →  *)}
 */
exports.partial = function (f, a) {
    return f.length === 1 ?
        function () { return f(a); } :
        f.length === 2 ?
            function (b) { return f(a, b); } :
            f.length === 3 ?
                function (b, c) { return f(a, b, c); } :
                f.length === 4 ?
                    function (b, c, d) { return f(a, b, c, d); } :
                    (function () { throw new RangeError("Function " + f + " has an arity of " + f.length + " (> 4)"); })();
};
/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
exports.constant = function (a) { return function () { return a; }; };
//# sourceMappingURL=util.js.map
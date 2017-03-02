'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bool = exports.or = exports.force = exports.defaults = exports.seq = exports.every = exports.kind = exports.type = exports.any = exports.nothing = exports.hope = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.ListError = ListError;

var _monad = require('./monad');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @module be
 *
 * This is a module for faking strong types in javascript. The reasoning
 * behind it is that javascript's duck typing can lead to frustrating
 * sublte errors as a code base grows. Alternatives exists such as
 * TypeScript, Flow etc. however this works without introducing
 * too much complexity on an existing code base.
 */

var merge = function merge(x, y) {
    return Object.assign({}, x, y);
};
var basket = function basket() {
    return Object.create(null);
};

/**
 * ListError is a container for all the errors that occured in a list.
 * @param {object} errors
 */
function ListError(errors) {

    this.message = 'list-error';
    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;
    this.errors = errors;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

ListError.prototype = Object.create(Error.prototype);
ListError.prototype.constructor = ListError;

var expected = function expected(what, v) {
    return 'Expected ' + what + ' but got (' + (typeof v === 'undefined' ? 'undefined' : _typeof(v)) + ') ' + ('' + (v ? v.constructor ? v.constructor.name : v : v));
};

/**
 * hope a value passes its test, throws an error if not returns the value otherwise.
 * @param {string} name
 * @param {*} value
 * @param {function} test
 * @summary {(string, * , * → Either<Error,*>) →  Either<Error,*>}
 */
var hope = exports.hope = function hope(k, v, test) {
    return test(v).cata(function (e) {
        throw new Error('Error occured while processing key \'' + k + '\': \n ' + e.stack);
    }, function (x) {
        return x;
    });
};

/**
 * nothing allows the value to be null or undefined.
 * @return {function}
 * @summary {* →  Either<Error, *>}
 */
var nothing = exports.nothing = function nothing(v) {
    return v == null ? (0, _monad.right)(v) : (0, _monad.right)(v);
};

/**
 * any means anything goes
 * @param {*} v
 * @returns {Either}
 * @summary {* → Either<Error, *>}
 */
var any = exports.any = function any(v) {
    return (0, _monad.right)(v);
};

/**
 * type requires the functor value to be an instance of the specified user type.
 * @param {*} T
 * @return {function}
 * @summary {class →  * →  Either<Error, *>}
 */
var type = exports.type = function type(C) {
    return function (v) {
        return C === String ? typeof v === 'string' ? (0, _monad.right)(v) : (0, _monad.left)(new TypeError(expected('string', v))) : C === Number ? typeof v === 'number' ? (0, _monad.right)(v) : (0, _monad.left)(new TypeError(expected('number', v))) : !(v instanceof C) ? (0, _monad.left)(new TypeError(expected('instance of \'' + C.name + '\'', v))) : (0, _monad.right)(v);
    };
};

/**
 * kind
 */
var kind = exports.kind = function kind(Iface) {
    return function (v) {

        if (typeof Iface !== 'function') throw new TypeError('kind(): Cannot use non-class ' + ('(' + (typeof Iface === 'undefined' ? 'undefined' : _typeof(Iface)) + ') ' + Iface + ' as an interface!'));

        var o = new Iface();
        var proto = Object.getPrototypeOf(o);

        return type(Object)(v).cata(function (x) {
            return x;
        }, function (v) {

            var missing = Object.getOwnPropertyNames(proto).filter(function (k) {
                return k === 'constructor' ? false : _typeof(v[k]) === _typeof(proto[k]) ? false : true;
            });

            return missing.length !== 0 ? (0, _monad.left)(expected('kind of ' + Iface.name + ' (missing methods ' + missing.join(',') + ')', v)) : (0, _monad.right)(v);
        });
    };
};

/**
 * every checks that the supplied array contains acceptable values.
 * It combines an array type check to accomplish this.
 * @param {*} check
 * @return {function}
 * @summary { (* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
var every = exports.every = function every(check) {
    return function (v) {
        return type(Array)(v).map(function (v) {
            return v.reduce(function (_ref, member, index) {
                var errs = _ref.errs,
                    vals = _ref.vals;
                return check(member).cata(function (e) {
                    return {
                        errs: merge(errs, _defineProperty({}, index, e)),
                        vals: vals
                    };
                }, function (v) {
                    return { errs: errs, vals: vals.concat(v) };
                });
            }, { errs: basket(), vals: [] });
        }).chain(function (_ref2) {
            var errs = _ref2.errs,
                vals = _ref2.vals;
            return Object.keys(errs).length > 0 ? (0, _monad.left)(new ListError(errs)) : (0, _monad.right)(vals);
        });
    };
};

/**
 * seq calls the functions supplied from left to right passing the result of
 * the previous into the next
 * @param {function} ...f
 * @return {function}
 * @summary {...(* →  Either<Error,*>) →  * →  Either<Error, *> }
 */
var seq = exports.seq = function seq() {

    var n = arguments.length;
    var a = [];

    while (--n) {
        a[n] = arguments[n];
    }return function (x) {
        return a.reduce(function (p, c) {
            return p.chain(c);
        }, (0, _monad.right)(x));
    };
};

/**
 * defaults sets the value if not specified
 * @param {*} dv
 * @returns {function}
 * @summary { * →  * →  Either<Error,*>}
 */
var defaults = exports.defaults = function defaults(dv) {
    return function (v) {
        return v == null ? (0, _monad.right)(dv) : (0, _monad.right)(v);
    };
};

/**
 * force the value to be x
 * @param {*} x
 * @return {function}
 * @summary {* → * → Either<Error, *>}
 */
var force = exports.force = function force(x) {
    return function () {
        return (0, _monad.right)(x);
    };
};

/**
 * or is a logical or between two Either yielding functions
 * @param {function} l
 * @param {function} r
 * @returns {function}
 * @summary { (*→ Either<Error, *>, * → Either<Error, *>) →  * →  Either<Error, *> }
 */
var or = exports.or = function or(l, r) {

    if (typeof l !== 'function') throw new TypeError('or(): ' + expected('a function for left value'), l);

    if (typeof r !== 'function') throw new TypeError('or(): ' + expected('a function for right value'), l);

    return function (v) {
        return l(v).orElse(function () {
            return r(v);
        });
    };
};

/**
 * bool converts an Either into a boolean value
 * left = false, right = true
 * @summary {( * →  Either<Error, *>) →  * →  boolean
 */
var bool = exports.bool = function bool(test) {
    return function (v) {
        return test(v) instanceof _monad.Right ? true : false;
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iZS5qcyJdLCJuYW1lcyI6WyJMaXN0RXJyb3IiLCJtZXJnZSIsIngiLCJ5IiwiT2JqZWN0IiwiYXNzaWduIiwiYmFza2V0IiwiY3JlYXRlIiwiZXJyb3JzIiwibWVzc2FnZSIsInN0YWNrIiwiRXJyb3IiLCJuYW1lIiwiY29uc3RydWN0b3IiLCJoYXNPd25Qcm9wZXJ0eSIsImNhcHR1cmVTdGFja1RyYWNlIiwicHJvdG90eXBlIiwiZXhwZWN0ZWQiLCJ3aGF0IiwidiIsImhvcGUiLCJrIiwidGVzdCIsImNhdGEiLCJlIiwibm90aGluZyIsImFueSIsInR5cGUiLCJDIiwiU3RyaW5nIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwia2luZCIsIklmYWNlIiwibyIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJtaXNzaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImZpbHRlciIsImxlbmd0aCIsImpvaW4iLCJldmVyeSIsIkFycmF5IiwibWFwIiwicmVkdWNlIiwibWVtYmVyIiwiaW5kZXgiLCJlcnJzIiwidmFscyIsImNoZWNrIiwiY29uY2F0IiwiY2hhaW4iLCJrZXlzIiwic2VxIiwibiIsImFyZ3VtZW50cyIsImEiLCJwIiwiYyIsImRlZmF1bHRzIiwiZHYiLCJmb3JjZSIsIm9yIiwibCIsInIiLCJvckVsc2UiLCJib29sIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7UUFtQmdCQSxTLEdBQUFBLFM7O0FBbkJoQjs7OztBQUVBOzs7Ozs7Ozs7O0FBVUEsSUFBTUMsUUFBUSxTQUFSQSxLQUFRLENBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVVDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxDQUFsQixFQUFxQkMsQ0FBckIsQ0FBVjtBQUFBLENBQWQ7QUFDQSxJQUFNRyxTQUFTLFNBQVRBLE1BQVM7QUFBQSxXQUFNRixPQUFPRyxNQUFQLENBQWMsSUFBZCxDQUFOO0FBQUEsQ0FBZjs7QUFFQTs7OztBQUlPLFNBQVNQLFNBQVQsQ0FBbUJR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LE1BQU0sSUFBSWxDLFNBQUosWUFBdUJiLFNBQVMsMkJBQVQsQ0FBdkIsRUFBZ0UrQyxDQUFoRSxDQUFOOztBQUVKLFFBQUksT0FBT0MsQ0FBUCxLQUFhLFVBQWpCLEVBQ0ksTUFBTSxJQUFJbkMsU0FBSixZQUF1QmIsU0FBUyw0QkFBVCxDQUF2QixFQUFpRStDLENBQWpFLENBQU47O0FBRUosV0FBTztBQUFBLGVBQUtBLEVBQUU3QyxDQUFGLEVBQUsrQyxNQUFMLENBQVk7QUFBQSxtQkFBTUQsRUFBRTlDLENBQUYsQ0FBTjtBQUFBLFNBQVosQ0FBTDtBQUFBLEtBQVA7QUFFSCxDQVZNOztBQVlQOzs7OztBQUtPLElBQU1nRCxzQkFBTyxTQUFQQSxJQUFPO0FBQUEsV0FBUTtBQUFBLGVBQU03QyxLQUFLSCxDQUFMLHlCQUFELEdBQTZCLElBQTdCLEdBQW9DLEtBQXpDO0FBQUEsS0FBUjtBQUFBLENBQWIiLCJmaWxlIjoiYmUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBsZWZ0LCByaWdodCwgUmlnaHQgfSBmcm9tICcuL21vbmFkJztcblxuLyoqXG4gKiBAbW9kdWxlIGJlXG4gKlxuICogVGhpcyBpcyBhIG1vZHVsZSBmb3IgZmFraW5nIHN0cm9uZyB0eXBlcyBpbiBqYXZhc2NyaXB0LiBUaGUgcmVhc29uaW5nXG4gKiBiZWhpbmQgaXQgaXMgdGhhdCBqYXZhc2NyaXB0J3MgZHVjayB0eXBpbmcgY2FuIGxlYWQgdG8gZnJ1c3RyYXRpbmdcbiAqIHN1Ymx0ZSBlcnJvcnMgYXMgYSBjb2RlIGJhc2UgZ3Jvd3MuIEFsdGVybmF0aXZlcyBleGlzdHMgc3VjaCBhc1xuICogVHlwZVNjcmlwdCwgRmxvdyBldGMuIGhvd2V2ZXIgdGhpcyB3b3JrcyB3aXRob3V0IGludHJvZHVjaW5nXG4gKiB0b28gbXVjaCBjb21wbGV4aXR5IG9uIGFuIGV4aXN0aW5nIGNvZGUgYmFzZS5cbiAqL1xuXG5jb25zdCBtZXJnZSA9ICh4LCB5KSA9PiBPYmplY3QuYXNzaWduKHt9LCB4LCB5KTtcbmNvbnN0IGJhc2tldCA9ICgpID0+IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbi8qKlxuICogTGlzdEVycm9yIGlzIGEgY29udGFpbmVyIGZvciBhbGwgdGhlIGVycm9ycyB0aGF0IG9jY3VyZWQgaW4gYSBsaXN0LlxuICogQHBhcmFtIHtvYmplY3R9IGVycm9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gTGlzdEVycm9yKGVycm9ycykge1xuXG4gICAgdGhpcy5tZXNzYWdlID0gJ2xpc3QtZXJyb3InO1xuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcbiAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuTGlzdEVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbkxpc3RFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBMaXN0RXJyb3I7XG5cbmNvbnN0IGV4cGVjdGVkID0gKHdoYXQsIHYpID0+XG4gICAgYEV4cGVjdGVkICR7d2hhdH0gYnV0IGdvdCAoJHt0eXBlb2Ygdn0pIGAgK1xuICAgIGAke3Y/IHYuY29uc3RydWN0b3I/IHYuY29uc3RydWN0b3IubmFtZTp2OnZ9YDtcblxuLyoqXG4gKiBob3BlIGEgdmFsdWUgcGFzc2VzIGl0cyB0ZXN0LCB0aHJvd3MgYW4gZXJyb3IgaWYgbm90IHJldHVybnMgdGhlIHZhbHVlIG90aGVyd2lzZS5cbiAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB0ZXN0XG4gKiBAc3VtbWFyeSB7KHN0cmluZywgKiAsICog4oaSIEVpdGhlcjxFcnJvciwqPikg4oaSICBFaXRoZXI8RXJyb3IsKj59XG4gKi9cbmV4cG9ydCBjb25zdCBob3BlID0gKGssIHYsIHRlc3QpID0+IHRlc3QodikuY2F0YShlID0+IHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIG9jY3VyZWQgd2hpbGUgcHJvY2Vzc2luZyBrZXkgJyR7a30nOiBcXG4gJHtlLnN0YWNrfWApO1xufSwgeCA9PiB4KTtcblxuLyoqXG4gKiBub3RoaW5nIGFsbG93cyB0aGUgdmFsdWUgdG8gYmUgbnVsbCBvciB1bmRlZmluZWQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsqIOKGkiAgRWl0aGVyPEVycm9yLCAqPn1cbiAqL1xuZXhwb3J0IGNvbnN0IG5vdGhpbmcgPSB2ID0+ICh2ID09IG51bGwpID8gcmlnaHQodikgOiByaWdodCh2KTtcblxuLyoqXG4gKiBhbnkgbWVhbnMgYW55dGhpbmcgZ29lc1xuICogQHBhcmFtIHsqfSB2XG4gKiBAcmV0dXJucyB7RWl0aGVyfVxuICogQHN1bW1hcnkgeyog4oaSIEVpdGhlcjxFcnJvciwgKj59XG4gKi9cbmV4cG9ydCBjb25zdCBhbnkgPSB2ID0+IHJpZ2h0KHYpO1xuXG4vKipcbiAqIHR5cGUgcmVxdWlyZXMgdGhlIGZ1bmN0b3IgdmFsdWUgdG8gYmUgYW4gaW5zdGFuY2Ugb2YgdGhlIHNwZWNpZmllZCB1c2VyIHR5cGUuXG4gKiBAcGFyYW0geyp9IFRcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQHN1bW1hcnkge2NsYXNzIOKGkiAgKiDihpIgIEVpdGhlcjxFcnJvciwgKj59XG4gKi9cbmV4cG9ydCBjb25zdCB0eXBlID0gQyA9PiB2ID0+XG4gICAgKEMgPT09IFN0cmluZykgP1xuICAgICh0eXBlb2YgdiA9PT0gJ3N0cmluZycpID9cbiAgICByaWdodCh2KSA6IGxlZnQobmV3IFR5cGVFcnJvcihleHBlY3RlZCgnc3RyaW5nJywgdikpKSA6XG5cbiAgICAoQyA9PT0gTnVtYmVyKSA/XG4gICAgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykgP1xuICAgIHJpZ2h0KHYpIDogbGVmdChuZXcgVHlwZUVycm9yKGV4cGVjdGVkKCdudW1iZXInLCB2KSkpIDpcblxuICAgICEodiBpbnN0YW5jZW9mIEMpID9cbiAgICBsZWZ0KG5ldyBUeXBlRXJyb3IoZXhwZWN0ZWQoYGluc3RhbmNlIG9mICcke0MubmFtZX0nYCwgdikpKSA6IHJpZ2h0KHYpO1xuXG4vKipcbiAqIGtpbmRcbiAqL1xuZXhwb3J0IGNvbnN0IGtpbmQgPSBJZmFjZSA9PiB2ID0+IHtcblxuICAgIGlmICh0eXBlb2YgSWZhY2UgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGtpbmQoKTogQ2Fubm90IHVzZSBub24tY2xhc3MgYCArXG4gICAgICAgICAgICBgKCR7dHlwZW9mIElmYWNlfSkgJHtJZmFjZX0gYXMgYW4gaW50ZXJmYWNlIWApO1xuXG4gICAgbGV0IG8gPSBuZXcgSWZhY2UoKTtcbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG5cbiAgICByZXR1cm4gdHlwZShPYmplY3QpKHYpLmNhdGEoeCA9PiB4LCB2ID0+IHtcblxuICAgICAgICBsZXQgbWlzc2luZyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5cbiAgICAgICAgZmlsdGVyKGsgPT4gKGsgPT09ICdjb25zdHJ1Y3RvcicpID8gZmFsc2UgOlxuICAgICAgICAgICAgKHR5cGVvZiB2W2tdID09PSB0eXBlb2YgcHJvdG9ba10pID9cbiAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgIHRydWUpO1xuXG4gICAgICAgIHJldHVybiAobWlzc2luZy5sZW5ndGggIT09IDApID9cbiAgICAgICAgICAgIGxlZnQoZXhwZWN0ZWQoYGtpbmQgb2YgJHtJZmFjZS5uYW1lfSAobWlzc2luZyBtZXRob2RzICR7bWlzc2luZy5qb2luKCcsJyl9KWAsIHYpKSA6XG4gICAgICAgICAgICByaWdodCh2KTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogZXZlcnkgY2hlY2tzIHRoYXQgdGhlIHN1cHBsaWVkIGFycmF5IGNvbnRhaW5zIGFjY2VwdGFibGUgdmFsdWVzLlxuICogSXQgY29tYmluZXMgYW4gYXJyYXkgdHlwZSBjaGVjayB0byBhY2NvbXBsaXNoIHRoaXMuXG4gKiBAcGFyYW0geyp9IGNoZWNrXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsgKCog4oaSICBFaXRoZXI8RXJyb3IsKj4pIOKGkiAgKiDihpIgIEVpdGhlcjxFcnJvciwgKj4gfVxuICovXG5leHBvcnQgY29uc3QgZXZlcnkgPSBjaGVjayA9PiB2ID0+XG4gICAgdHlwZShBcnJheSkodilcbiAgICAubWFwKHYgPT4gdi5yZWR1Y2UoKHsgZXJycywgdmFscyB9LCBtZW1iZXIsIGluZGV4KSA9PlxuICAgICAgICBjaGVjayhtZW1iZXIpXG4gICAgICAgIC5jYXRhKGUgPT5cbiAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgZXJyczogbWVyZ2UoZXJycywge1xuICAgICAgICAgICAgICAgICAgICBbaW5kZXhdOiBlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgdmFsc1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2ID0+XG4gICAgICAgICAgICAoeyBlcnJzLCB2YWxzOiB2YWxzLmNvbmNhdCh2KSB9KSksIHsgZXJyczogYmFza2V0KCksIHZhbHM6IFtdIH0pKVxuICAgIC5jaGFpbigoeyBlcnJzLCB2YWxzIH0pID0+XG4gICAgICAgIChPYmplY3Qua2V5cyhlcnJzKS5sZW5ndGggPiAwKSA/XG4gICAgICAgIGxlZnQobmV3IExpc3RFcnJvcihlcnJzKSkgOlxuICAgICAgICByaWdodCh2YWxzKSk7XG5cbi8qKlxuICogc2VxIGNhbGxzIHRoZSBmdW5jdGlvbnMgc3VwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0IHBhc3NpbmcgdGhlIHJlc3VsdCBvZlxuICogdGhlIHByZXZpb3VzIGludG8gdGhlIG5leHRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IC4uLmZcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQHN1bW1hcnkgey4uLigqIOKGkiAgRWl0aGVyPEVycm9yLCo+KSDihpIgICog4oaSICBFaXRoZXI8RXJyb3IsICo+IH1cbiAqL1xuZXhwb3J0IGNvbnN0IHNlcSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGxldCBhID0gW107XG5cbiAgICB3aGlsZSAoLS1uKVxuICAgICAgICBhW25dID0gYXJndW1lbnRzW25dO1xuXG4gICAgcmV0dXJuIHggPT4gYS5yZWR1Y2UoKHAsIGMpID0+IHAuY2hhaW4oYyksIHJpZ2h0KHgpKTtcblxufVxuXG4vKipcbiAqIGRlZmF1bHRzIHNldHMgdGhlIHZhbHVlIGlmIG5vdCBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7Kn0gZHZcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsgKiDihpIgICog4oaSICBFaXRoZXI8RXJyb3IsKj59XG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IGR2ID0+IHYgPT4gKHYgPT0gbnVsbCkgPyByaWdodChkdikgOiByaWdodCh2KTtcblxuLyoqXG4gKiBmb3JjZSB0aGUgdmFsdWUgdG8gYmUgeFxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsqIOKGkiAqIOKGkiBFaXRoZXI8RXJyb3IsICo+fVxuICovXG5leHBvcnQgY29uc3QgZm9yY2UgPSB4ID0+ICgpID0+IHJpZ2h0KHgpO1xuXG4vKipcbiAqIG9yIGlzIGEgbG9naWNhbCBvciBiZXR3ZWVuIHR3byBFaXRoZXIgeWllbGRpbmcgZnVuY3Rpb25zXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBsXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSByXG4gKiBAcmV0dXJucyB7ZnVuY3Rpb259XG4gKiBAc3VtbWFyeSB7ICgq4oaSIEVpdGhlcjxFcnJvciwgKj4sICog4oaSIEVpdGhlcjxFcnJvciwgKj4pIOKGkiAgKiDihpIgIEVpdGhlcjxFcnJvciwgKj4gfVxuICovXG5leHBvcnQgY29uc3Qgb3IgPSAobCwgcikgPT4ge1xuXG4gICAgaWYgKHR5cGVvZiBsICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBvcigpOiAke2V4cGVjdGVkKCdhIGZ1bmN0aW9uIGZvciBsZWZ0IHZhbHVlJyl9YCwgbCk7XG5cbiAgICBpZiAodHlwZW9mIHIgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYG9yKCk6ICR7ZXhwZWN0ZWQoJ2EgZnVuY3Rpb24gZm9yIHJpZ2h0IHZhbHVlJyl9YCwgbCk7XG5cbiAgICByZXR1cm4gdiA9PiBsKHYpLm9yRWxzZSgoKSA9PiByKHYpKTtcblxufVxuXG4vKipcbiAqIGJvb2wgY29udmVydHMgYW4gRWl0aGVyIGludG8gYSBib29sZWFuIHZhbHVlXG4gKiBsZWZ0ID0gZmFsc2UsIHJpZ2h0ID0gdHJ1ZVxuICogQHN1bW1hcnkgeyggKiDihpIgIEVpdGhlcjxFcnJvciwgKj4pIOKGkiAgKiDihpIgIGJvb2xlYW5cbiAqL1xuZXhwb3J0IGNvbnN0IGJvb2wgPSB0ZXN0ID0+IHYgPT4gKHRlc3QodikgaW5zdGFuY2VvZiBSaWdodCkgPyB0cnVlIDogZmFsc2U7XG4iXX0=
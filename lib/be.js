'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bool = exports.or = exports.call = exports.force = exports.defaults = exports.seq = exports.every = exports.kind = exports.type = exports.any = exports.nothing = exports.hope = exports.builtins = undefined;

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
 * builtins is a set of functions that expand errors into more descriptive
 * meanings.
 */
var builtins = exports.builtins = {};

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
        return C === String ? typeof v === 'string' ? (0, _monad.right)(v) : (0, _monad.left)(new TypeError(expected('string', v))) : C === Boolean ? typeof v === 'boolean' ? (0, _monad.right)(v) : (0, _monad.left)(new TypeError(expected('boolean', v))) : C === Number ? typeof v === 'number' ? (0, _monad.right)(v) : (0, _monad.left)(new TypeError(expected('number', v))) : !(v instanceof C) ? (0, _monad.left)(new TypeError(expected('instance of \'' + C.name + '\'', v))) : (0, _monad.right)(v);
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
 * call
 */
var call = exports.call = function call(f) {
    return function (x) {
        return (0, _monad.right)(f(x));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9iZS5qcyJdLCJuYW1lcyI6WyJMaXN0RXJyb3IiLCJtZXJnZSIsIngiLCJ5IiwiT2JqZWN0IiwiYXNzaWduIiwiYmFza2V0IiwiY3JlYXRlIiwiYnVpbHRpbnMiLCJlcnJvcnMiLCJtZXNzYWdlIiwic3RhY2siLCJFcnJvciIsIm5hbWUiLCJjb25zdHJ1Y3RvciIsImhhc093blByb3BlcnR5IiwiY2FwdHVyZVN0YWNrVHJhY2UiLCJwcm90b3R5cGUiLCJleHBlY3RlZCIsIndoYXQiLCJ2IiwiaG9wZSIsImsiLCJ0ZXN0IiwiY2F0YSIsImUiLCJub3RoaW5nIiwiYW55IiwidHlwZSIsIkMiLCJTdHJpbmciLCJUeXBlRXJyb3IiLCJCb29sZWFuIiwiTnVtYmVyIiwia2luZCIsIklmYWNlIiwibyIsInByb3RvIiwiZ2V0UHJvdG90eXBlT2YiLCJtaXNzaW5nIiwiZ2V0T3duUHJvcGVydHlOYW1lcyIsImZpbHRlciIsImxlbmd0aCIsImpvaW4iLCJldmVyeSIsIkFycmF5IiwibWFwIiwicmVkdWNlIiwibWVtYmVyIiwiaW5kZXgiLCJlcnJzIiwidmFscyIsImNoZWNrIiwiY29uY2F0IiwiY2hhaW4iLCJrZXlzIiwic2VxIiwibiIsImFyZ3VtZW50cyIsImEiLCJwIiwiYyIsImRlZmF1bHRzIiwiZHYiLCJmb3JjZSIsImNhbGwiLCJmIiwib3IiLCJsIiwiciIsIm9yRWxzZSIsImJvb2wiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQTJCZ0JBLFMsR0FBQUEsUzs7QUEzQmhCOzs7O0FBRUE7Ozs7Ozs7Ozs7QUFVQSxJQUFNQyxRQUFRLFNBQVJBLEtBQVEsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILENBQWxCLEVBQXFCQyxDQUFyQixDQUFWO0FBQUEsQ0FBZDtBQUNBLElBQU1HLFNBQVMsU0FBVEEsTUFBUztBQUFBLFdBQU1GLE9BQU9HLE1BQVAsQ0FBYyxJQUFkLENBQU47QUFBQSxDQUFm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Ozs7OztBQU1PLElBQU00Qyx3QkFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBSztBQUFBLGVBQU0sa0JBQU05RCxDQUFOLENBQU47QUFBQSxLQUFMO0FBQUEsQ0FBZDs7QUFFUDs7O0FBR08sSUFBTStELHNCQUFPLFNBQVBBLElBQU87QUFBQSxXQUFLO0FBQUEsZUFBSyxrQkFBTUMsRUFBRWhFLENBQUYsQ0FBTixDQUFMO0FBQUEsS0FBTDtBQUFBLENBQWI7O0FBRVA7Ozs7Ozs7QUFPTyxJQUFNaUUsa0JBQUssU0FBTEEsRUFBSyxDQUFDQyxDQUFELEVBQUlDLENBQUosRUFBVTs7QUFFeEIsUUFBSSxPQUFPRCxDQUFQLEtBQWEsVUFBakIsRUFDSSxNQUFNLElBQUlyQyxTQUFKLFlBQXVCYixTQUFTLDJCQUFULENBQXZCLEVBQWdFa0QsQ0FBaEUsQ0FBTjs7QUFFSixRQUFJLE9BQU9DLENBQVAsS0FBYSxVQUFqQixFQUNJLE1BQU0sSUFBSXRDLFNBQUosWUFBdUJiLFNBQVMsNEJBQVQsQ0FBdkIsRUFBaUVrRCxDQUFqRSxDQUFOOztBQUVKLFdBQU87QUFBQSxlQUFLQSxFQUFFaEQsQ0FBRixFQUFLa0QsTUFBTCxDQUFZO0FBQUEsbUJBQU1ELEVBQUVqRCxDQUFGLENBQU47QUFBQSxTQUFaLENBQUw7QUFBQSxLQUFQO0FBRUgsQ0FWTTs7QUFZUDs7Ozs7QUFLTyxJQUFNbUQsc0JBQU8sU0FBUEEsSUFBTztBQUFBLFdBQVE7QUFBQSxlQUFNaEQsS0FBS0gsQ0FBTCx5QkFBRCxHQUE2QixJQUE3QixHQUFvQyxLQUF6QztBQUFBLEtBQVI7QUFBQSxDQUFiIiwiZmlsZSI6ImJlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbGVmdCwgcmlnaHQsIFJpZ2h0IH0gZnJvbSAnLi9tb25hZCc7XG5cbi8qKlxuICogQG1vZHVsZSBiZVxuICpcbiAqIFRoaXMgaXMgYSBtb2R1bGUgZm9yIGZha2luZyBzdHJvbmcgdHlwZXMgaW4gamF2YXNjcmlwdC4gVGhlIHJlYXNvbmluZ1xuICogYmVoaW5kIGl0IGlzIHRoYXQgamF2YXNjcmlwdCdzIGR1Y2sgdHlwaW5nIGNhbiBsZWFkIHRvIGZydXN0cmF0aW5nXG4gKiBzdWJsdGUgZXJyb3JzIGFzIGEgY29kZSBiYXNlIGdyb3dzLiBBbHRlcm5hdGl2ZXMgZXhpc3RzIHN1Y2ggYXNcbiAqIFR5cGVTY3JpcHQsIEZsb3cgZXRjLiBob3dldmVyIHRoaXMgd29ya3Mgd2l0aG91dCBpbnRyb2R1Y2luZ1xuICogdG9vIG11Y2ggY29tcGxleGl0eSBvbiBhbiBleGlzdGluZyBjb2RlIGJhc2UuXG4gKi9cblxuY29uc3QgbWVyZ2UgPSAoeCwgeSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgeCwgeSk7XG5jb25zdCBiYXNrZXQgPSAoKSA9PiBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG4vKipcbiAqIGJ1aWx0aW5zIGlzIGEgc2V0IG9mIGZ1bmN0aW9ucyB0aGF0IGV4cGFuZCBlcnJvcnMgaW50byBtb3JlIGRlc2NyaXB0aXZlXG4gKiBtZWFuaW5ncy5cbiAqL1xuZXhwb3J0IGNvbnN0IGJ1aWx0aW5zID0ge1xuXG59O1xuXG4vKipcbiAqIExpc3RFcnJvciBpcyBhIGNvbnRhaW5lciBmb3IgYWxsIHRoZSBlcnJvcnMgdGhhdCBvY2N1cmVkIGluIGEgbGlzdC5cbiAqIEBwYXJhbSB7b2JqZWN0fSBlcnJvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIExpc3RFcnJvcihlcnJvcnMpIHtcblxuICAgIHRoaXMubWVzc2FnZSA9ICdsaXN0LWVycm9yJztcbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpKS5zdGFjaztcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG5cbiAgICBpZiAoRXJyb3IuaGFzT3duUHJvcGVydHkoJ2NhcHR1cmVTdGFja1RyYWNlJykpXG4gICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG59XG5cbkxpc3RFcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5MaXN0RXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlzdEVycm9yO1xuXG5jb25zdCBleHBlY3RlZCA9ICh3aGF0LCB2KSA9PlxuICAgIGBFeHBlY3RlZCAke3doYXR9IGJ1dCBnb3QgKCR7dHlwZW9mIHZ9KSBgICtcbiAgICBgJHt2PyB2LmNvbnN0cnVjdG9yPyB2LmNvbnN0cnVjdG9yLm5hbWU6djp2fWA7XG5cbi8qKlxuICogaG9wZSBhIHZhbHVlIHBhc3NlcyBpdHMgdGVzdCwgdGhyb3dzIGFuIGVycm9yIGlmIG5vdCByZXR1cm5zIHRoZSB2YWx1ZSBvdGhlcndpc2UuXG4gKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gdGVzdFxuICogQHN1bW1hcnkgeyhzdHJpbmcsICogLCAqIOKGkiBFaXRoZXI8RXJyb3IsKj4pIOKGkiAgRWl0aGVyPEVycm9yLCo+fVxuICovXG5leHBvcnQgY29uc3QgaG9wZSA9IChrLCB2LCB0ZXN0KSA9PiB0ZXN0KHYpLmNhdGEoZSA9PiB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBFcnJvciBvY2N1cmVkIHdoaWxlIHByb2Nlc3Npbmcga2V5ICcke2t9JzogXFxuICR7ZS5zdGFja31gKTtcbn0sIHggPT4geCk7XG5cbi8qKlxuICogbm90aGluZyBhbGxvd3MgdGhlIHZhbHVlIHRvIGJlIG51bGwgb3IgdW5kZWZpbmVkLlxuICogQHJldHVybiB7ZnVuY3Rpb259XG4gKiBAc3VtbWFyeSB7KiDihpIgIEVpdGhlcjxFcnJvciwgKj59XG4gKi9cbmV4cG9ydCBjb25zdCBub3RoaW5nID0gdiA9PiAodiA9PSBudWxsKSA/IHJpZ2h0KHYpIDogcmlnaHQodik7XG5cbi8qKlxuICogYW55IG1lYW5zIGFueXRoaW5nIGdvZXNcbiAqIEBwYXJhbSB7Kn0gdlxuICogQHJldHVybnMge0VpdGhlcn1cbiAqIEBzdW1tYXJ5IHsqIOKGkiBFaXRoZXI8RXJyb3IsICo+fVxuICovXG5leHBvcnQgY29uc3QgYW55ID0gdiA9PiByaWdodCh2KTtcblxuLyoqXG4gKiB0eXBlIHJlcXVpcmVzIHRoZSBmdW5jdG9yIHZhbHVlIHRvIGJlIGFuIGluc3RhbmNlIG9mIHRoZSBzcGVjaWZpZWQgdXNlciB0eXBlLlxuICogQHBhcmFtIHsqfSBUXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHtjbGFzcyDihpIgICog4oaSICBFaXRoZXI8RXJyb3IsICo+fVxuICovXG5leHBvcnQgY29uc3QgdHlwZSA9IEMgPT4gdiA9PlxuICAgIChDID09PSBTdHJpbmcpID9cbiAgICAodHlwZW9mIHYgPT09ICdzdHJpbmcnKSA/XG4gICAgcmlnaHQodikgOiBsZWZ0KG5ldyBUeXBlRXJyb3IoZXhwZWN0ZWQoJ3N0cmluZycsIHYpKSkgOlxuXG4gICAgKEMgPT09IEJvb2xlYW4pID9cbiAgICAodHlwZW9mIHYgPT09ICdib29sZWFuJykgP1xuICAgIHJpZ2h0KHYpIDogbGVmdChuZXcgVHlwZUVycm9yKGV4cGVjdGVkKCdib29sZWFuJywgdikpKSA6XG5cbiAgICAoQyA9PT0gTnVtYmVyKSA/XG4gICAgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykgP1xuICAgIHJpZ2h0KHYpIDogbGVmdChuZXcgVHlwZUVycm9yKGV4cGVjdGVkKCdudW1iZXInLCB2KSkpIDpcblxuICAgICEodiBpbnN0YW5jZW9mIEMpID9cbiAgICBsZWZ0KG5ldyBUeXBlRXJyb3IoZXhwZWN0ZWQoYGluc3RhbmNlIG9mICcke0MubmFtZX0nYCwgdikpKSA6IHJpZ2h0KHYpO1xuXG4vKipcbiAqIGtpbmRcbiAqL1xuZXhwb3J0IGNvbnN0IGtpbmQgPSBJZmFjZSA9PiB2ID0+IHtcblxuICAgIGlmICh0eXBlb2YgSWZhY2UgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGtpbmQoKTogQ2Fubm90IHVzZSBub24tY2xhc3MgYCArXG4gICAgICAgICAgICBgKCR7dHlwZW9mIElmYWNlfSkgJHtJZmFjZX0gYXMgYW4gaW50ZXJmYWNlIWApO1xuXG4gICAgbGV0IG8gPSBuZXcgSWZhY2UoKTtcbiAgICBsZXQgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yobyk7XG5cbiAgICByZXR1cm4gdHlwZShPYmplY3QpKHYpLmNhdGEoeCA9PiB4LCB2ID0+IHtcblxuICAgICAgICBsZXQgbWlzc2luZyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5cbiAgICAgICAgZmlsdGVyKGsgPT4gKGsgPT09ICdjb25zdHJ1Y3RvcicpID8gZmFsc2UgOlxuICAgICAgICAgICAgKHR5cGVvZiB2W2tdID09PSB0eXBlb2YgcHJvdG9ba10pID9cbiAgICAgICAgICAgIGZhbHNlIDpcbiAgICAgICAgICAgIHRydWUpO1xuXG4gICAgICAgIHJldHVybiAobWlzc2luZy5sZW5ndGggIT09IDApID9cbiAgICAgICAgICAgIGxlZnQoZXhwZWN0ZWQoYGtpbmQgb2YgJHtJZmFjZS5uYW1lfSAobWlzc2luZyBtZXRob2RzICR7bWlzc2luZy5qb2luKCcsJyl9KWAsIHYpKSA6XG4gICAgICAgICAgICByaWdodCh2KTtcblxuICAgIH0pO1xuXG59XG5cbi8qKlxuICogZXZlcnkgY2hlY2tzIHRoYXQgdGhlIHN1cHBsaWVkIGFycmF5IGNvbnRhaW5zIGFjY2VwdGFibGUgdmFsdWVzLlxuICogSXQgY29tYmluZXMgYW4gYXJyYXkgdHlwZSBjaGVjayB0byBhY2NvbXBsaXNoIHRoaXMuXG4gKiBAcGFyYW0geyp9IGNoZWNrXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsgKCog4oaSICBFaXRoZXI8RXJyb3IsKj4pIOKGkiAgKiDihpIgIEVpdGhlcjxFcnJvciwgKj4gfVxuICovXG5leHBvcnQgY29uc3QgZXZlcnkgPSBjaGVjayA9PiB2ID0+XG4gICAgdHlwZShBcnJheSkodilcbiAgICAubWFwKHYgPT4gdi5yZWR1Y2UoKHsgZXJycywgdmFscyB9LCBtZW1iZXIsIGluZGV4KSA9PlxuICAgICAgICBjaGVjayhtZW1iZXIpXG4gICAgICAgIC5jYXRhKGUgPT5cbiAgICAgICAgICAgICh7XG4gICAgICAgICAgICAgICAgZXJyczogbWVyZ2UoZXJycywge1xuICAgICAgICAgICAgICAgICAgICBbaW5kZXhdOiBlXG4gICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgdmFsc1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICB2ID0+XG4gICAgICAgICAgICAoeyBlcnJzLCB2YWxzOiB2YWxzLmNvbmNhdCh2KSB9KSksIHsgZXJyczogYmFza2V0KCksIHZhbHM6IFtdIH0pKVxuICAgIC5jaGFpbigoeyBlcnJzLCB2YWxzIH0pID0+XG4gICAgICAgIChPYmplY3Qua2V5cyhlcnJzKS5sZW5ndGggPiAwKSA/XG4gICAgICAgIGxlZnQobmV3IExpc3RFcnJvcihlcnJzKSkgOlxuICAgICAgICByaWdodCh2YWxzKSk7XG5cbi8qKlxuICogc2VxIGNhbGxzIHRoZSBmdW5jdGlvbnMgc3VwcGxpZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0IHBhc3NpbmcgdGhlIHJlc3VsdCBvZlxuICogdGhlIHByZXZpb3VzIGludG8gdGhlIG5leHRcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IC4uLmZcbiAqIEByZXR1cm4ge2Z1bmN0aW9ufVxuICogQHN1bW1hcnkgey4uLigqIOKGkiAgRWl0aGVyPEVycm9yLCo+KSDihpIgICog4oaSICBFaXRoZXI8RXJyb3IsICo+IH1cbiAqL1xuZXhwb3J0IGNvbnN0IHNlcSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IG4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGxldCBhID0gW107XG5cbiAgICB3aGlsZSAoLS1uKVxuICAgICAgICBhW25dID0gYXJndW1lbnRzW25dO1xuXG4gICAgcmV0dXJuIHggPT4gYS5yZWR1Y2UoKHAsIGMpID0+IHAuY2hhaW4oYyksIHJpZ2h0KHgpKTtcblxufVxuXG4vKipcbiAqIGRlZmF1bHRzIHNldHMgdGhlIHZhbHVlIGlmIG5vdCBzcGVjaWZpZWRcbiAqIEBwYXJhbSB7Kn0gZHZcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsgKiDihpIgICog4oaSICBFaXRoZXI8RXJyb3IsKj59XG4gKi9cbmV4cG9ydCBjb25zdCBkZWZhdWx0cyA9IGR2ID0+IHYgPT4gKHYgPT0gbnVsbCkgPyByaWdodChkdikgOiByaWdodCh2KTtcblxuLyoqXG4gKiBmb3JjZSB0aGUgdmFsdWUgdG8gYmUgeFxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsqIOKGkiAqIOKGkiBFaXRoZXI8RXJyb3IsICo+fVxuICovXG5leHBvcnQgY29uc3QgZm9yY2UgPSB4ID0+ICgpID0+IHJpZ2h0KHgpO1xuXG4vKipcbiAqIGNhbGxcbiAqL1xuZXhwb3J0IGNvbnN0IGNhbGwgPSBmID0+IHggPT4gcmlnaHQoZih4KSk7XG5cbi8qKlxuICogb3IgaXMgYSBsb2dpY2FsIG9yIGJldHdlZW4gdHdvIEVpdGhlciB5aWVsZGluZyBmdW5jdGlvbnNcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGxcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHJcbiAqIEByZXR1cm5zIHtmdW5jdGlvbn1cbiAqIEBzdW1tYXJ5IHsgKCrihpIgRWl0aGVyPEVycm9yLCAqPiwgKiDihpIgRWl0aGVyPEVycm9yLCAqPikg4oaSICAqIOKGkiAgRWl0aGVyPEVycm9yLCAqPiB9XG4gKi9cbmV4cG9ydCBjb25zdCBvciA9IChsLCByKSA9PiB7XG5cbiAgICBpZiAodHlwZW9mIGwgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYG9yKCk6ICR7ZXhwZWN0ZWQoJ2EgZnVuY3Rpb24gZm9yIGxlZnQgdmFsdWUnKX1gLCBsKTtcblxuICAgIGlmICh0eXBlb2YgciAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgb3IoKTogJHtleHBlY3RlZCgnYSBmdW5jdGlvbiBmb3IgcmlnaHQgdmFsdWUnKX1gLCBsKTtcblxuICAgIHJldHVybiB2ID0+IGwodikub3JFbHNlKCgpID0+IHIodikpO1xuXG59XG5cbi8qKlxuICogYm9vbCBjb252ZXJ0cyBhbiBFaXRoZXIgaW50byBhIGJvb2xlYW4gdmFsdWVcbiAqIGxlZnQgPSBmYWxzZSwgcmlnaHQgPSB0cnVlXG4gKiBAc3VtbWFyeSB7KCAqIOKGkiAgRWl0aGVyPEVycm9yLCAqPikg4oaSICAqIOKGkiAgYm9vbGVhblxuICovXG5leHBvcnQgY29uc3QgYm9vbCA9IHRlc3QgPT4gdiA9PiAodGVzdCh2KSBpbnN0YW5jZW9mIFJpZ2h0KSA/IHRydWUgOiBmYWxzZTtcbiJdfQ==
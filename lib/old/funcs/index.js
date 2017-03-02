'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Equals = exports.Required = exports.Is = exports.Type = exports.Or = exports.InstanceOf = exports.OK = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.insof = insof;
exports.or = or;
exports.type = type;
exports.is = is;
exports.required = required;
exports.ok = ok;
exports.eql = eql;
exports.and = and;
exports.any = any;

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Callable = require('../Callable');

var _Callable2 = _interopRequireDefault(_Callable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OK = exports.OK = true;

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

var InstanceOf = exports.InstanceOf = function () {
    function InstanceOf(predicate, f) {
        _classCallCheck(this, InstanceOf);

        (0, _beof2.default)({ predicate: predicate }).interface(_Callable2.default);
        (0, _beof2.default)({ f: f }).interface(_Callable2.default);

        this._predicate = predicate;
        this._f = f;
    }

    _createClass(InstanceOf, [{
        key: 'call',
        value: function call(context, value) {

            return value instanceof this._predicate ? this._f.call(context, value) : null;
        }
    }]);

    return InstanceOf;
}();

/**
 * insof checks if the value supplied is an instance of the predicate.
 * @param {function} predicate
 * @param {function} f
 * @returns {Callable}
 */


function insof(predicate, f) {

    var c = new InstanceOf(predicate, f);
    return function (v) {
        return c.call(this, v);
    };
}

/**
 * Or preforms a logical 'or' between two Callables.
 * @param {Callable} left
 * @param {Callable} right
 * @implements {Callable}
 */

var Or = exports.Or = function () {
    function Or(left, right) {
        _classCallCheck(this, Or);

        (0, _beof2.default)({ left: left }).interface(_Callable2.default);
        (0, _beof2.default)({ right: right }).interface(_Callable2.default);

        this._left = left;
        this._right = right;
    }

    _createClass(Or, [{
        key: 'call',
        value: function call(context, value) {

            var ret = this._left.call(context, value);

            return ret != null ? ret : this._right.call(context, value);
        }
    }]);

    return Or;
}();

/**
 * or preforms a logical 'or' between two Callables
 * @param {Callable} right
 * @param {Callable} right
 */


function or(left, right) {

    var c = new Or(left, right);
    return function or_call(v) {
        return c.call(this, v);
    };
}

/**
 * Type preforms a type check before executing it's function.
 * @param {string} type
 * @param {Callable} f
 */

var Type = exports.Type = function () {
    function Type(type, f) {
        _classCallCheck(this, Type);

        if (typeof type !== 'function') (0, _beof2.default)({ type: type }).string();

        (0, _beof2.default)({ f: f }).interface(_Callable2.default);

        this._type = type;
        this._f = f;
    }

    _createClass(Type, [{
        key: 'call',
        value: function call(context, value) {

            return this._type instanceof Function ? value instanceof this._type ? this._f(value) : null : (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === this._type ? this._f(value) : null;
        }
    }]);

    return Type;
}();

/**
 * Type preforms a type check before executing it's function.
 * @param {string} type
 * @param {Callable} f
 */


function type(type, f) {

    var c = new Type(type, f);
    return function type_call(v) {
        return c.call(this, v);
    };
}

/**
 * Is preforms a stricy equality comparison between it's predicate
 * and input before executing it's function.
 * @param {*} value
 * @param {function} f
 */

var Is = exports.Is = function () {
    function Is(value, f) {
        _classCallCheck(this, Is);

        (0, _beof2.default)({ value: value }).string();
        (0, _beof2.default)({ f: f }).interface(_Callable2.default);

        this._value = value;
        this._f = f;
    }

    _createClass(Is, [{
        key: 'call',
        value: function call(context, value) {

            return value === this._value ? this._f(value) : null;
        }
    }]);

    return Is;
}();

/**
 * is preforms a stricy equality comparison between it's predicate
 * and input before executing it's function.
 * @param {*} value
 * @param {function} f
 */


function is(value, f) {

    var c = new Is(value, f);
    return function is_call(v) {
        return c.call(this, v);
    };
}

/**
 * Required executes its function when an object has the required keys.
 * @param {object} keys
 * @param {Callable} f
 */

var Required = exports.Required = function () {
    function Required(keys, f) {
        _classCallCheck(this, Required);

        (0, _beof2.default)({ keys: keys }).object();
        (0, _beof2.default)({ f: f }).interface(_Callable2.default);

        this._keys = keys;
        this._f = f;
    }

    _createClass(Required, [{
        key: 'call',
        value: function call(context, value) {

            var keys = this._keys;

            if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return null;

            value = Object.keys(keys).reduce(function (prev, key) {

                if (prev == null) return prev;

                if (keys[key]) {

                    if (prev.hasOwnProperty(key)) return prev;
                } else {

                    if (!value.hasOwnProperty(key)) return prev;
                }

                return null;
            }, value);

            return value == null ? value : this._f(value);
        }
    }]);

    return Required;
}();

/**
 * required requires the value to posses a set of keys.
 * @param {object} keys
 * @param {Callable} f
 * @returns {Callable}
 */


function required(value, f) {

    var c = new Required(value, f);
    return function required_call(v) {
        return c.call(this, v);
    };
}

/**
 * ok accepts a boolean value to decide whether or not to excute its
 * Callable.
 * @param {boolean} check
 * @param {Callable} f
 * @return {Callbale}
 */
function ok(check, f) {

    return function ok_call(v) {
        return check ? f(v) : null;
    };
}

/**
 * Equals executes its function if the value is strictly equal to its check.
 * @param {*} check
 * @param {Callable} f
 * @implements {Callable}
 */

var Equals = exports.Equals = function () {
    function Equals(check, f) {
        _classCallCheck(this, Equals);

        (0, _beof2.default)({ f: f }).interface(_Callable2.default);

        this._check = check;
        this._f = f;
    }

    _createClass(Equals, [{
        key: 'call',
        value: function call(context, value) {

            return value === this._check ? this._f(value) : null;
        }
    }]);

    return Equals;
}();

/**
 * eql
 * @param {*} check
 * @param {Callable} f
 */


function eql(check, f) {

    var c = new Equals(check, f);
    return function eql_call(v) {
        return c.call(this, v);
    };
}

/**
 * and
 * @param {Callable} left
 * @param {Callable} right
 */
function and(left, right) {

    return function and_call(v) {
        return left(v) == null ? v : right(v);
    };
}

/**
 * any is like or excepts it accepts > 2 arguments
 * @param {Callables} ...c
 */
function any() {
    var _this = this;

    var i = arguments.length;
    var args = [];

    while (i--) {
        args[i] = arguments[i];
    }var any_call = function any_call(value) {
        return args.reduce(function (pre, curr) {
            return pre != null ? pre : curr.call(_this, value);
        }, null);
    };

    return any_call;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZnVuY3MvaW5kZXguanMiXSwibmFtZXMiOlsiaW5zb2YiLCJvciIsInR5cGUiLCJpcyIsInJlcXVpcmVkIiwib2siLCJlcWwiLCJhbmQiLCJhbnkiLCJPSyIsIkluc3RhbmNlT2YiLCJwcmVkaWNhdGUiLCJmIiwiaW50ZXJmYWNlIiwiX3ByZWRpY2F0ZSIsIl9mIiwiY29udGV4dCIsInZhbHVlIiwiY2FsbCIsImMiLCJ2IiwiT3IiLCJsZWZ0IiwicmlnaHQiLCJfbGVmdCIsIl9yaWdodCIsInJldCIsIm9yX2NhbGwiLCJUeXBlIiwic3RyaW5nIiwiX3R5cGUiLCJGdW5jdGlvbiIsInR5cGVfY2FsbCIsIklzIiwiX3ZhbHVlIiwiaXNfY2FsbCIsIlJlcXVpcmVkIiwia2V5cyIsIm9iamVjdCIsIl9rZXlzIiwiT2JqZWN0IiwicmVkdWNlIiwicHJldiIsImtleSIsImhhc093blByb3BlcnR5IiwicmVxdWlyZWRfY2FsbCIsImNoZWNrIiwib2tfY2FsbCIsIkVxdWFscyIsIl9jaGVjayIsImVxbF9jYWxsIiwiYW5kX2NhbGwiLCJpIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiYXJncyIsImFueV9jYWxsIiwicHJlIiwiY3VyciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUEwQ2dCQSxLLEdBQUFBLEs7UUF5Q0FDLEUsR0FBQUEsRTtRQXlDQUMsSSxHQUFBQSxJO1FBd0NBQyxFLEdBQUFBLEU7UUE2REFDLFEsR0FBQUEsUTtRQWNBQyxFLEdBQUFBLEU7UUFzQ0FDLEcsR0FBQUEsRztRQVlBQyxHLEdBQUFBLEc7UUFVQUMsRyxHQUFBQSxHOztBQTNTaEI7Ozs7QUFDQTs7Ozs7Ozs7QUFFTyxJQUFNQyxrQkFBSyxJQUFYOztBQUVQOzs7OztBQUtBOzs7Ozs7O0lBTWFDLFUsV0FBQUEsVTtBQUVULHdCQUFZQyxTQUFaLEVBQXVCQyxDQUF2QixFQUEwQjtBQUFBOztBQUV0Qiw0QkFBSyxFQUFFRCxvQkFBRixFQUFMLEVBQW9CRSxTQUFw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QUQxQixDQUFUO0FBQUEsS0FBZjs7QUFHQSxXQUFPdUMsUUFBUDtBQUVIIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuXG5leHBvcnQgY29uc3QgT0sgPSB0cnVlO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgQ2FsbGFibGVzIHRoYXQgbWFrZVxuICogZmlsdGVyaW5nIG1lc3NhZ2VzIGxlc3Mgb25lcm91cy5cbiAqL1xuXG4vKipcbiAqIEluc3RhbmNlT2YgcHJlZm9ybXMgYW4gaW5zdGFuY2VvZiBjaGVjayBvbiB0aGUgaW5wdXQgYmVmb3JlIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VPZiB7XG5cbiAgICBjb25zdHJ1Y3RvcihwcmVkaWNhdGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgcHJlZGljYXRlIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5fcHJlZGljYXRlKSA/IHRoaXMuX2YuY2FsbChjb250ZXh0LCB2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaW5zb2YgY2hlY2tzIGlmIHRoZSB2YWx1ZSBzdXBwbGllZCBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgcHJlZGljYXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNvZihwcmVkaWNhdGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IEluc3RhbmNlT2YocHJlZGljYXRlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXMuXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBsZWZ0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgT3Ige1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgcmlnaHQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5fcmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICBsZXQgcmV0ID0gdGhpcy5fbGVmdC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKHJldCAhPSBudWxsKSA/IHJldCA6XG4gICAgICAgICAgICB0aGlzLl9yaWdodC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIG9yIHByZWZvcm1zIGEgbG9naWNhbCAnb3InIGJldHdlZW4gdHdvIENhbGxhYmxlc1xuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcihsZWZ0LCByaWdodCkge1xuXG4gICAgdmFyIGMgPSBuZXcgT3IobGVmdCwgcmlnaHQpO1xuICAgIHJldHVybiBmdW5jdGlvbiBvcl9jYWxsKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogVHlwZSBwcmVmb3JtcyBhIHR5cGUgY2hlY2sgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IodHlwZSwgZikge1xuXG4gICAgICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgICAgIGJlb2YoeyB0eXBlIH0pLnN0cmluZygpO1xuXG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodGhpcy5fdHlwZSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSA/XG4gICAgICAgICAgICAodmFsdWUgaW5zdGFuY2VvZiB0aGlzLl90eXBlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbCA6XG4gICAgICAgICAgICAodHlwZW9mIHZhbHVlID09PSB0aGlzLl90eXBlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFR5cGUgcHJlZm9ybXMgYSB0eXBlIGNoZWNrIGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlKHR5cGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IFR5cGUodHlwZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHR5cGVfY2FsbCh2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG5cbi8qKlxuICogSXMgcHJlZm9ybXMgYSBzdHJpY3kgZXF1YWxpdHkgY29tcGFyaXNvbiBiZXR3ZWVuIGl0J3MgcHJlZGljYXRlXG4gKiBhbmQgaW5wdXQgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICovXG5leHBvcnQgY2xhc3MgSXMge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgdmFsdWUgfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gdGhpcy5fdmFsdWUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaXMgcHJlZm9ybXMgYSBzdHJpY3kgZXF1YWxpdHkgY29tcGFyaXNvbiBiZXR3ZWVuIGl0J3MgcHJlZGljYXRlXG4gKiBhbmQgaW5wdXQgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXModmFsdWUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IElzKHZhbHVlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gaXNfY2FsbCh2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIFJlcXVpcmVkIGV4ZWN1dGVzIGl0cyBmdW5jdGlvbiB3aGVuIGFuIG9iamVjdCBoYXMgdGhlIHJlcXVpcmVkIGtleXMuXG4gKiBAcGFyYW0ge29iamVjdH0ga2V5c1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgY2xhc3MgUmVxdWlyZWQge1xuXG4gICAgY29uc3RydWN0b3Ioa2V5cywgZikge1xuXG4gICAgICAgIGJlb2YoeyBrZXlzIH0pLm9iamVjdCgpO1xuICAgICAgICBiZW9mKHsgZiB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHJldHVybiBudWxsO1xuXG4gICAgICAgIHZhbHVlID0gT2JqZWN0LmtleXMoa2V5cykucmVkdWNlKChwcmV2LCBrZXkpID0+IHtcblxuICAgICAgICAgICAgaWYgKHByZXYgPT0gbnVsbCkgcmV0dXJuIHByZXY7XG5cbiAgICAgICAgICAgIGlmIChrZXlzW2tleV0pIHtcblxuICAgICAgICAgICAgICAgIGlmIChwcmV2Lmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgfSwgdmFsdWUpO1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT0gbnVsbCkgPyB2YWx1ZSA6IHRoaXMuX2YodmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogcmVxdWlyZWQgcmVxdWlyZXMgdGhlIHZhbHVlIHRvIHBvc3NlcyBhIHNldCBvZiBrZXlzLlxuICogQHBhcmFtIHtvYmplY3R9IGtleXNcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEByZXR1cm5zIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVkKHZhbHVlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBSZXF1aXJlZCh2YWx1ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIHJlcXVpcmVkX2NhbGwodikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBvayBhY2NlcHRzIGEgYm9vbGVhbiB2YWx1ZSB0byBkZWNpZGUgd2hldGhlciBvciBub3QgdG8gZXhjdXRlIGl0c1xuICogQ2FsbGFibGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAcmV0dXJuIHtDYWxsYmFsZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9rKGNoZWNrLCBmKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gb2tfY2FsbCh2KSB7IHJldHVybiBjaGVjayA/IGYodikgOiBudWxsIH07XG5cbn1cblxuXG5cbi8qKlxuICogRXF1YWxzIGV4ZWN1dGVzIGl0cyBmdW5jdGlvbiBpZiB0aGUgdmFsdWUgaXMgc3RyaWN0bHkgZXF1YWwgdG8gaXRzIGNoZWNrLlxuICogQHBhcmFtIHsqfSBjaGVja1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgRXF1YWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKGNoZWNrLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9jaGVjayA9IGNoZWNrO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlID09PSB0aGlzLl9jaGVjaykgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBlcWxcbiAqIEBwYXJhbSB7Kn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxbChjaGVjaywgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgRXF1YWxzKGNoZWNrLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gZXFsX2NhbGwodikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBhbmRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGxlZnRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmQobGVmdCwgcmlnaHQpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbiBhbmRfY2FsbCh2KSB7IHJldHVybiAobGVmdCh2KSA9PSBudWxsKSA/IHYgOiByaWdodCh2KSB9O1xuXG59XG5cbi8qKlxuICogYW55IGlzIGxpa2Ugb3IgZXhjZXB0cyBpdCBhY2NlcHRzID4gMiBhcmd1bWVudHNcbiAqIEBwYXJhbSB7Q2FsbGFibGVzfSAuLi5jXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbnkoKSB7XG5cbiAgICBsZXQgaSA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgbGV0IGFyZ3MgPSBbXTtcblxuICAgIHdoaWxlIChpLS0pXG4gICAgICAgIGFyZ3NbaV0gPSBhcmd1bWVudHNbaV07XG5cbiAgICBsZXQgYW55X2NhbGwgPSB2YWx1ZSA9PiBhcmdzLnJlZHVjZSgocHJlLCBjdXJyKSA9PlxuICAgICAgICAocHJlICE9IG51bGwpID8gcHJlIDogY3Vyci5jYWxsKHRoaXMsIHZhbHVlKSwgbnVsbCk7XG5cbiAgICByZXR1cm4gYW55X2NhbGw7XG5cbn1cbiJdfQ==
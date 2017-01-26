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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwicmVxdWlyZWQiLCJvayIsImVxbCIsImFuZCIsImFueSIsIk9LIiwiSW5zdGFuY2VPZiIsInByZWRpY2F0ZSIsImYiLCJpbnRlcmZhY2UiLCJfcHJlZGljYXRlIiwiX2YiLCJjb250ZXh0IiwidmFsdWUiLCJjYWxsIiwiYyIsInYiLCJPciIsImxlZnQiLCJyaWdodCIsIl9sZWZ0IiwiX3JpZ2h0IiwicmV0Iiwib3JfY2FsbCIsIlR5cGUiLCJzdHJpbmciLCJfdHlwZSIsIkZ1bmN0aW9uIiwidHlwZV9jYWxsIiwiSXMiLCJfdmFsdWUiLCJpc19jYWxsIiwiUmVxdWlyZWQiLCJrZXlzIiwib2JqZWN0IiwiX2tleXMiLCJPYmplY3QiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJyZXF1aXJlZF9jYWxsIiwiY2hlY2siLCJva19jYWxsIiwiRXF1YWxzIiwiX2NoZWNrIiwiZXFsX2NhbGwiLCJhbmRfY2FsbCIsImkiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcmdzIiwiYW55X2NhbGwiLCJwcmUiLCJjdXJyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztRQTBDZ0JBLEssR0FBQUEsSztRQXlDQUMsRSxHQUFBQSxFO1FBeUNBQyxJLEdBQUFBLEk7UUF3Q0FDLEUsR0FBQUEsRTtRQTZEQUMsUSxHQUFBQSxRO1FBY0FDLEUsR0FBQUEsRTtRQXNDQUMsRyxHQUFBQSxHO1FBWUFDLEcsR0FBQUEsRztRQVVBQyxHLEdBQUFBLEc7O0FBM1NoQjs7OztBQUNBOzs7Ozs7OztBQUVPLElBQU1DLGtCQUFLLElBQVg7O0FBRVA7Ozs7O0FBS0E7Ozs7Ozs7SUFNYUMsVSxXQUFBQSxVO0FBRVQsd0JBQVlDLFNBQVosRUFBdUJDLENBQXZCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELG9CQUFGLEVBQUwsRUFBb0JFLFNBQXBCO0FBQ0Es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QVQ7QUFBQSxLQUFmOztBQUdBLFdBQU91QyxRQUFQO0FBRUgiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBDYWxsYWJsZSBmcm9tICcuLi9DYWxsYWJsZSc7XG5cbmV4cG9ydCBjb25zdCBPSyA9IHRydWU7XG5cbi8qKlxuICogVGhpcyBtb2R1bGUgcHJvdmlkZXMgc29tZSBDYWxsYWJsZXMgdGhhdCBtYWtlXG4gKiBmaWx0ZXJpbmcgbWVzc2FnZXMgbGVzcyBvbmVyb3VzLlxuICovXG5cbi8qKlxuICogSW5zdGFuY2VPZiBwcmVmb3JtcyBhbiBpbnN0YW5jZW9mIGNoZWNrIG9uIHRoZSBpbnB1dCBiZWZvcmUgZXhlY3V0aW9uLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKiBAaW1wbGVtZW50cyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBjbGFzcyBJbnN0YW5jZU9mIHtcblxuICAgIGNvbnN0cnVjdG9yKHByZWRpY2F0ZSwgZikge1xuXG4gICAgICAgIGJlb2YoeyBwcmVkaWNhdGUgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9wcmVkaWNhdGUgPSBwcmVkaWNhdGU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiB0aGlzLl9wcmVkaWNhdGUpID8gdGhpcy5fZi5jYWxsKGNvbnRleHQsIHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBpbnNvZiBjaGVja3MgaWYgdGhlIHZhbHVlIHN1cHBsaWVkIGlzIGFuIGluc3RhbmNlIG9mIHRoZSBwcmVkaWNhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcmVkaWNhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqIEByZXR1cm5zIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc29mKHByZWRpY2F0ZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgSW5zdGFuY2VPZihwcmVkaWNhdGUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIE9yIHByZWZvcm1zIGEgbG9naWNhbCAnb3InIGJldHdlZW4gdHdvIENhbGxhYmxlcy5cbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGxlZnRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKiBAaW1wbGVtZW50cyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBjbGFzcyBPciB7XG5cbiAgICBjb25zdHJ1Y3RvcihsZWZ0LCByaWdodCkge1xuXG4gICAgICAgIGJlb2YoeyBsZWZ0IH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyByaWdodCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHRoaXMuX2xlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLl9yaWdodCA9IHJpZ2h0O1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIGxldCByZXQgPSB0aGlzLl9sZWZ0LmNhbGwoY29udGV4dCwgdmFsdWUpO1xuXG4gICAgICAgIHJldHVybiAocmV0ICE9IG51bGwpID8gcmV0IDpcbiAgICAgICAgICAgIHRoaXMuX3JpZ2h0LmNhbGwoY29udGV4dCwgdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogb3IgcHJlZm9ybXMgYSBsb2dpY2FsICdvcicgYmV0d2VlbiB0d28gQ2FsbGFibGVzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9yKGxlZnQsIHJpZ2h0KSB7XG5cbiAgICB2YXIgYyA9IG5ldyBPcihsZWZ0LCByaWdodCk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIG9yX2NhbGwodikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBUeXBlIHByZWZvcm1zIGEgdHlwZSBjaGVjayBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBmKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgYmVvZih7IHR5cGUgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLl90eXBlIGluc3RhbmNlb2YgRnVuY3Rpb24pID9cbiAgICAgICAgICAgICh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsIDpcbiAgICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09IHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVHlwZSBwcmVmb3JtcyBhIHR5cGUgY2hlY2sgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGUodHlwZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgVHlwZSh0eXBlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gdHlwZV9jYWxsKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cblxuLyoqXG4gKiBJcyBwcmVmb3JtcyBhIHN0cmljeSBlcXVhbGl0eSBjb21wYXJpc29uIGJldHdlZW4gaXQncyBwcmVkaWNhdGVcbiAqIGFuZCBpbnB1dCBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBJcyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgZikge1xuXG4gICAgICAgIGJlb2YoeyB2YWx1ZSB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlID09PSB0aGlzLl92YWx1ZSkgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBpcyBwcmVmb3JtcyBhIHN0cmljeSBlcXVhbGl0eSBjb21wYXJpc29uIGJldHdlZW4gaXQncyBwcmVkaWNhdGVcbiAqIGFuZCBpbnB1dCBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpcyh2YWx1ZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgSXModmFsdWUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbiBpc19jYWxsKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogUmVxdWlyZWQgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIHdoZW4gYW4gb2JqZWN0IGhhcyB0aGUgcmVxdWlyZWQga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1aXJlZCB7XG5cbiAgICBjb25zdHJ1Y3RvcihrZXlzLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGtleXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdmFsdWUgPSBPYmplY3Qua2V5cyhrZXlzKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAocHJldiA9PSBudWxsKSByZXR1cm4gcHJldjtcblxuICAgICAgICAgICAgaWYgKGtleXNba2V5XSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHByZXYuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICB9LCB2YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PSBudWxsKSA/IHZhbHVlIDogdGhpcy5fZih2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiByZXF1aXJlZCByZXF1aXJlcyB0aGUgdmFsdWUgdG8gcG9zc2VzIGEgc2V0IG9mIGtleXMuXG4gKiBAcGFyYW0ge29iamVjdH0ga2V5c1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICogQHJldHVybnMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZWQodmFsdWUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IFJlcXVpcmVkKHZhbHVlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gcmVxdWlyZWRfY2FsbCh2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIG9rIGFjY2VwdHMgYSBib29sZWFuIHZhbHVlIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byBleGN1dGUgaXRzXG4gKiBDYWxsYWJsZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEByZXR1cm4ge0NhbGxiYWxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2soY2hlY2ssIGYpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbiBva19jYWxsKHYpIHsgcmV0dXJuIGNoZWNrID8gZih2KSA6IG51bGwgfTtcblxufVxuXG5cblxuLyoqXG4gKiBFcXVhbHMgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIGlmIHRoZSB2YWx1ZSBpcyBzdHJpY3RseSBlcXVhbCB0byBpdHMgY2hlY2suXG4gKiBAcGFyYW0geyp9IGNoZWNrXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAaW1wbGVtZW50cyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBjbGFzcyBFcXVhbHMge1xuXG4gICAgY29uc3RydWN0b3IoY2hlY2ssIGYpIHtcblxuICAgICAgICBiZW9mKHsgZiB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHRoaXMuX2NoZWNrID0gY2hlY2s7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX2NoZWNrKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGVxbFxuICogQHBhcmFtIHsqfSBjaGVja1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXFsKGNoZWNrLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBFcXVhbHMoY2hlY2ssIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbiBlcWxfY2FsbCh2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIGFuZFxuICogQHBhcmFtIHtDYWxsYWJsZX0gbGVmdFxuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFuZChsZWZ0LCByaWdodCkge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGFuZF9jYWxsKHYpIHsgcmV0dXJuIChsZWZ0KHYpID09IG51bGwpID8gdiA6IHJpZ2h0KHYpIH07XG5cbn1cblxuLyoqXG4gKiBhbnkgaXMgbGlrZSBvciBleGNlcHRzIGl0IGFjY2VwdHMgPiAyIGFyZ3VtZW50c1xuICogQHBhcmFtIHtDYWxsYWJsZXN9IC4uLmNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFueSgpIHtcblxuICAgIGxldCBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgd2hpbGUgKGktLSlcbiAgICAgICAgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcblxuICAgIGxldCBhbnlfY2FsbCA9IHZhbHVlID0+IGFyZ3MucmVkdWNlKChwcmUsIGN1cnIpID0+XG4gICAgICAgIChwcmUgIT0gbnVsbCkgPyBwcmUgOiBjdXJyLmNhbGwodGhpcywgdmFsdWUpLCBudWxsKTtcblxuICAgIHJldHVybiBhbnlfY2FsbDtcblxufVxuIl19
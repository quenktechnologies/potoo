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
 * Or preforms a logical 'or' between two Callables
 * @param {Callable} right
 * @param {Callable} right
 */


function or(left, right) {

    var c = new Or(left, right);
    return function (v) {
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
    return function (v) {
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
    return function (v) {
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
    return function (v) {
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

    return function (v) {
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
    return function (v) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwicmVxdWlyZWQiLCJvayIsImVxbCIsImFuZCIsIk9LIiwiSW5zdGFuY2VPZiIsInByZWRpY2F0ZSIsImYiLCJpbnRlcmZhY2UiLCJfcHJlZGljYXRlIiwiX2YiLCJjb250ZXh0IiwidmFsdWUiLCJjYWxsIiwiYyIsInYiLCJPciIsImxlZnQiLCJyaWdodCIsIl9sZWZ0IiwiX3JpZ2h0IiwicmV0IiwiVHlwZSIsInN0cmluZyIsIl90eXBlIiwiRnVuY3Rpb24iLCJJcyIsIl92YWx1ZSIsIlJlcXVpcmVkIiwia2V5cyIsIm9iamVjdCIsIl9rZXlzIiwiT2JqZWN0IiwicmVkdWNlIiwicHJldiIsImtleSIsImhhc093blByb3BlcnR5IiwiY2hlY2siLCJFcXVhbHMiLCJfY2hlY2siLCJhbmRfY2FsbCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUEwQ2dCQSxLLEdBQUFBLEs7UUF5Q0FDLEUsR0FBQUEsRTtRQXlDQUMsSSxHQUFBQSxJO1FBd0NBQyxFLEdBQUFBLEU7UUE2REFDLFEsR0FBQUEsUTtRQWNBQyxFLEdBQUFBLEU7UUFzQ0FDLEcsR0FBQUEsRztRQVlBQyxHLEdBQUFBLEc7O0FBalNoQjs7OztBQUNBOzs7Ozs7OztBQUVPLElBQU1DLGtCQUFLLElBQVg7O0FBRVA7Ozs7O0FBS0E7Ozs7Ozs7SUFNYUMsVSxXQUFBQSxVO0FBRVQsd0JBQVlDLFNBQVosRUFBdUJDLENBQXZCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELG9CQUFGLEVBQUwsRUFBb0JFLFNBQXBCO0FBQ0EsNEJBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlDLFNBQVo7O0FBRUEsYUFBS0MsVUFBTCxHQUFrQkgsU0FBbEI7QUFDQSxhQUFLSSxFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRQSxpQkFBaUIsS0FBS0gs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LFFBQUlPLElBQUksSUFBSXdCLE1BQUosQ0FBV0QsS0FBWCxFQUFrQjlCLENBQWxCLENBQVI7QUFDQSxXQUFPLFVBQVNRLENBQVQsRUFBWTtBQUFFLGVBQU9ELEVBQUVELElBQUYsQ0FBTyxJQUFQLEVBQWFFLENBQWIsQ0FBUDtBQUF5QixLQUE5QztBQUVIOztBQUVEOzs7OztBQUtPLFNBQVNaLEdBQVQsQ0FBYWMsSUFBYixFQUFtQkMsS0FBbkIsRUFBMEI7O0FBRTdCLFdBQU8sU0FBU3NCLFFBQVQsQ0FBa0J6QixDQUFsQixFQUFxQjtBQUFFLGVBQVFFLEtBQUtGLENBQUwsS0FBVyxJQUFaLEdBQW9CQSxDQUFwQixHQUF3QkcsTUFBTUgsQ0FBTixDQUEvQjtBQUF5QyxLQUF2RTtBQUVIIiwiZmlsZSI6ImluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQ2FsbGFibGUgZnJvbSAnLi4vQ2FsbGFibGUnO1xuXG5leHBvcnQgY29uc3QgT0sgPSB0cnVlO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgQ2FsbGFibGVzIHRoYXQgbWFrZVxuICogZmlsdGVyaW5nIG1lc3NhZ2VzIGxlc3Mgb25lcm91cy5cbiAqL1xuXG4vKipcbiAqIEluc3RhbmNlT2YgcHJlZm9ybXMgYW4gaW5zdGFuY2VvZiBjaGVjayBvbiB0aGUgaW5wdXQgYmVmb3JlIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VPZiB7XG5cbiAgICBjb25zdHJ1Y3RvcihwcmVkaWNhdGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgcHJlZGljYXRlIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5fcHJlZGljYXRlKSA/IHRoaXMuX2YuY2FsbChjb250ZXh0LCB2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaW5zb2YgY2hlY2tzIGlmIHRoZSB2YWx1ZSBzdXBwbGllZCBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgcHJlZGljYXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNvZihwcmVkaWNhdGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IEluc3RhbmNlT2YocHJlZGljYXRlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXMuXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBsZWZ0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgT3Ige1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuICAgICAgICBiZW9mKHsgcmlnaHQgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5fcmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICBsZXQgcmV0ID0gdGhpcy5fbGVmdC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKHJldCAhPSBudWxsKSA/IHJldCA6XG4gICAgICAgICAgICB0aGlzLl9yaWdodC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE9yIHByZWZvcm1zIGEgbG9naWNhbCAnb3InIGJldHdlZW4gdHdvIENhbGxhYmxlc1xuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcihsZWZ0LCByaWdodCkge1xuXG4gICAgdmFyIGMgPSBuZXcgT3IobGVmdCwgcmlnaHQpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIFR5cGUgcHJlZm9ybXMgYSB0eXBlIGNoZWNrIGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGYpIHtcblxuICAgICAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICBiZW9mKHsgdHlwZSB9KS5zdHJpbmcoKTtcblxuICAgICAgICBiZW9mKHsgZiB9KS5pbnRlcmZhY2UoQ2FsbGFibGUpO1xuXG4gICAgICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHRoaXMuX3R5cGUgaW5zdGFuY2VvZiBGdW5jdGlvbikgP1xuICAgICAgICAgICAgKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5fdHlwZSkgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGwgOlxuICAgICAgICAgICAgKHR5cGVvZiB2YWx1ZSA9PT0gdGhpcy5fdHlwZSkgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBUeXBlIHByZWZvcm1zIGEgdHlwZSBjaGVjayBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gdHlwZSh0eXBlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBUeXBlKHR5cGUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG5cbi8qKlxuICogSXMgcHJlZm9ybXMgYSBzdHJpY3kgZXF1YWxpdHkgY29tcGFyaXNvbiBiZXR3ZWVuIGl0J3MgcHJlZGljYXRlXG4gKiBhbmQgaW5wdXQgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICovXG5leHBvcnQgY2xhc3MgSXMge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgdmFsdWUgfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmludGVyZmFjZShDYWxsYWJsZSk7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gdGhpcy5fdmFsdWUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaXMgcHJlZm9ybXMgYSBzdHJpY3kgZXF1YWxpdHkgY29tcGFyaXNvbiBiZXR3ZWVuIGl0J3MgcHJlZGljYXRlXG4gKiBhbmQgaW5wdXQgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXModmFsdWUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IElzKHZhbHVlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBSZXF1aXJlZCBleGVjdXRlcyBpdHMgZnVuY3Rpb24gd2hlbiBhbiBvYmplY3QgaGFzIHRoZSByZXF1aXJlZCBrZXlzLlxuICogQHBhcmFtIHtvYmplY3R9IGtleXNcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGNsYXNzIFJlcXVpcmVkIHtcblxuICAgIGNvbnN0cnVjdG9yKGtleXMsIGYpIHtcblxuICAgICAgICBiZW9mKHsga2V5cyB9KS5vYmplY3QoKTtcbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9rZXlzID0ga2V5cztcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSByZXR1cm4gbnVsbDtcblxuICAgICAgICB2YWx1ZSA9IE9iamVjdC5rZXlzKGtleXMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG5cbiAgICAgICAgICAgIGlmIChwcmV2ID09IG51bGwpIHJldHVybiBwcmV2O1xuXG4gICAgICAgICAgICBpZiAoa2V5c1trZXldKSB7XG5cbiAgICAgICAgICAgICAgICBpZiAocHJldi5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcHJldjtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmICghdmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgICAgIH0sIHZhbHVlKTtcblxuICAgICAgICByZXR1cm4gKHZhbHVlID09IG51bGwpID8gdmFsdWUgOiB0aGlzLl9mKHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIHJlcXVpcmVkIHJlcXVpcmVzIHRoZSB2YWx1ZSB0byBwb3NzZXMgYSBzZXQgb2Yga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZCh2YWx1ZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgUmVxdWlyZWQodmFsdWUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIG9rIGFjY2VwdHMgYSBib29sZWFuIHZhbHVlIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byBleGN1dGUgaXRzXG4gKiBDYWxsYWJsZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEByZXR1cm4ge0NhbGxiYWxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2soY2hlY2ssIGYpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjaGVjayA/IGYodikgOiBudWxsIH07XG5cbn1cblxuXG5cbi8qKlxuICogRXF1YWxzIGV4ZWN1dGVzIGl0cyBmdW5jdGlvbiBpZiB0aGUgdmFsdWUgaXMgc3RyaWN0bHkgZXF1YWwgdG8gaXRzIGNoZWNrLlxuICogQHBhcmFtIHsqfSBjaGVja1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgRXF1YWxzIHtcblxuICAgIGNvbnN0cnVjdG9yKGNoZWNrLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGYgfSkuaW50ZXJmYWNlKENhbGxhYmxlKTtcblxuICAgICAgICB0aGlzLl9jaGVjayA9IGNoZWNrO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlID09PSB0aGlzLl9jaGVjaykgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBlcWxcbiAqIEBwYXJhbSB7Kn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVxbChjaGVjaywgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgRXF1YWxzKGNoZWNrLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBhbmRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGxlZnRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhbmQobGVmdCwgcmlnaHQpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbiBhbmRfY2FsbCh2KSB7IHJldHVybiAobGVmdCh2KSA9PSBudWxsKSA/IHYgOiByaWdodCh2KSB9O1xuXG59XG4iXX0=
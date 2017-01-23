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

        (0, _beof2.default)({ predicate: predicate }).function();
        (0, _beof2.default)({ f: f }).function();

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

        (0, _beof2.default)({ left: left }).function();
        (0, _beof2.default)({ right: right }).function();

        this._left = left;
        this._right = right;
    }

    _createClass(Or, [{
        key: 'call',
        value: function call(context, value) {

            return this._left.call(context, value) || this._right.call(context, value);
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

        (0, _beof2.default)({ f: f }).function();

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
        (0, _beof2.default)({ f: f }).function();

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
        (0, _beof2.default)({ f: f }).function();

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

        (0, _beof2.default)({ f: f }).function();

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwicmVxdWlyZWQiLCJvayIsImVxbCIsImFuZCIsIk9LIiwiSW5zdGFuY2VPZiIsInByZWRpY2F0ZSIsImYiLCJmdW5jdGlvbiIsIl9wcmVkaWNhdGUiLCJfZiIsImNvbnRleHQiLCJ2YWx1ZSIsImNhbGwiLCJjIiwidiIsIk9yIiwibGVmdCIsInJpZ2h0IiwiX2xlZnQiLCJfcmlnaHQiLCJUeXBlIiwic3RyaW5nIiwiX3R5cGUiLCJGdW5jdGlvbiIsIklzIiwiX3ZhbHVlIiwiUmVxdWlyZWQiLCJrZXlzIiwib2JqZWN0IiwiX2tleXMiLCJPYmplY3QiLCJyZWR1Y2UiLCJwcmV2Iiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJjaGVjayIsIkVxdWFscyIsIl9jaGVjayIsImFuZF9jYWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztRQXlDZ0JBLEssR0FBQUEsSztRQXNDQUMsRSxHQUFBQSxFO1FBeUNBQyxJLEdBQUFBLEk7UUF3Q0FDLEUsR0FBQUEsRTtRQTZEQUMsUSxHQUFBQSxRO1FBY0FDLEUsR0FBQUEsRTtRQXNDQUMsRyxHQUFBQSxHO1FBWUFDLEcsR0FBQUEsRzs7QUE3UmhCOzs7Ozs7OztBQUVPLElBQU1DLGtCQUFLLElBQVg7O0FBRVA7Ozs7O0FBS0E7Ozs7Ozs7SUFNYUMsVSxXQUFBQSxVO0FBRVQsd0JBQVlDLFNBQVosRUFBdUJDLENBQXZCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELG9CQUFGLEVBQUwsRUFBb0JFLFFBQXBCO0FBQ0EsNEJBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlDLFFBQVo7O0FBRUEsYUFBS0MsVUFBTCxHQUFrQkgsU0FBbEI7QUFDQSxhQUFLSSxFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRQSxpQkFBaUIsS0FBS0gsVUFBdkIsR0FBcUMsS0FB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VUFBU1EsQ0FBVCxFQUFZO0FBQUUsZUFBT0QsRUFBRUQsSUFBRixDQUFPLElBQVAsRUFBYUUsQ0FBYixDQUFQO0FBQXlCLEtBQTlDO0FBRUg7O0FBRUQ7Ozs7O0FBS08sU0FBU1osR0FBVCxDQUFhYyxJQUFiLEVBQW1CQyxLQUFuQixFQUEwQjs7QUFFN0IsV0FBTyxTQUFTcUIsUUFBVCxDQUFrQnhCLENBQWxCLEVBQXFCO0FBQUUsZUFBUUUsS0FBS0YsQ0FBTCxLQUFXLElBQVosR0FBb0JBLENBQXBCLEdBQXdCRyxNQUFNSCxDQUFOLENBQS9CO0FBQXlDLEtBQXZFO0FBRUgiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcblxuZXhwb3J0IGNvbnN0IE9LID0gdHJ1ZTtcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBzb21lIENhbGxhYmxlcyB0aGF0IG1ha2VcbiAqIGZpbHRlcmluZyBtZXNzYWdlcyBsZXNzIG9uZXJvdXMuXG4gKi9cblxuLyoqXG4gKiBJbnN0YW5jZU9mIHByZWZvcm1zIGFuIGluc3RhbmNlb2YgY2hlY2sgb24gdGhlIGlucHV0IGJlZm9yZSBleGVjdXRpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcmVkaWNhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqIEBpbXBsZW1lbnRzIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGNsYXNzIEluc3RhbmNlT2Yge1xuXG4gICAgY29uc3RydWN0b3IocHJlZGljYXRlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHByZWRpY2F0ZSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3ByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMuX3ByZWRpY2F0ZSkgPyB0aGlzLl9mLmNhbGwoY29udGV4dCwgdmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGluc29mIGNoZWNrcyBpZiB0aGUgdmFsdWUgc3VwcGxpZWQgaXMgYW4gaW5zdGFuY2Ugb2YgdGhlIHByZWRpY2F0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQHJldHVybnMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zb2YocHJlZGljYXRlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBJbnN0YW5jZU9mKHByZWRpY2F0ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogT3IgcHJlZm9ybXMgYSBsb2dpY2FsICdvcicgYmV0d2VlbiB0d28gQ2FsbGFibGVzLlxuICogQHBhcmFtIHtDYWxsYWJsZX0gbGVmdFxuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBpbXBsZW1lbnRzIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGNsYXNzIE9yIHtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQsIHJpZ2h0KSB7XG5cbiAgICAgICAgYmVvZih7IGxlZnQgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IHJpZ2h0IH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gcmlnaHQ7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnQuY2FsbChjb250ZXh0LCB2YWx1ZSkgfHwgdGhpcy5fcmlnaHQuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXNcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICovXG5leHBvcnQgZnVuY3Rpb24gb3IobGVmdCwgcmlnaHQpIHtcblxuICAgIHZhciBjID0gbmV3IE9yKGxlZnQsIHJpZ2h0KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBUeXBlIHByZWZvcm1zIGEgdHlwZSBjaGVjayBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBmKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgYmVvZih7IHR5cGUgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgYmVvZih7IGYgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzLl90eXBlIGluc3RhbmNlb2YgRnVuY3Rpb24pID9cbiAgICAgICAgICAgICh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsIDpcbiAgICAgICAgICAgICh0eXBlb2YgdmFsdWUgPT09IHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVHlwZSBwcmVmb3JtcyBhIHR5cGUgY2hlY2sgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGUodHlwZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgVHlwZSh0eXBlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuXG4vKipcbiAqIElzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGNsYXNzIElzIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHZhbHVlIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX3ZhbHVlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGlzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzKHZhbHVlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBJcyh2YWx1ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogUmVxdWlyZWQgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIHdoZW4gYW4gb2JqZWN0IGhhcyB0aGUgcmVxdWlyZWQga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1aXJlZCB7XG5cbiAgICBjb25zdHJ1Y3RvcihrZXlzLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGtleXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcblxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdmFsdWUgPSBPYmplY3Qua2V5cyhrZXlzKS5yZWR1Y2UoKHByZXYsIGtleSkgPT4ge1xuXG4gICAgICAgICAgICBpZiAocHJldiA9PSBudWxsKSByZXR1cm4gcHJldjtcblxuICAgICAgICAgICAgaWYgKGtleXNba2V5XSkge1xuXG4gICAgICAgICAgICAgICAgaWYgKHByZXYuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHByZXY7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBwcmV2O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICB9LCB2YWx1ZSk7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PSBudWxsKSA/IHZhbHVlIDogdGhpcy5fZih2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiByZXF1aXJlZCByZXF1aXJlcyB0aGUgdmFsdWUgdG8gcG9zc2VzIGEgc2V0IG9mIGtleXMuXG4gKiBAcGFyYW0ge29iamVjdH0ga2V5c1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICogQHJldHVybnMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVxdWlyZWQodmFsdWUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IFJlcXVpcmVkKHZhbHVlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBvayBhY2NlcHRzIGEgYm9vbGVhbiB2YWx1ZSB0byBkZWNpZGUgd2hldGhlciBvciBub3QgdG8gZXhjdXRlIGl0c1xuICogQ2FsbGFibGUuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IGNoZWNrXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAcmV0dXJuIHtDYWxsYmFsZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9rKGNoZWNrLCBmKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gY2hlY2sgPyBmKHYpIDogbnVsbCB9O1xuXG59XG5cblxuXG4vKipcbiAqIEVxdWFscyBleGVjdXRlcyBpdHMgZnVuY3Rpb24gaWYgdGhlIHZhbHVlIGlzIHN0cmljdGx5IGVxdWFsIHRvIGl0cyBjaGVjay5cbiAqIEBwYXJhbSB7Kn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEBpbXBsZW1lbnRzIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGNsYXNzIEVxdWFscyB7XG5cbiAgICBjb25zdHJ1Y3RvcihjaGVjaywgZikge1xuXG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fY2hlY2sgPSBjaGVjaztcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSA9PT0gdGhpcy5fY2hlY2spID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogZXFsXG4gKiBAcGFyYW0geyp9IGNoZWNrXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlcWwoY2hlY2ssIGYpIHtcblxuICAgIHZhciBjID0gbmV3IEVxdWFscyhjaGVjaywgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogYW5kXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBsZWZ0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICovXG5leHBvcnQgZnVuY3Rpb24gYW5kKGxlZnQsIHJpZ2h0KSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gYW5kX2NhbGwodikgeyByZXR1cm4gKGxlZnQodikgPT0gbnVsbCkgPyB2IDogcmlnaHQodikgfTtcblxufVxuIl19
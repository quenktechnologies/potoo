'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Is = exports.Type = exports.Or = exports.InstanceOf = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.insof = insof;
exports.or = or;
exports.type = type;
exports.is = is;
exports.ok = ok;

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

        (0, _beof2.default)({ type: type }).string();
        (0, _beof2.default)({ f: f }).function();

        this._type = type;
        this._f = f;
    }

    _createClass(Type, [{
        key: 'call',
        value: function call(context, value) {

            return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === this._type ? this._f(value) : null;
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
 * ok accepts a boolean value to decide whether or not to excute its
 * Callable.
 * @param {boolean} check
 * @param {Callable} f
 */
function ok(check, f) {

    return function (v) {
        return check ? f(v) : null;
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwib2siLCJJbnN0YW5jZU9mIiwicHJlZGljYXRlIiwiZiIsImZ1bmN0aW9uIiwiX3ByZWRpY2F0ZSIsIl9mIiwiY29udGV4dCIsInZhbHVlIiwiY2FsbCIsImMiLCJ2IiwiT3IiLCJsZWZ0IiwicmlnaHQiLCJfbGVmdCIsIl9yaWdodCIsIlR5cGUiLCJzdHJpbmciLCJfdHlwZSIsIklzIiwiX3ZhbHVlIiwiY2hlY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1FBdUNnQkEsSyxHQUFBQSxLO1FBc0NBQyxFLEdBQUFBLEU7UUFxQ0FDLEksR0FBQUEsSTtRQXdDQUMsRSxHQUFBQSxFO1FBYUFDLEUsR0FBQUEsRTs7QUF2S2hCOzs7Ozs7OztBQUVBOzs7OztBQUtBOzs7Ozs7SUFNYUMsVSxXQUFBQSxVO0FBRVQsd0JBQVlDLFNBQVosRUFBdUJDLENBQXZCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELG9CQUFGLEVBQUwsRUFBb0JFLFFBQXBCO0FBQ0EsNEJBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlDLFFBQVo7O0FBRUEsYUFBS0MsVUFBTCxHQUFrQkgsU0FBbEI7QUFDQSxhQUFLSSxFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRQSxpQkFBaUIsS0FBS0gsVUFBdkIsR0FBcUMsS0FBS0MsRUFBTCxDQUFRRyxJQUFSLENBQWFGLE9BQWIsRUFBc0JDLEtBQXRCLENBQXJDLEdBQW9FLElBQTNFO0FBRUg7Ozs7OztBQUlMOzs7Ozs7OztBQU1PLFNBQVNaLEtBQVQsQ0FBZU0sU0FBZixFQUEwQkMsQ0FBMUIsRUFBNkI7O0FBRWhDLFFBQUlPLElBQUksSUFBSVQsVUFBSixDQUFlQyxTQUFmLEVBQTBCQyxDQUExQixDQUFSO0FBQ0EsV0FBTyxVQUFTUSxDQUFULEVBQVk7QUFBRSxlQUFPRCxF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UW5CLEVBQUVRLENBQUYsQ0FBUixHQUFlLElBQXRCO0FBQTRCLEtBQWpEO0FBRUgiLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcblxuLyoqXG4gKiBUaGlzIG1vZHVsZSBwcm92aWRlcyBzb21lIENhbGxhYmxlcyB0aGF0IG1ha2VcbiAqIGZpbHRlcmluZyBtZXNzYWdlcyBsZXNzIG9uZXJvdXMuXG4gKi9cblxuLyoqXG4gKiBJbnN0YW5jZU9mIHByZWZvcm1zIGFuIGluc3RhbmNlb2YgY2hlY2sgb24gdGhlIGlucHV0IGJlZm9yZSBleGVjdXRpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcmVkaWNhdGVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqIEBpbXBsZW1lbnRzIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGNsYXNzIEluc3RhbmNlT2Yge1xuXG4gICAgY29uc3RydWN0b3IocHJlZGljYXRlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHByZWRpY2F0ZSB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3ByZWRpY2F0ZSA9IHByZWRpY2F0ZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIHRoaXMuX3ByZWRpY2F0ZSkgPyB0aGlzLl9mLmNhbGwoY29udGV4dCwgdmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGluc29mIGNoZWNrcyBpZiB0aGUgdmFsdWUgc3VwcGxpZWQgaXMgYW4gaW5zdGFuY2Ugb2YgdGhlIHByZWRpY2F0ZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQHJldHVybnMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW5zb2YocHJlZGljYXRlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBJbnN0YW5jZU9mKHByZWRpY2F0ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogT3IgcHJlZm9ybXMgYSBsb2dpY2FsICdvcicgYmV0d2VlbiB0d28gQ2FsbGFibGVzLlxuICogQHBhcmFtIHtDYWxsYWJsZX0gbGVmdFxuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBpbXBsZW1lbnRzIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGNsYXNzIE9yIHtcblxuICAgIGNvbnN0cnVjdG9yKGxlZnQsIHJpZ2h0KSB7XG5cbiAgICAgICAgYmVvZih7IGxlZnQgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IHJpZ2h0IH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gcmlnaHQ7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xlZnQuY2FsbChjb250ZXh0LCB2YWx1ZSkgfHwgdGhpcy5fcmlnaHQuY2FsbChjb250ZXh0LCB2YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXNcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICovXG5leHBvcnQgZnVuY3Rpb24gb3IobGVmdCwgcmlnaHQpIHtcblxuICAgIHZhciBjID0gbmV3IE9yKGxlZnQsIHJpZ2h0KTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBUeXBlIHByZWZvcm1zIGEgdHlwZSBjaGVjayBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih0eXBlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHR5cGUgfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSB0aGlzLl90eXBlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFR5cGUgcHJlZm9ybXMgYSB0eXBlIGNoZWNrIGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0eXBlKHR5cGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IFR5cGUodHlwZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cblxuLyoqXG4gKiBJcyBwcmVmb3JtcyBhIHN0cmljeSBlcXVhbGl0eSBjb21wYXJpc29uIGJldHdlZW4gaXQncyBwcmVkaWNhdGVcbiAqIGFuZCBpbnB1dCBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBJcyB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgZikge1xuXG4gICAgICAgIGJlb2YoeyB2YWx1ZSB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IGYgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlID09PSB0aGlzLl92YWx1ZSkgPyB0aGlzLl9mKHZhbHVlKSA6IG51bGw7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBpcyBwcmVmb3JtcyBhIHN0cmljeSBlcXVhbGl0eSBjb21wYXJpc29uIGJldHdlZW4gaXQncyBwcmVkaWNhdGVcbiAqIGFuZCBpbnB1dCBiZWZvcmUgZXhlY3V0aW5nIGl0J3MgZnVuY3Rpb24uXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpcyh2YWx1ZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgSXModmFsdWUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIG9rIGFjY2VwdHMgYSBib29sZWFuIHZhbHVlIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byBleGN1dGUgaXRzXG4gKiBDYWxsYWJsZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9rKGNoZWNrLCBmKSB7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gY2hlY2sgPyBmKHYpIDogbnVsbCB9O1xuXG59XG4iXX0=
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Required = exports.Is = exports.Type = exports.Or = exports.InstanceOf = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.insof = insof;
exports.or = or;
exports.type = type;
exports.is = is;
exports.required = required;
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
        value: function call(value) {

            var keys = this._keys;

            value = Object.keys(keys).reduce(function (prev, key) {

                if (prev == null || (typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object') return null;

                if (keys[key]) if (value.hasOwnProperty(key)) return value;

                if (!value.hasOwnProperty(key)) return value;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwicmVxdWlyZWQiLCJvayIsIkluc3RhbmNlT2YiLCJwcmVkaWNhdGUiLCJmIiwiZnVuY3Rpb24iLCJfcHJlZGljYXRlIiwiX2YiLCJjb250ZXh0IiwidmFsdWUiLCJjYWxsIiwiYyIsInYiLCJPciIsImxlZnQiLCJyaWdodCIsIl9sZWZ0IiwiX3JpZ2h0IiwiVHlwZSIsInN0cmluZyIsIl90eXBlIiwiSXMiLCJfdmFsdWUiLCJSZXF1aXJlZCIsImtleXMiLCJvYmplY3QiLCJfa2V5cyIsIk9iamVjdCIsInJlZHVjZSIsInByZXYiLCJrZXkiLCJoYXNPd25Qcm9wZXJ0eSIsImNoZWNrIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztRQXVDZ0JBLEssR0FBQUEsSztRQXNDQUMsRSxHQUFBQSxFO1FBcUNBQyxJLEdBQUFBLEk7UUF3Q0FDLEUsR0FBQUEsRTtRQXdEQUMsUSxHQUFBQSxRO1FBY0FDLEUsR0FBQUEsRTs7QUFoT2hCOzs7Ozs7OztBQUVBOzs7OztBQUtBOzs7Ozs7SUFNYUMsVSxXQUFBQSxVO0FBRVQsd0JBQVlDLFNBQVosRUFBdUJDLENBQXZCLEVBQTBCO0FBQUE7O0FBRXRCLDRCQUFLLEVBQUVELG9CQUFGLEVBQUwsRUFBb0JFLFFBQXBCO0FBQ0EsNEJBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlDLFFBQVo7O0FBRUEsYUFBS0MsVUFBTCxHQUFrQkgsU0FBbEI7QUFDQSxhQUFLSSxFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRQSxpQkFBaUIsS0FBS0gsVUFBdkIsR0FBcUMsS0FBS0MsRUFBTCxDQUFRRyxJQUFSLENBQWFGLE9BQWIsRUFBc0JDLEtBQXRCLENBQXJDLEdBQW9FLElBQTNFO0FBRUg7Ozs7OztBQUlMOzs7Ozs7OztBQU1PLFNBQVNiLEtBQVQsQ0FBZU8sU0FBZixFQUEw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UDtBQUF5QixLQUE5QztBQUVIOztBQUVEOzs7Ozs7O0FBT08sU0FBU1gsRUFBVCxDQUFZK0IsS0FBWixFQUFtQjVCLENBQW5CLEVBQXNCOztBQUV6QixXQUFPLFVBQVNRLENBQVQsRUFBWTtBQUFFLGVBQU9vQixRQUFRNUIsRUFBRVEsQ0FBRixDQUFSLEdBQWUsSUFBdEI7QUFBNEIsS0FBakQ7QUFFSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgQ2FsbGFibGVzIHRoYXQgbWFrZVxuICogZmlsdGVyaW5nIG1lc3NhZ2VzIGxlc3Mgb25lcm91cy5cbiAqL1xuXG4vKipcbiAqIEluc3RhbmNlT2YgcHJlZm9ybXMgYW4gaW5zdGFuY2VvZiBjaGVjayBvbiB0aGUgaW5wdXQgYmVmb3JlIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VPZiB7XG5cbiAgICBjb25zdHJ1Y3RvcihwcmVkaWNhdGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgcHJlZGljYXRlIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5fcHJlZGljYXRlKSA/IHRoaXMuX2YuY2FsbChjb250ZXh0LCB2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaW5zb2YgY2hlY2tzIGlmIHRoZSB2YWx1ZSBzdXBwbGllZCBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgcHJlZGljYXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNvZihwcmVkaWNhdGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IEluc3RhbmNlT2YocHJlZGljYXRlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXMuXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBsZWZ0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgT3Ige1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgcmlnaHQgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5fcmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdC5jYWxsKGNvbnRleHQsIHZhbHVlKSB8fCB0aGlzLl9yaWdodC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE9yIHByZWZvcm1zIGEgbG9naWNhbCAnb3InIGJldHdlZW4gdHdvIENhbGxhYmxlc1xuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcihsZWZ0LCByaWdodCkge1xuXG4gICAgdmFyIGMgPSBuZXcgT3IobGVmdCwgcmlnaHQpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIFR5cGUgcHJlZm9ybXMgYSB0eXBlIGNoZWNrIGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgdHlwZSB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IGYgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09IHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVHlwZSBwcmVmb3JtcyBhIHR5cGUgY2hlY2sgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGUodHlwZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgVHlwZSh0eXBlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuXG4vKipcbiAqIElzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGNsYXNzIElzIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHZhbHVlIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX3ZhbHVlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGlzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzKHZhbHVlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBJcyh2YWx1ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogUmVxdWlyZWQgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIHdoZW4gYW4gb2JqZWN0IGhhcyB0aGUgcmVxdWlyZWQga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1aXJlZCB7XG5cbiAgICBjb25zdHJ1Y3RvcihrZXlzLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGtleXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbCh2YWx1ZSkge1xuXG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcblxuICAgICAgICB2YWx1ZSA9IE9iamVjdC5rZXlzKGtleXMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICgocHJldiA9PSBudWxsKSB8fCAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGlmIChrZXlzW2tleV0pXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgfSwgdmFsdWUpO1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT0gbnVsbCk/IHZhbHVlOiB0aGlzLl9mKHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIHJlcXVpcmVkIHJlcXVpcmVzIHRoZSB2YWx1ZSB0byBwb3NzZXMgYSBzZXQgb2Yga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXF1aXJlZCh2YWx1ZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgUmVxdWlyZWQodmFsdWUsIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIG9rIGFjY2VwdHMgYSBib29sZWFuIHZhbHVlIHRvIGRlY2lkZSB3aGV0aGVyIG9yIG5vdCB0byBleGN1dGUgaXRzXG4gKiBDYWxsYWJsZS5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gY2hlY2tcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEByZXR1cm4ge0NhbGxiYWxlfVxuICovXG5leHBvcnQgZnVuY3Rpb24gb2soY2hlY2ssIGYpIHtcblxuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjaGVjayA/IGYodikgOiBudWxsIH07XG5cbn1cbiJdfQ==
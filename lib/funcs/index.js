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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mdW5jcy9pbmRleC5qcyJdLCJuYW1lcyI6WyJpbnNvZiIsIm9yIiwidHlwZSIsImlzIiwicmVxdWlyZWQiLCJvayIsImVxbCIsIk9LIiwiSW5zdGFuY2VPZiIsInByZWRpY2F0ZSIsImYiLCJmdW5jdGlvbiIsIl9wcmVkaWNhdGUiLCJfZiIsImNvbnRleHQiLCJ2YWx1ZSIsImNhbGwiLCJjIiwidiIsIk9yIiwibGVmdCIsInJpZ2h0IiwiX2xlZnQiLCJfcmlnaHQiLCJUeXBlIiwic3RyaW5nIiwiX3R5cGUiLCJJcyIsIl92YWx1ZSIsIlJlcXVpcmVkIiwia2V5cyIsIm9iamVjdCIsIl9rZXlzIiwiT2JqZWN0IiwicmVkdWNlIiwicHJldiIsImtleSIsImhhc093blByb3BlcnR5IiwiY2hlY2siLCJFcXVhbHMiLCJfY2hlY2siXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O1FBeUNnQkEsSyxHQUFBQSxLO1FBc0NBQyxFLEdBQUFBLEU7UUFxQ0FDLEksR0FBQUEsSTtRQXdDQUMsRSxHQUFBQSxFO1FBd0RBQyxRLEdBQUFBLFE7UUFjQUMsRSxHQUFBQSxFO1FBc0NBQyxHLEdBQUFBLEc7O0FBeFFoQjs7Ozs7Ozs7QUFFTyxJQUFNQyxrQkFBSyxJQUFYOztBQUVQOzs7OztBQUtBOzs7Ozs7O0lBTWFDLFUsV0FBQUEsVTtBQUVULHdCQUFZQyxTQUFaLEVBQXVCQyxDQUF2QixFQUEwQjtBQUFBOztBQUV0Qiw0QkFBSyxFQUFFRCxvQkFBRixFQUFMLEVBQW9CRSxRQUFwQjtBQUNBLDRCQUFLLEVBQUVELElBQUYsRUFBTCxFQUFZQyxRQUFaOztBQUVBLGFBQUtDLFVBQUwsR0FBa0JILFNBQWxCO0FBQ0EsYUFBS0ksRUFBTCxHQUFVSCxDQUFWO0FBRUg7Ozs7NkJBRUlJLE8sRUFBU0MsSyxFQUFPOztBQUVqQixtQkFBUUEsaUJBQWlCLEtBQUtILFVBQXZCLEdBQXFDLEtBQUtDLEVBQUwsQ0FBUUcsSUFBUixDQUFhRixPQUFiLEVBQXNCQyxLQUF0QixDQUFyQyxHQUFvRSxJQUEzRTtBQUVIOzs7Ozs7QUFJTDs7Ozs7Ozs7QUFNTyxTQUFTZixLQUFULENBQWVTLFNBQWYsRUFBMEJDLENBQTFCLEVBQTZCOztBQUVoQyxRQUFJTyxJQUFJLElBQUlULFVBQUosQ0FBZUMsU0FBZixFQUEwQkMsQ0FBMUIsQ0FBUjtBQUNBLFdBQU8sVUFBU1EsQ0FBVCxFQUFZO0FBQUUsZUFBT0QsRUFBRUQsSUFBRixDQUFPLElBQVAsRUFBYUUsQ0FBYixDQUFQO0FBQXlCLEtBQTlDO0FBRUg7O0FBRUQ7Ozs7Ozs7SUFNYUMsRSxXQUFBQSxFO0FBRVQsZ0JBQVlDLElBQVosRUFBa0JDLEtBQWxCLEVBQXlCO0FBQUE7O0FBRXJCLDRCQUFLLEVBQUVELFVBQUYsRUFBTCxFQUFlVCxRQUFmO0FBQ0EsNEJBQUssRUFBRVUsWUFBRixFQUFMLEVBQWdCVixRQUFoQjs7QUFFQSxhQUFLVyxLQUFMLEdBQWFGLElBQWI7QUFDQSxhQUFLRyxNQUFMLEdBQWNGLEtBQWQ7QUFFSDs7Ozs2QkFFSVAsTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFPLEtBQUtPLEtBQUwsQ0FBV04sSUFBWCxDQUFnQkYsT0FBaEIsRUFBeUJDLEtBQXpCLEtBQW1DLEtBQUtRLE1BQUwsQ0FBWVAsSUFBWixDQUFpQkYsT0FBakIsRUFBMEJDLEtBQTFCLENBQTFDO0FBRUg7Ozs7OztBQUlMOzs7Ozs7O0FBS08sU0FBU2QsRUFBVCxDQUFZbUIsSUFBWixFQUFrQkMsS0FBbEIsRUFBeUI7O0FBRTVCLFFBQUlKLElBQUksSUFBSUUsRUFBSixDQUFPQyxJQUFQLEVBQWFDLEtBQWIsQ0FBUjtBQUNBLFdBQU8sVUFBU0gsQ0FBVCxFQUFZO0FBQUUsZUFBT0QsRUFBRUQsSUFBRixDQUFPLElBQVAsRUFBYUUsQ0FBYixDQUFQO0FBQXlCLEtBQTlDO0FBRUg7O0FBRUQ7Ozs7OztJQUthTSxJLFdBQUFBLEk7QUFFVCxrQkFBWXRCLElBQVosRUFBa0JRLENBQWxCLEVBQXFCO0FBQUE7O0FBRWpCLDRCQUFLLEVBQUVSLFVBQUYsRUFBTCxFQUFldUIsTUFBZjtBQUNBLDRCQUFLLEVBQUVmLElBQUYsRUFBTCxFQUFZQyxRQUFaOztBQUVBLGFBQUtlLEtBQUwsR0FBYXhCLElBQWI7QUFDQSxhQUFLVyxFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRLFFBQU9BLEtBQVAseUNBQU9BLEtBQVAsT0FBaUIsS0FBS1csS0FBdkIsR0FBZ0MsS0FBS2IsRUFBTCxDQUFRRSxLQUFSLENBQWhDLEdBQWlELElBQXhEO0FBRUg7Ozs7OztBQUlMOzs7Ozs7O0FBS08sU0FBU2IsSUFBVCxDQUFjQSxJQUFkLEVBQW9CUSxDQUFwQixFQUF1Qjs7QUFFMUIsUUFBSU8sSUFBSSxJQUFJTyxJQUFKLENBQVN0QixJQUFULEVBQWVRLENBQWYsQ0FBUjtBQUNBLFdBQU8sVUFBU1EsQ0FBVCxFQUFZO0FBQUUsZUFBT0QsRUFBRUQsSUFBRixDQUFPLElBQVAsRUFBYUUsQ0FBYixDQUFQO0FBQXlCLEtBQTlDO0FBRUg7O0FBR0Q7Ozs7Ozs7SUFNYVMsRSxXQUFBQSxFO0FBRVQsZ0JBQVlaLEtBQVosRUFBbUJMLENBQW5CLEVBQXNCO0FBQUE7O0FBRWxCLDRCQUFLLEVBQUVLLFlBQUYsRUFBTCxFQUFnQlUsTUFBaEI7QUFDQSw0QkFBSyxFQUFFZixJQUFGLEVBQUwsRUFBWUMsUUFBWjs7QUFFQSxhQUFLaUIsTUFBTCxHQUFjYixLQUFkO0FBQ0EsYUFBS0YsRUFBTCxHQUFVSCxDQUFWO0FBRUg7Ozs7NkJBRUlJLE8sRUFBU0MsSyxFQUFPOztBQUVqQixtQkFBUUEsVUFBVSxLQUFLYSxNQUFoQixHQUEwQixLQUFLZixFQUFMLENBQVFFLEtBQVIsQ0FBMUIsR0FBMkMsSUFBbEQ7QUFFSDs7Ozs7O0FBSUw7Ozs7Ozs7O0FBTU8sU0FBU1osRUFBVCxDQUFZWSxLQUFaLEVBQW1CTCxDQUFuQixFQUFzQjs7QUFFekIsUUFBSU8sSUFBSSxJQUFJVSxFQUFKLENBQU9aLEtBQVAsRUFBY0wsQ0FBZCxDQUFSO0FBQ0EsV0FBTyxVQUFTUSxDQUFULEVBQVk7QUFBRSxlQUFPRCxFQUFFRCxJQUFGLENBQU8sSUFBUCxFQUFhRSxDQUFiLENBQVA7QUFBeUIsS0FBOUM7QUFFSDs7QUFFRDs7Ozs7O0lBS2FXLFEsV0FBQUEsUTtBQUVULHNCQUFZQyxJQUFaLEVBQWtCcEIsQ0FBbEIsRUFBcUI7QUFBQTs7QUFFakIsNEJBQUssRUFBRW9CLFVBQUYsRUFBTCxFQUFlQyxNQUFmO0FBQ0EsNEJBQUssRUFBRXJCLElBQUYsRUFBTCxFQUFZQyxRQUFaOztBQUVBLGFBQUtxQixLQUFMLEdBQWFGLElBQWI7QUFDQSxhQUFLakIsRUFBTCxHQUFVSCxDQUFWO0FBRUg7Ozs7NkJBRUlLLEssRUFBTzs7QUFFUixnQkFBSWUsT0FBTyxLQUFLRSxLQUFoQjs7QUFFQWpCLG9CQUFRa0IsT0FBT0gsSUFBUCxDQUFZQSxJQUFaLEVBQWtCSSxNQUFsQixDQUF5QixVQUFDQyxJQUFELEVBQU9DLEdBQVAsRUFBZTs7QUFFNUMsb0JBQUtELFFBQVEsSUFBVCxJQUFtQixRQUFPcEIsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUF4QyxFQUNJLE9BQU8sSUFBUDs7QUFFSixvQkFBSWUsS0FBS00sR0FBTCxDQUFKLEVBQ0ksSUFBSXJCLE1BQU1zQixjQUFOLENBQXFCRCxHQUFyQixDQUFKLEVBQ0ksT0FBT3JCLEtBQVA7O0FBRVIsb0JBQUksQ0FBQ0EsTUFBTXNCLGNBQU4sQ0FBcUJELEdBQXJCLENBQUwsRUFDSSxPQUFPckIsS0FBUDs7QUFFSix1QkFBTyxJQUFQO0FBRUgsYUFkTyxFQWNMQSxLQWRLLENBQVI7O0FBZ0JBLG1CQUFRQSxTQUFTLElBQVYsR0FBa0JBLEtBQWxCLEdBQTBCLEtBQUtGLEVBQUwsQ0FBUUUsS0FBUixDQUFqQztBQUVIOzs7Ozs7QUFJTDs7Ozs7Ozs7QUFNTyxTQUFTWCxRQUFULENBQWtCVyxLQUFsQixFQUF5QkwsQ0FBekIsRUFBNEI7O0FBRS9CLFFBQUlPLElBQUksSUFBSVksUUFBSixDQUFhZCxLQUFiLEVBQW9CTCxDQUFwQixDQUFSO0FBQ0EsV0FBTyxVQUFTUSxDQUFULEVBQVk7QUFBRSxlQUFPRCxFQUFFRCxJQUFGLENBQU8sSUFBUCxFQUFhRSxDQUFiLENBQVA7QUFBeUIsS0FBOUM7QUFFSDs7QUFFRDs7Ozs7OztBQU9PLFNBQVNiLEVBQVQsQ0FBWWlDLEtBQVosRUFBbUI1QixDQUFuQixFQUFzQjs7QUFFekIsV0FBTyxVQUFTUSxDQUFULEVBQVk7QUFBRSxlQUFPb0IsUUFBUTVCLEVBQUVRLENBQUYsQ0FBUixHQUFlLElBQXRCO0FBQTRCLEtBQWpEO0FBRUg7O0FBSUQ7Ozs7Ozs7SUFNYXFCLE0sV0FBQUEsTTtBQUVULG9CQUFZRCxLQUFaLEVBQW1CNUIsQ0FBbkIsRUFBc0I7QUFBQTs7QUFFbEIsNEJBQUssRUFBRUEsSUFBRixFQUFMLEVBQVlDLFFBQVo7O0FBRUEsYUFBSzZCLE1BQUwsR0FBY0YsS0FBZDtBQUNBLGFBQUt6QixFQUFMLEdBQVVILENBQVY7QUFFSDs7Ozs2QkFFSUksTyxFQUFTQyxLLEVBQU87O0FBRWpCLG1CQUFRQSxVQUFVLEtBQUt5QixNQUFoQixHQUEwQixLQUFLM0IsRUFBTCxDQUFRRSxLQUFSLENBQTFCLEdBQTJDLElBQWxEO0FBRUg7Ozs7OztBQUlMOzs7Ozs7O0FBS08sU0FBU1QsR0FBVCxDQUFhZ0MsS0FBYixFQUFvQjVCLENBQXBCLEVBQXVCOztBQUUxQixRQUFJTyxJQUFJLElBQUlzQixNQUFKLENBQVdELEtBQVgsRUFBa0I1QixDQUFsQixDQUFSO0FBQ0EsV0FBTyxVQUFTUSxDQUFULEVBQVk7QUFBRSxlQUFPRCxFQUFFRCxJQUFGLENBQU8sSUFBUCxFQUFhRSxDQUFiLENBQVA7QUFBeUIsS0FBOUM7QUFFSCIsImZpbGUiOiJpbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuXG5leHBvcnQgY29uc3QgT0sgPSB0cnVlO1xuXG4vKipcbiAqIFRoaXMgbW9kdWxlIHByb3ZpZGVzIHNvbWUgQ2FsbGFibGVzIHRoYXQgbWFrZVxuICogZmlsdGVyaW5nIG1lc3NhZ2VzIGxlc3Mgb25lcm91cy5cbiAqL1xuXG4vKipcbiAqIEluc3RhbmNlT2YgcHJlZm9ybXMgYW4gaW5zdGFuY2VvZiBjaGVjayBvbiB0aGUgaW5wdXQgYmVmb3JlIGV4ZWN1dGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IHByZWRpY2F0ZVxuICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgSW5zdGFuY2VPZiB7XG5cbiAgICBjb25zdHJ1Y3RvcihwcmVkaWNhdGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgcHJlZGljYXRlIH0pLmZ1bmN0aW9uKCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fcHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICB0aGlzLl9mID0gZjtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gKHZhbHVlIGluc3RhbmNlb2YgdGhpcy5fcHJlZGljYXRlKSA/IHRoaXMuX2YuY2FsbChjb250ZXh0LCB2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogaW5zb2YgY2hlY2tzIGlmIHRoZSB2YWx1ZSBzdXBwbGllZCBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgcHJlZGljYXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gKiBAcmV0dXJucyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnNvZihwcmVkaWNhdGUsIGYpIHtcblxuICAgIHZhciBjID0gbmV3IEluc3RhbmNlT2YocHJlZGljYXRlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuLyoqXG4gKiBPciBwcmVmb3JtcyBhIGxvZ2ljYWwgJ29yJyBiZXR3ZWVuIHR3byBDYWxsYWJsZXMuXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBsZWZ0XG4gKiBAcGFyYW0ge0NhbGxhYmxlfSByaWdodFxuICogQGltcGxlbWVudHMge0NhbGxhYmxlfVxuICovXG5leHBvcnQgY2xhc3MgT3Ige1xuXG4gICAgY29uc3RydWN0b3IobGVmdCwgcmlnaHQpIHtcblxuICAgICAgICBiZW9mKHsgbGVmdCB9KS5mdW5jdGlvbigpO1xuICAgICAgICBiZW9mKHsgcmlnaHQgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9sZWZ0ID0gbGVmdDtcbiAgICAgICAgdGhpcy5fcmlnaHQgPSByaWdodDtcblxuICAgIH1cblxuICAgIGNhbGwoY29udGV4dCwgdmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbGVmdC5jYWxsKGNvbnRleHQsIHZhbHVlKSB8fCB0aGlzLl9yaWdodC5jYWxsKGNvbnRleHQsIHZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE9yIHByZWZvcm1zIGEgbG9naWNhbCAnb3InIGJldHdlZW4gdHdvIENhbGxhYmxlc1xuICogQHBhcmFtIHtDYWxsYWJsZX0gcmlnaHRcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IHJpZ2h0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvcihsZWZ0LCByaWdodCkge1xuXG4gICAgdmFyIGMgPSBuZXcgT3IobGVmdCwgcmlnaHQpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuXG4vKipcbiAqIFR5cGUgcHJlZm9ybXMgYSB0eXBlIGNoZWNrIGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBUeXBlIHtcblxuICAgIGNvbnN0cnVjdG9yKHR5cGUsIGYpIHtcblxuICAgICAgICBiZW9mKHsgdHlwZSB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IGYgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICAgICAgdGhpcy5fZiA9IGY7XG5cbiAgICB9XG5cbiAgICBjYWxsKGNvbnRleHQsIHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09IHRoaXMuX3R5cGUpID8gdGhpcy5fZih2YWx1ZSkgOiBudWxsO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVHlwZSBwcmVmb3JtcyBhIHR5cGUgY2hlY2sgYmVmb3JlIGV4ZWN1dGluZyBpdCdzIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHR5cGUodHlwZSwgZikge1xuXG4gICAgdmFyIGMgPSBuZXcgVHlwZSh0eXBlLCBmKTtcbiAgICByZXR1cm4gZnVuY3Rpb24odikgeyByZXR1cm4gYy5jYWxsKHRoaXMsIHYpOyB9XG5cbn1cblxuXG4vKipcbiAqIElzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGNsYXNzIElzIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IHZhbHVlIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX3ZhbHVlKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGlzIHByZWZvcm1zIGEgc3RyaWN5IGVxdWFsaXR5IGNvbXBhcmlzb24gYmV0d2VlbiBpdCdzIHByZWRpY2F0ZVxuICogYW5kIGlucHV0IGJlZm9yZSBleGVjdXRpbmcgaXQncyBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzKHZhbHVlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBJcyh2YWx1ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogUmVxdWlyZWQgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIHdoZW4gYW4gb2JqZWN0IGhhcyB0aGUgcmVxdWlyZWQga2V5cy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKi9cbmV4cG9ydCBjbGFzcyBSZXF1aXJlZCB7XG5cbiAgICBjb25zdHJ1Y3RvcihrZXlzLCBmKSB7XG5cbiAgICAgICAgYmVvZih7IGtleXMgfSkub2JqZWN0KCk7XG4gICAgICAgIGJlb2YoeyBmIH0pLmZ1bmN0aW9uKCk7XG5cbiAgICAgICAgdGhpcy5fa2V5cyA9IGtleXM7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbCh2YWx1ZSkge1xuXG4gICAgICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcblxuICAgICAgICB2YWx1ZSA9IE9iamVjdC5rZXlzKGtleXMpLnJlZHVjZSgocHJldiwga2V5KSA9PiB7XG5cbiAgICAgICAgICAgIGlmICgocHJldiA9PSBudWxsKSB8fCAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JykpXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgICAgIGlmIChrZXlzW2tleV0pXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgaWYgKCF2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKVxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcblxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgfSwgdmFsdWUpO1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT0gbnVsbCkgPyB2YWx1ZSA6IHRoaXMuX2YodmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogcmVxdWlyZWQgcmVxdWlyZXMgdGhlIHZhbHVlIHRvIHBvc3NlcyBhIHNldCBvZiBrZXlzLlxuICogQHBhcmFtIHtvYmplY3R9IGtleXNcbiAqIEBwYXJhbSB7Q2FsbGFibGV9IGZcbiAqIEByZXR1cm5zIHtDYWxsYWJsZX1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcXVpcmVkKHZhbHVlLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBSZXF1aXJlZCh2YWx1ZSwgZik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGMuY2FsbCh0aGlzLCB2KTsgfVxuXG59XG5cbi8qKlxuICogb2sgYWNjZXB0cyBhIGJvb2xlYW4gdmFsdWUgdG8gZGVjaWRlIHdoZXRoZXIgb3Igbm90IHRvIGV4Y3V0ZSBpdHNcbiAqIENhbGxhYmxlLlxuICogQHBhcmFtIHtib29sZWFufSBjaGVja1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICogQHJldHVybiB7Q2FsbGJhbGV9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvayhjaGVjaywgZikge1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uKHYpIHsgcmV0dXJuIGNoZWNrID8gZih2KSA6IG51bGwgfTtcblxufVxuXG5cblxuLyoqXG4gKiBFcXVhbHMgZXhlY3V0ZXMgaXRzIGZ1bmN0aW9uIGlmIHRoZSB2YWx1ZSBpcyBzdHJpY3RseSBlcXVhbCB0byBpdHMgY2hlY2suXG4gKiBAcGFyYW0geyp9IGNoZWNrXG4gKiBAcGFyYW0ge0NhbGxhYmxlfSBmXG4gKiBAaW1wbGVtZW50cyB7Q2FsbGFibGV9XG4gKi9cbmV4cG9ydCBjbGFzcyBFcXVhbHMge1xuXG4gICAgY29uc3RydWN0b3IoY2hlY2ssIGYpIHtcblxuICAgICAgICBiZW9mKHsgZiB9KS5mdW5jdGlvbigpO1xuXG4gICAgICAgIHRoaXMuX2NoZWNrID0gY2hlY2s7XG4gICAgICAgIHRoaXMuX2YgPSBmO1xuXG4gICAgfVxuXG4gICAgY2FsbChjb250ZXh0LCB2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiAodmFsdWUgPT09IHRoaXMuX2NoZWNrKSA/IHRoaXMuX2YodmFsdWUpIDogbnVsbDtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGVxbFxuICogQHBhcmFtIHsqfSBjaGVja1xuICogQHBhcmFtIHtDYWxsYWJsZX0gZlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXFsKGNoZWNrLCBmKSB7XG5cbiAgICB2YXIgYyA9IG5ldyBFcXVhbHMoY2hlY2ssIGYpO1xuICAgIHJldHVybiBmdW5jdGlvbih2KSB7IHJldHVybiBjLmNhbGwodGhpcywgdik7IH1cblxufVxuIl19
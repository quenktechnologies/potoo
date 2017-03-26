'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.copy = exports.Type = exports.hope = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('../util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * hope a value passes its test, throws an error if not returns the value otherwise.
 * @summary hope :: (string, * , * → Either<Error,*>) →  Either<Error,*>
 */
var hope = exports.hope = function hope(t, k, v, test) {
    return test(v).cata(function (e) {
        throw new TypeError(t + '.' + k + ': \n ' + e.stack);
    }, function (x) {
        return x;
    });
};

/**
 * Type is a helper class for simulating user type support
 * in JavaScript via classes.
 * @param {object} members This object's own enumerable properties are added to
 * the type.
 */

var Type = exports.Type = function () {
    function Type() {
        var _this = this;

        var members = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var checks = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

        _classCallCheck(this, Type);

        Object.keys(checks).forEach(function (k) {
            return _this[k] = hope(_this.constructor.name, k, members[k], checks[k]);
        });
    }

    _createClass(Type, [{
        key: '__CLONE__',
        value: function __CLONE__(f) {
            var _this2 = this;

            return new this.constructor(Object.keys(this).reduce(function (o, k) {
                o[k] = f(_this2[k]);
                return o;
            }, Object.create(null)));
        }

        /**
         * copy this Type, optionally replacing specified keys.
         * @param {object} [keys]
         * @return {Type}
         */

    }, {
        key: 'copy',
        value: function copy(keys) {

            return _copy(this, keys);
        }
    }]);

    return Type;
}();

/**
 * copy the keys of a Type and assign them to a new instance.
 * @param {Type} type
 * @param {object} keys
 * @return {Type}
 * @summary { (Type,Object) →  Type }
 */


var _copy = function _copy(type) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) !== 'object') throw new TypeError('copy(): type must be an instance got \'' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '\'');

    if ((typeof keys === 'undefined' ? 'undefined' : _typeof(keys)) !== 'object') throw new TypeError('copy(): keys must be an object got \'' + (typeof keys === 'undefined' ? 'undefined' : _typeof(keys)) + '\'');

    return new type.constructor((0, _util.merge)(type, keys));
};
exports.copy = _copy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvZGF0YS9UeXBlLmpzIl0sIm5hbWVzIjpbImhvcGUiLCJ0IiwiayIsInYiLCJ0ZXN0IiwiY2F0YSIsIlR5cGVFcnJvciIsImUiLCJzdGFjayIsIngiLCJUeXBlIiwibWVtYmVycyIsImNoZWNrcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiZiIsInJlZHVjZSIsIm8iLCJjcmVhdGUiLCJjb3B5IiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBSU8sSUFBTUEsc0JBQU8sU0FBUEEsSUFBTyxDQUFDQyxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxJQUFWO0FBQUEsV0FBbUJBLEtBQUtELENBQUwsRUFBUUUsSUFBUixDQUFhLGFBQUs7QUFDckQsY0FBTSxJQUFJQyxTQUFKLENBQWlCTCxDQUFqQixTQUFzQkMsQ0FBdEIsYUFBK0JLLEVBQUVDLEtBQWpDLENBQU47QUFDSCxLQUZzQyxFQUVwQztBQUFBLGVBQUtDLENBQUw7QUFBQSxLQUZvQyxDQUFuQjtBQUFBLENBQWI7O0FBS1A7Ozs7Ozs7SUFNYUMsSSxXQUFBQSxJO0FBRVQsb0JBQXVDO0FBQUE7O0FBQUEsWUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFlBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFFbkNDLGVBQ0tDLElBREwsQ0FDVUYsTUFEVixFQUVLRyxPQUZMLENBRWE7QUFBQSxtQkFDTCxNQUFLYixDQUFMLElBQVVGLEtBQUssTUFBS2dCLFdBQUwsQ0FBaUJDLElBQXRCLEVBQTRCZixDQUE1QixFQUErQlMsUUFBUVQsQ0FBUixDQUEvQixFQUEyQ1UsT0FBT1YsQ0FBUCxDQUEzQyxDQURMO0FBQUEsU0FGYjtBQUtIOzs7O2tDQUVTZ0IsQyxFQUFHO0FBQUE7O0FBRVQsbUJBQU8sSUFBSSxLQUFLRixXQUFULENBQ0hILE9BQ0NDLElBREQsQ0FDTSxJQUROLEVBRUNLLE1BRkQsQ0FFUSxVQUFDQyxDQUFELEVBQUlsQixDQUFKLEVBQVU7QUFDZGtCLGtCQUFFbEIsQ0FBRixJQUFPZ0IsRUFBRSxPQUFLaEIsQ0FBTCxDQUFGLENBQVA7QUFDQSx1QkFBT2tCLENBQVA7QUFDSCxhQUxELEVBS0dQLE9BQU9RLE1BQVAsQ0FBYyxJQUFkLENBTEgsQ0FERyxDQUFQO0FBUUg7O0FBRUQ7Ozs7Ozs7OzZCQUtLUCxJLEVBQU07O0FBRVAsbUJBQU9RLE1BQUssSUFBTCxFQUFXUixJQUFYLENBQVA7QUFFSDs7Ozs7O0FBSUw7Ozs7Ozs7OztBQU9PLElBQU1RLFFBQU8sU0FBUEEsS0FBTyxDQUFDQyxJQUFELEVBQXFCO0FBQUEsUUFBZFQsSUFBYyx1RUFBUCxFQUFPOzs7QUFFckMsUUFBSSxRQUFPUyxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJakIsU0FBSixxREFBOERpQixJQUE5RCx5Q0FBOERBLElBQTlELFVBQU47O0FBRUosUUFBSSxRQUFPVCxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJUixTQUFKLG1EQUE0RFEsSUFBNUQseUNBQTREQSxJQUE1RCxVQUFOOztBQUVKLFdBQU8sSUFBSVMsS0FBS1AsV0FBVCxDQUFxQixpQkFBTU8sSUFBTixFQUFZVCxJQUFaLENBQXJCLENBQVA7QUFFSCxDQVZNIiwiZmlsZSI6IlR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4uL3V0aWwnO1xuXG4vKipcbiAqIGhvcGUgYSB2YWx1ZSBwYXNzZXMgaXRzIHRlc3QsIHRocm93cyBhbiBlcnJvciBpZiBub3QgcmV0dXJucyB0aGUgdmFsdWUgb3RoZXJ3aXNlLlxuICogQHN1bW1hcnkgaG9wZSA6OiAoc3RyaW5nLCAqICwgKiDihpIgRWl0aGVyPEVycm9yLCo+KSDihpIgIEVpdGhlcjxFcnJvciwqPlxuICovXG5leHBvcnQgY29uc3QgaG9wZSA9ICh0LCBrLCB2LCB0ZXN0KSA9PiB0ZXN0KHYpLmNhdGEoZSA9PiB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgJHt0fS4ke2t9OiBcXG4gJHtlLnN0YWNrfWApO1xufSwgeCA9PiB4KTtcblxuXG4vKipcbiAqIFR5cGUgaXMgYSBoZWxwZXIgY2xhc3MgZm9yIHNpbXVsYXRpbmcgdXNlciB0eXBlIHN1cHBvcnRcbiAqIGluIEphdmFTY3JpcHQgdmlhIGNsYXNzZXMuXG4gKiBAcGFyYW0ge29iamVjdH0gbWVtYmVycyBUaGlzIG9iamVjdCdzIG93biBlbnVtZXJhYmxlIHByb3BlcnRpZXMgYXJlIGFkZGVkIHRvXG4gKiB0aGUgdHlwZS5cbiAqL1xuZXhwb3J0IGNsYXNzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IobWVtYmVycyA9IHt9LCBjaGVja3MgPSB7fSkge1xuXG4gICAgICAgIE9iamVjdFxuICAgICAgICAgICAgLmtleXMoY2hlY2tzKVxuICAgICAgICAgICAgLmZvckVhY2goayA9PlxuICAgICAgICAgICAgICAgIHRoaXNba10gPSBob3BlKHRoaXMuY29uc3RydWN0b3IubmFtZSwgaywgbWVtYmVyc1trXSwgY2hlY2tzW2tdKSk7XG5cbiAgICB9XG5cbiAgICBfX0NMT05FX18oZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIE9iamVjdFxuICAgICAgICAgICAgLmtleXModGhpcylcbiAgICAgICAgICAgIC5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAgICAgICAgICAgICBvW2tdID0gZih0aGlzW2tdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgICAgIH0sIE9iamVjdC5jcmVhdGUobnVsbCkpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvcHkgdGhpcyBUeXBlLCBvcHRpb25hbGx5IHJlcGxhY2luZyBzcGVjaWZpZWQga2V5cy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2tleXNdXG4gICAgICogQHJldHVybiB7VHlwZX1cbiAgICAgKi9cbiAgICBjb3B5KGtleXMpIHtcblxuICAgICAgICByZXR1cm4gY29weSh0aGlzLCBrZXlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGNvcHkgdGhlIGtleXMgb2YgYSBUeXBlIGFuZCBhc3NpZ24gdGhlbSB0byBhIG5ldyBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7VHlwZX0gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IGtleXNcbiAqIEByZXR1cm4ge1R5cGV9XG4gKiBAc3VtbWFyeSB7IChUeXBlLE9iamVjdCkg4oaSICBUeXBlIH1cbiAqL1xuZXhwb3J0IGNvbnN0IGNvcHkgPSAodHlwZSwga2V5cyA9IHt9KSA9PiB7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdvYmplY3QnKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBjb3B5KCk6IHR5cGUgbXVzdCBiZSBhbiBpbnN0YW5jZSBnb3QgJyR7dHlwZW9mIHR5cGV9J2ApO1xuXG4gICAgaWYgKHR5cGVvZiBrZXlzICE9PSAnb2JqZWN0JylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgY29weSgpOiBrZXlzIG11c3QgYmUgYW4gb2JqZWN0IGdvdCAnJHt0eXBlb2Yga2V5c30nYClcblxuICAgIHJldHVybiBuZXcgdHlwZS5jb25zdHJ1Y3RvcihtZXJnZSh0eXBlLCBrZXlzKSk7XG5cbn1cbiJdfQ==
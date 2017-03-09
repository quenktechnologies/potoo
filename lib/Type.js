'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.copy = exports.Type = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _be = require('./be');

var _util = require('./util');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
            return _this[k] = (0, _be.hope)(k, members[k], checks[k]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UeXBlLmpzIl0sIm5hbWVzIjpbIlR5cGUiLCJtZW1iZXJzIiwiY2hlY2tzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrIiwiZiIsImNvbnN0cnVjdG9yIiwicmVkdWNlIiwibyIsImNyZWF0ZSIsImNvcHkiLCJ0eXBlIiwiVHlwZUVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7OztJQU1hQSxJLFdBQUFBLEk7QUFFVCxvQkFBdUM7QUFBQTs7QUFBQSxZQUEzQkMsT0FBMkIsdUVBQWpCLEVBQWlCO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUVuQ0MsZUFDS0MsSUFETCxDQUNVRixNQURWLEVBRUtHLE9BRkwsQ0FFYTtBQUFBLG1CQUNMLE1BQUtDLENBQUwsSUFBVSxjQUFLQSxDQUFMLEVBQVFMLFFBQVFLLENBQVIsQ0FBUixFQUFvQkosT0FBT0ksQ0FBUCxDQUFwQixDQURMO0FBQUEsU0FGYjtBQUtIOzs7O2tDQUVTQyxDLEVBQUc7QUFBQTs7QUFFVCxtQkFBTyxJQUFJLEtBQUtDLFdBQVQsQ0FDSEwsT0FDQ0MsSUFERCxDQUNNLElBRE4sRUFFQ0ssTUFGRCxDQUVRLFVBQUNDLENBQUQsRUFBSUosQ0FBSixFQUFVO0FBQ2RJLGtCQUFFSixDQUFGLElBQU9DLEVBQUUsT0FBS0QsQ0FBTCxDQUFGLENBQVA7QUFDQSx1QkFBT0ksQ0FBUDtBQUNILGFBTEQsRUFLR1AsT0FBT1EsTUFBUCxDQUFjLElBQWQsQ0FMSCxDQURHLENBQVA7QUFRSDs7QUFFRDs7Ozs7Ozs7NkJBS0tQLEksRUFBTTs7QUFFUCxtQkFBT1EsTUFBSyxJQUFMLEVBQVdSLElBQVgsQ0FBUDtBQUVIOzs7Ozs7QUFJTDs7Ozs7Ozs7O0FBT08sSUFBTVEsUUFBTyxTQUFQQSxLQUFPLENBQUNDLElBQUQsRUFBcUI7QUFBQSxRQUFkVCxJQUFjLHVFQUFQLEVBQU87OztBQUVyQyxRQUFJLFFBQU9TLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEIsRUFDSSxNQUFNLElBQUlDLFNBQUoscURBQThERCxJQUE5RCx5Q0FBOERBLElBQTlELFVBQU47O0FBRUosUUFBSSxRQUFPVCxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJVSxTQUFKLG1EQUE0RFYsSUFBNUQseUNBQTREQSxJQUE1RCxVQUFOOztBQUVKLFdBQU8sSUFBSVMsS0FBS0wsV0FBVCxDQUFxQixpQkFBTUssSUFBTixFQUFZVCxJQUFaLENBQXJCLENBQVA7QUFFSCxDQVZNIiwiZmlsZSI6IlR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBob3BlIH0gZnJvbSAnLi9iZSc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogVHlwZSBpcyBhIGhlbHBlciBjbGFzcyBmb3Igc2ltdWxhdGluZyB1c2VyIHR5cGUgc3VwcG9ydFxuICogaW4gSmF2YVNjcmlwdCB2aWEgY2xhc3Nlcy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZW1iZXJzIFRoaXMgb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgYWRkZWQgdG9cbiAqIHRoZSB0eXBlLlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZW1iZXJzID0ge30sIGNoZWNrcyA9IHt9KSB7XG5cbiAgICAgICAgT2JqZWN0XG4gICAgICAgICAgICAua2V5cyhjaGVja3MpXG4gICAgICAgICAgICAuZm9yRWFjaChrID0+XG4gICAgICAgICAgICAgICAgdGhpc1trXSA9IGhvcGUoaywgbWVtYmVyc1trXSwgY2hlY2tzW2tdKSk7XG5cbiAgICB9XG5cbiAgICBfX0NMT05FX18oZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5jb25zdHJ1Y3RvcihcbiAgICAgICAgICAgIE9iamVjdFxuICAgICAgICAgICAgLmtleXModGhpcylcbiAgICAgICAgICAgIC5yZWR1Y2UoKG8sIGspID0+IHtcbiAgICAgICAgICAgICAgICBvW2tdID0gZih0aGlzW2tdKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbztcbiAgICAgICAgICAgIH0sIE9iamVjdC5jcmVhdGUobnVsbCkpKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvcHkgdGhpcyBUeXBlLCBvcHRpb25hbGx5IHJlcGxhY2luZyBzcGVjaWZpZWQga2V5cy5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW2tleXNdXG4gICAgICogQHJldHVybiB7VHlwZX1cbiAgICAgKi9cbiAgICBjb3B5KGtleXMpIHtcblxuICAgICAgICByZXR1cm4gY29weSh0aGlzLCBrZXlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGNvcHkgdGhlIGtleXMgb2YgYSBUeXBlIGFuZCBhc3NpZ24gdGhlbSB0byBhIG5ldyBpbnN0YW5jZS5cbiAqIEBwYXJhbSB7VHlwZX0gdHlwZVxuICogQHBhcmFtIHtvYmplY3R9IGtleXNcbiAqIEByZXR1cm4ge1R5cGV9XG4gKiBAc3VtbWFyeSB7IChUeXBlLE9iamVjdCkg4oaSICBUeXBlIH1cbiAqL1xuZXhwb3J0IGNvbnN0IGNvcHkgPSAodHlwZSwga2V5cyA9IHt9KSA9PiB7XG5cbiAgICBpZiAodHlwZW9mIHR5cGUgIT09ICdvYmplY3QnKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBjb3B5KCk6IHR5cGUgbXVzdCBiZSBhbiBpbnN0YW5jZSBnb3QgJyR7dHlwZW9mIHR5cGV9J2ApO1xuXG4gICAgaWYgKHR5cGVvZiBrZXlzICE9PSAnb2JqZWN0JylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgY29weSgpOiBrZXlzIG11c3QgYmUgYW4gb2JqZWN0IGdvdCAnJHt0eXBlb2Yga2V5c30nYClcblxuICAgIHJldHVybiBuZXcgdHlwZS5jb25zdHJ1Y3RvcihtZXJnZSh0eXBlLCBrZXlzKSk7XG5cbn1cbiJdfQ==
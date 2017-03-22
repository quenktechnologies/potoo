'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.copy = exports.Type = exports.hope = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _util = require('./util');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UeXBlLmpzIl0sIm5hbWVzIjpbImhvcGUiLCJ0IiwiayIsInYiLCJ0ZXN0IiwiY2F0YSIsIlR5cGVFcnJvciIsImUiLCJzdGFjayIsIngiLCJUeXBlIiwibWVtYmVycyIsImNoZWNrcyIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiZiIsInJlZHVjZSIsIm8iLCJjcmVhdGUiLCJjb3B5IiwidHlwZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBSU8sSUFBTUEsc0JBQU8sU0FBUEEsSUFBTyxDQUFDQyxDQUFELEVBQUlDLENBQUosRUFBT0MsQ0FBUCxFQUFVQyxJQUFWO0FBQUEsV0FBbUJBLEtBQUtELENBQUwsRUFBUUUsSUFBUixDQUFhLGFBQUs7QUFDckQsY0FBTSxJQUFJQyxTQUFKLENBQWlCTCxDQUFqQixTQUFzQkMsQ0FBdEIsYUFBK0JLLEVBQUVDLEtBQWpDLENBQU47QUFDSCxLQUZzQyxFQUVwQztBQUFBLGVBQUtDLENBQUw7QUFBQSxLQUZvQyxDQUFuQjtBQUFBLENBQWI7O0FBS1A7Ozs7Ozs7SUFNYUMsSSxXQUFBQSxJO0FBRVQsb0JBQXVDO0FBQUE7O0FBQUEsWUFBM0JDLE9BQTJCLHVFQUFqQixFQUFpQjtBQUFBLFlBQWJDLE1BQWEsdUVBQUosRUFBSTs7QUFBQTs7QUFFbkNDLGVBQ0tDLElBREwsQ0FDVUYsTUFEVixFQUVLRyxPQUZMLENBRWE7QUFBQSxtQkFDTCxNQUFLYixDQUFMLElBQVVGLEtBQUssTUFBS2dCLFdBQUwsQ0FBaUJDLElBQXRCLEVBQTRCZixDQUE1QixFQUErQlMsUUFBUVQsQ0FBUixDQUEvQixFQUEyQ1UsT0FBT1YsQ0FBUCxDQUEzQyxDQURMO0FBQUEsU0FGYjtBQUtIOzs7O2tDQUVTZ0IsQyxFQUFHO0FBQUE7O0FBRVQsbUJBQU8sSUFBSSxLQUFLRixXQUFULENBQ0hILE9BQ0NDLElBREQsQ0FDTSxJQUROLEVBRUNLLE1BRkQsQ0FFUSxVQUFDQyxDQUFELEVBQUlsQixDQUFKLEVBQVU7QUFDZGtCLGtCQUFFbEIsQ0FBRixJQUFPZ0IsRUFBRSxPQUFLaEIsQ0FBTCxDQUFGLENBQVA7QUFDQSx1QkFBT2tCLENBQVA7QUFDSCxhQUxELEVBS0dQLE9BQU9RLE1BQVAsQ0FBYyxJQUFkLENBTEgsQ0FERyxDQUFQO0FBUUg7O0FBRUQ7Ozs7Ozs7OzZCQUtLUCxJLEVBQU07O0FBRVAsbUJBQU9RLE1BQUssSUFBTCxFQUFXUixJQUFYLENBQVA7QUFFSDs7Ozs7O0FBSUw7Ozs7Ozs7OztBQU9PLElBQU1RLFFBQU8sU0FBUEEsS0FBTyxDQUFDQyxJQUFELEVBQXFCO0FBQUEsUUFBZFQsSUFBYyx1RUFBUCxFQUFPOzs7QUFFckMsUUFBSSxRQUFPUyxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJakIsU0FBSixxREFBOERpQixJQUE5RCx5Q0FBOERBLElBQTlELFVBQU47O0FBRUosUUFBSSxRQUFPVCxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJUixTQUFKLG1EQUE0RFEsSUFBNUQseUNBQTREQSxJQUE1RCxVQUFOOztBQUVKLFdBQU8sSUFBSVMsS0FBS1AsV0FBVCxDQUFxQixpQkFBTU8sSUFBTixFQUFZVCxJQUFaLENBQXJCLENBQVA7QUFFSCxDQVZNIiwiZmlsZSI6IlR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogaG9wZSBhIHZhbHVlIHBhc3NlcyBpdHMgdGVzdCwgdGhyb3dzIGFuIGVycm9yIGlmIG5vdCByZXR1cm5zIHRoZSB2YWx1ZSBvdGhlcndpc2UuXG4gKiBAc3VtbWFyeSBob3BlIDo6IChzdHJpbmcsICogLCAqIOKGkiBFaXRoZXI8RXJyb3IsKj4pIOKGkiAgRWl0aGVyPEVycm9yLCo+XG4gKi9cbmV4cG9ydCBjb25zdCBob3BlID0gKHQsIGssIHYsIHRlc3QpID0+IHRlc3QodikuY2F0YShlID0+IHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGAke3R9LiR7a306IFxcbiAke2Uuc3RhY2t9YCk7XG59LCB4ID0+IHgpO1xuXG5cbi8qKlxuICogVHlwZSBpcyBhIGhlbHBlciBjbGFzcyBmb3Igc2ltdWxhdGluZyB1c2VyIHR5cGUgc3VwcG9ydFxuICogaW4gSmF2YVNjcmlwdCB2aWEgY2xhc3Nlcy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZW1iZXJzIFRoaXMgb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgYWRkZWQgdG9cbiAqIHRoZSB0eXBlLlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZW1iZXJzID0ge30sIGNoZWNrcyA9IHt9KSB7XG5cbiAgICAgICAgT2JqZWN0XG4gICAgICAgICAgICAua2V5cyhjaGVja3MpXG4gICAgICAgICAgICAuZm9yRWFjaChrID0+XG4gICAgICAgICAgICAgICAgdGhpc1trXSA9IGhvcGUodGhpcy5jb25zdHJ1Y3Rvci5uYW1lLCBrLCBtZW1iZXJzW2tdLCBjaGVja3Nba10pKTtcblxuICAgIH1cblxuICAgIF9fQ0xPTkVfXyhmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgICAgICAgT2JqZWN0XG4gICAgICAgICAgICAua2V5cyh0aGlzKVxuICAgICAgICAgICAgLnJlZHVjZSgobywgaykgPT4ge1xuICAgICAgICAgICAgICAgIG9ba10gPSBmKHRoaXNba10pO1xuICAgICAgICAgICAgICAgIHJldHVybiBvO1xuICAgICAgICAgICAgfSwgT2JqZWN0LmNyZWF0ZShudWxsKSkpO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29weSB0aGlzIFR5cGUsIG9wdGlvbmFsbHkgcmVwbGFjaW5nIHNwZWNpZmllZCBrZXlzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBba2V5c11cbiAgICAgKiBAcmV0dXJuIHtUeXBlfVxuICAgICAqL1xuICAgIGNvcHkoa2V5cykge1xuXG4gICAgICAgIHJldHVybiBjb3B5KHRoaXMsIGtleXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogY29weSB0aGUga2V5cyBvZiBhIFR5cGUgYW5kIGFzc2lnbiB0aGVtIHRvIGEgbmV3IGluc3RhbmNlLlxuICogQHBhcmFtIHtUeXBlfSB0eXBlXG4gKiBAcGFyYW0ge29iamVjdH0ga2V5c1xuICogQHJldHVybiB7VHlwZX1cbiAqIEBzdW1tYXJ5IHsgKFR5cGUsT2JqZWN0KSDihpIgIFR5cGUgfVxuICovXG5leHBvcnQgY29uc3QgY29weSA9ICh0eXBlLCBrZXlzID0ge30pID0+IHtcblxuICAgIGlmICh0eXBlb2YgdHlwZSAhPT0gJ29iamVjdCcpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGNvcHkoKTogdHlwZSBtdXN0IGJlIGFuIGluc3RhbmNlIGdvdCAnJHt0eXBlb2YgdHlwZX0nYCk7XG5cbiAgICBpZiAodHlwZW9mIGtleXMgIT09ICdvYmplY3QnKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBjb3B5KCk6IGtleXMgbXVzdCBiZSBhbiBvYmplY3QgZ290ICcke3R5cGVvZiBrZXlzfSdgKVxuXG4gICAgcmV0dXJuIG5ldyB0eXBlLmNvbnN0cnVjdG9yKG1lcmdlKHR5cGUsIGtleXMpKTtcblxufVxuIl19
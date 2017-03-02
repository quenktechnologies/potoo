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

            _this[k] = (0, _be.hope)(k, members[k], checks[k]);
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


var copy = exports.copy = function copy(type) {
    var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};


    if ((typeof type === 'undefined' ? 'undefined' : _typeof(type)) !== 'object') throw new TypeError('copy(): type must be an instance got \'' + (typeof type === 'undefined' ? 'undefined' : _typeof(type)) + '\'');

    if ((typeof keys === 'undefined' ? 'undefined' : _typeof(keys)) !== 'object') throw new TypeError('copy(): keys must be an object got \'' + (typeof keys === 'undefined' ? 'undefined' : _typeof(keys)) + '\'');

    return new type.constructor((0, _util.merge)(type, keys));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UeXBlLmpzIl0sIm5hbWVzIjpbIlR5cGUiLCJtZW1iZXJzIiwiY2hlY2tzIiwiT2JqZWN0Iiwia2V5cyIsImZvckVhY2giLCJrIiwiZiIsImNvbnN0cnVjdG9yIiwicmVkdWNlIiwibyIsImNyZWF0ZSIsImNvcHkiLCJ0eXBlIiwiVHlwZUVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUE7Ozs7OztJQU1hQSxJLFdBQUFBLEk7QUFFVCxvQkFBdUM7QUFBQTs7QUFBQSxZQUEzQkMsT0FBMkIsdUVBQWpCLEVBQWlCO0FBQUEsWUFBYkMsTUFBYSx1RUFBSixFQUFJOztBQUFBOztBQUVuQ0MsZUFDS0MsSUFETCxDQUNVRixNQURWLEVBRUtHLE9BRkwsQ0FFYSxhQUFLOztBQUVWLGtCQUFLQyxDQUFMLElBQVUsY0FBS0EsQ0FBTCxFQUFRTCxRQUFRSyxDQUFSLENBQVIsRUFBb0JKLE9BQU9JLENBQVAsQ0FBcEIsQ0FBVjtBQUVILFNBTkw7QUFRSDs7OztrQ0FFU0MsQyxFQUFHO0FBQUE7O0FBRVQsbUJBQU8sSUFBSSxLQUFLQyxXQUFULENBQ0hMLE9BQ0NDLElBREQsQ0FDTSxJQUROLEVBRUNLLE1BRkQsQ0FFUSxVQUFDQyxDQUFELEVBQUlKLENBQUosRUFBVTtBQUNkSSxrQkFBRUosQ0FBRixJQUFPQyxFQUFFLE9BQUtELENBQUwsQ0FBRixDQUFQO0FBQ0EsdUJBQU9JLENBQVA7QUFDSCxhQUxELEVBS0dQLE9BQU9RLE1BQVAsQ0FBYyxJQUFkLENBTEgsQ0FERyxDQUFQO0FBUUg7Ozs7OztBQUlMOzs7Ozs7Ozs7QUFPTyxJQUFNQyxzQkFBTyxTQUFQQSxJQUFPLENBQUNDLElBQUQsRUFBcUI7QUFBQSxRQUFkVCxJQUFjLHVFQUFQLEVBQU87OztBQUVyQyxRQUFJLFFBQU9TLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBcEIsRUFDSSxNQUFNLElBQUlDLFNBQUoscURBQThERCxJQUE5RCx5Q0FBOERBLElBQTlELFVBQU47O0FBRUosUUFBSSxRQUFPVCxJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQXBCLEVBQ0ksTUFBTSxJQUFJVSxTQUFKLG1EQUE0RFYsSUFBNUQseUNBQTREQSxJQUE1RCxVQUFOOztBQUVKLFdBQU8sSUFBSVMsS0FBS0wsV0FBVCxDQUFxQixpQkFBTUssSUFBTixFQUFZVCxJQUFaLENBQXJCLENBQVA7QUFFSCxDQVZNIiwiZmlsZSI6IlR5cGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBob3BlIH0gZnJvbSAnLi9iZSc7XG5pbXBvcnQgeyBtZXJnZSB9IGZyb20gJy4vdXRpbCc7XG5cbi8qKlxuICogVHlwZSBpcyBhIGhlbHBlciBjbGFzcyBmb3Igc2ltdWxhdGluZyB1c2VyIHR5cGUgc3VwcG9ydFxuICogaW4gSmF2YVNjcmlwdCB2aWEgY2xhc3Nlcy5cbiAqIEBwYXJhbSB7b2JqZWN0fSBtZW1iZXJzIFRoaXMgb2JqZWN0J3Mgb3duIGVudW1lcmFibGUgcHJvcGVydGllcyBhcmUgYWRkZWQgdG9cbiAqIHRoZSB0eXBlLlxuICovXG5leHBvcnQgY2xhc3MgVHlwZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihtZW1iZXJzID0ge30sIGNoZWNrcyA9IHt9KSB7XG5cbiAgICAgICAgT2JqZWN0XG4gICAgICAgICAgICAua2V5cyhjaGVja3MpXG4gICAgICAgICAgICAuZm9yRWFjaChrID0+IHtcblxuICAgICAgICAgICAgICAgIHRoaXNba10gPSBob3BlKGssIG1lbWJlcnNba10sIGNoZWNrc1trXSk7XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgX19DTE9ORV9fKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IHRoaXMuY29uc3RydWN0b3IoXG4gICAgICAgICAgICBPYmplY3RcbiAgICAgICAgICAgIC5rZXlzKHRoaXMpXG4gICAgICAgICAgICAucmVkdWNlKChvLCBrKSA9PiB7XG4gICAgICAgICAgICAgICAgb1trXSA9IGYodGhpc1trXSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG87XG4gICAgICAgICAgICB9LCBPYmplY3QuY3JlYXRlKG51bGwpKSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBjb3B5IHRoZSBrZXlzIG9mIGEgVHlwZSBhbmQgYXNzaWduIHRoZW0gdG8gYSBuZXcgaW5zdGFuY2UuXG4gKiBAcGFyYW0ge1R5cGV9IHR5cGVcbiAqIEBwYXJhbSB7b2JqZWN0fSBrZXlzXG4gKiBAcmV0dXJuIHtUeXBlfVxuICogQHN1bW1hcnkgeyAoVHlwZSxPYmplY3QpIOKGkiAgVHlwZSB9XG4gKi9cbmV4cG9ydCBjb25zdCBjb3B5ID0gKHR5cGUsIGtleXMgPSB7fSkgPT4ge1xuXG4gICAgaWYgKHR5cGVvZiB0eXBlICE9PSAnb2JqZWN0JylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgY29weSgpOiB0eXBlIG11c3QgYmUgYW4gaW5zdGFuY2UgZ290ICcke3R5cGVvZiB0eXBlfSdgKTtcblxuICAgIGlmICh0eXBlb2Yga2V5cyAhPT0gJ29iamVjdCcpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYGNvcHkoKToga2V5cyBtdXN0IGJlIGFuIG9iamVjdCBnb3QgJyR7dHlwZW9mIGtleXN9J2ApXG5cbiAgICByZXR1cm4gbmV3IHR5cGUuY29uc3RydWN0b3IobWVyZ2UodHlwZSwga2V5cykpO1xuXG59XG4iXX0=
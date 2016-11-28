'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _DeadLetters = require('./DeadLetters');

var _DeadLetters2 = _interopRequireDefault(_DeadLetters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * NullReference is a reference that we could not resolve.
 */
var NullReference = function () {
    function NullReference(path, deadLetters) {
        _classCallCheck(this, NullReference);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ deadLetters: deadLetters }).instance(_DeadLetters2.default);

        this._path = path;
        this._deadLetters = deadLetters;
    }

    _createClass(NullReference, [{
        key: 'path',
        value: function path() {}
    }, {
        key: 'watch',
        value: function watch() {}
    }, {
        key: 'unwatch',
        value: function unwatch() {}
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this._deadLetters.tell({ to: this._path, message: message }, from);
        }
    }]);

    return NullReference;
}();

exports.default = NullReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9OdWxsUmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIk51bGxSZWZlcmVuY2UiLCJwYXRoIiwiZGVhZExldHRlcnMiLCJzdHJpbmciLCJpbnN0YW5jZSIsIl9wYXRoIiwiX2RlYWRMZXR0ZXJzIiwibWVzc2FnZSIsImZyb20iLCJ0ZWxsIiwidG8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7O0lBR01BLGE7QUFFRiwyQkFBWUMsSUFBWixFQUFrQkMsV0FBbEIsRUFBK0I7QUFBQTs7QUFFM0IsNEJBQUssRUFBRUQsVUFBRixFQUFMLEVBQWVFLE1BQWY7QUFDQSw0QkFBSyxFQUFFRCx3QkFBRixFQUFMLEVBQXNCRSxRQUF0Qjs7QUFFQSxhQUFLQyxLQUFMLEdBQWFKLElBQWI7QUFDQSxhQUFLSyxZQUFMLEdBQW9CSixXQUFwQjtBQUVIOzs7OytCQUVNLENBRU47OztnQ0FFTyxDQUVQOzs7a0NBRVMsQ0FFVDs7OzZCQUVJSyxPLEVBQVNDLEksRUFBTTs7QUFFaEIsaUJBQUtGLFlBQUwsQ0FBa0JHLElBQWxCLENBQXVCLEVBQUVDLElBQUksS0FBS0wsS0FBWCxFQUFrQkUsZ0JBQWxCLEVBQXZCLEVBQW9EQyxJQUFwRDtBQUVIOzs7Ozs7a0JBSVVSLGEiLCJmaWxlIjoiTnVsbFJlZmVyZW5jZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IERlYWRMZXR0ZXJzIGZyb20gJy4vRGVhZExldHRlcnMnO1xuXG4vKipcbiAqIE51bGxSZWZlcmVuY2UgaXMgYSByZWZlcmVuY2UgdGhhdCB3ZSBjb3VsZCBub3QgcmVzb2x2ZS5cbiAqL1xuY2xhc3MgTnVsbFJlZmVyZW5jZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBkZWFkTGV0dGVycykge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgZGVhZExldHRlcnMgfSkuaW5zdGFuY2UoRGVhZExldHRlcnMpO1xuXG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9kZWFkTGV0dGVycyA9IGRlYWRMZXR0ZXJzO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgIH1cblxuICAgIHdhdGNoKCkge1xuXG4gICAgfVxuXG4gICAgdW53YXRjaCgpIHtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuX2RlYWRMZXR0ZXJzLnRlbGwoeyB0bzogdGhpcy5fcGF0aCwgbWVzc2FnZSB9LCBmcm9tKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBOdWxsUmVmZXJlbmNlXG4iXX0=
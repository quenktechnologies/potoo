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

            this._deadLetters.tell(message, from);
        }
    }]);

    return NullReference;
}();

exports.default = NullReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9OdWxsUmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIk51bGxSZWZlcmVuY2UiLCJwYXRoIiwiZGVhZExldHRlcnMiLCJzdHJpbmciLCJpbnN0YW5jZSIsIl9wYXRoIiwiX2RlYWRMZXR0ZXJzIiwibWVzc2FnZSIsImZyb20iLCJ0ZWxsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztJQUdNQSxhO0FBRUYsMkJBQVlDLElBQVosRUFBa0JDLFdBQWxCLEVBQStCO0FBQUE7O0FBRTNCLDRCQUFLLEVBQUVELFVBQUYsRUFBTCxFQUFlRSxNQUFmO0FBQ0EsNEJBQUssRUFBRUQsd0JBQUYsRUFBTCxFQUFzQkUsUUFBdEI7O0FBRUEsYUFBS0MsS0FBTCxHQUFhSixJQUFiO0FBQ0EsYUFBS0ssWUFBTCxHQUFvQkosV0FBcEI7QUFFSDs7OzsrQkFFTSxDQUVOOzs7Z0NBRU8sQ0FFUDs7O2tDQUVTLENBRVQ7Ozs2QkFFSUssTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLRixZQUFMLENBQWtCRyxJQUFsQixDQUF1QkYsT0FBdkIsRUFBZ0NDLElBQWhDO0FBRUg7Ozs7OztrQkFJVVIsYSIsImZpbGUiOiJOdWxsUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgRGVhZExldHRlcnMgZnJvbSAnLi9EZWFkTGV0dGVycyc7XG5cbi8qKlxuICogTnVsbFJlZmVyZW5jZSBpcyBhIHJlZmVyZW5jZSB0aGF0IHdlIGNvdWxkIG5vdCByZXNvbHZlLlxuICovXG5jbGFzcyBOdWxsUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIGRlYWRMZXR0ZXJzKSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBkZWFkTGV0dGVycyB9KS5pbnN0YW5jZShEZWFkTGV0dGVycyk7XG5cbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX2RlYWRMZXR0ZXJzID0gZGVhZExldHRlcnM7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgfVxuXG4gICAgd2F0Y2goKSB7XG5cbiAgICB9XG5cbiAgICB1bndhdGNoKCkge1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy5fZGVhZExldHRlcnMudGVsbChtZXNzYWdlLCBmcm9tKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBOdWxsUmVmZXJlbmNlXG4iXX0=
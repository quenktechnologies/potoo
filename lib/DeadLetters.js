'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * DeadLetters is the catch all for messages that don't have a home.
 */
var DeadLetters = function () {
    function DeadLetters(system) {
        _classCallCheck(this, DeadLetters);

        (0, _beof2.default)({ system: system }).interface(_System2.default);

        this._system = system;
    }

    _createClass(DeadLetters, [{
        key: 'tell',
        value: function tell(message, from) {

            this._system.emit('bounce', message, from);
        }
    }]);

    return DeadLetters;
}();

exports.default = DeadLetters;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWFkTGV0dGVycy5qcyJdLCJuYW1lcyI6WyJEZWFkTGV0dGVycyIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJtZXNzYWdlIiwiZnJvbSIsImVtaXQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7O0lBR01BLFc7QUFFRix5QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUVoQiw0QkFBSyxFQUFFQSxjQUFGLEVBQUwsRUFBaUJDLFNBQWpCOztBQUVBLGFBQUtDLE9BQUwsR0FBZUYsTUFBZjtBQUVIOzs7OzZCQUVJRyxPLEVBQVNDLEksRUFBTTs7QUFFaEIsaUJBQUtGLE9BQUwsQ0FBYUcsSUFBYixDQUFrQixRQUFsQixFQUE0QkYsT0FBNUIsRUFBcUNDLElBQXJDO0FBRUg7Ozs7OztrQkFJVUwsVyIsImZpbGUiOiJEZWFkTGV0dGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5cbi8qKlxuICogRGVhZExldHRlcnMgaXMgdGhlIGNhdGNoIGFsbCBmb3IgbWVzc2FnZXMgdGhhdCBkb24ndCBoYXZlIGEgaG9tZS5cbiAqL1xuY2xhc3MgRGVhZExldHRlcnMge1xuXG4gICAgY29uc3RydWN0b3Ioc3lzdGVtKSB7XG5cbiAgICAgICAgYmVvZih7IHN5c3RlbSB9KS5pbnRlcmZhY2UoU3lzdGVtKTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0gPSBzeXN0ZW07XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0uZW1pdCgnYm91bmNlJywgbWVzc2FnZSwgZnJvbSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVhZExldHRlcnNcbiJdfQ==
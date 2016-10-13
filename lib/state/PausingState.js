'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _RefState2 = require('./RefState');

var _RefState3 = _interopRequireDefault(_RefState2);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _PausedState = require('./PausedState');

var _PausedState2 = _interopRequireDefault(_PausedState);

var _Ticker = require('./Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * PausingState
 */
var PausingState = function (_RefState) {
    _inherits(PausingState, _RefState);

    function PausingState() {
        _classCallCheck(this, PausingState);

        return _possibleConstructorReturn(this, (PausingState.__proto__ || Object.getPrototypeOf(PausingState)).apply(this, arguments));
    }

    _createClass(PausingState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Pausing;
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this2 = this;

            this._countdown = new _Ticker2.default(this._context.children().length, function (message, from) {
                return message === _Signal2.default.Paused && _this2._context.isChild(from);
            }, function (message, from) {
                return _this2._context.system().deadLetters().tell(message, from);
            }, function () {
                return _this2._context.dispatcher().execute(function (concern) {
                    return concern.onPause();
                }, function () {
                    return _this2._context.self().setState(new _PausedState2.default(_this2._context));
                });
            });

            this._context.children().forEach(function (child) {
                return child.self().tell(_Signal2.default.Pause, _this2._context.self());
            });
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this._countdown.tick(message, from);
        }
    }]);

    return PausingState;
}(_RefState3.default);

exports.default = PausingState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9QYXVzaW5nU3RhdGUuanMiXSwibmFtZXMiOlsiUGF1c2luZ1N0YXRlIiwiUGF1c2luZyIsIl9jb3VudGRvd24iLCJfY29udGV4dCIsImNoaWxkcmVuIiwibGVuZ3RoIiwibWVzc2FnZSIsImZyb20iLCJQYXVzZWQiLCJpc0NoaWxkIiwic3lzdGVtIiwiZGVhZExldHRlcnMiLCJ0ZWxsIiwiZGlzcGF0Y2hlciIsImV4ZWN1dGUiLCJjb25jZXJuIiwib25QYXVzZSIsInNlbGYiLCJzZXRTdGF0ZSIsImZvckVhY2giLCJjaGlsZCIsIlBhdXNlIiwidGljayJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLFk7Ozs7Ozs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPLGlCQUFPQyxPQUFkO0FBRUg7OzsrQkFFTTtBQUFBOztBQUVILGlCQUFLQyxVQUFMLEdBQWtCLHFCQUNkLEtBQUtDLFFBQUwsQ0FBY0MsUUFBZCxHQUF5QkMsTUFEWCxFQUVkLFVBQUNDLE9BQUQsRUFBVUMsSUFBVjtBQUFBLHVCQUFvQkQsWUFBWSxpQkFBT0UsTUFBcEIsSUFBZ0MsT0FBS0wsUUFBTCxDQUFjTSxPQUFkLENBQXNCRixJQUF0QixDQUFuRDtBQUFBLGFBRmMsRUFHZCxVQUFDRCxPQUFELEVBQVVDLElBQVY7QUFBQSx1QkFBbUIsT0FBS0osUUFBTCxDQUFjTyxNQUFkLEdBQXVCQyxXQUF2QixHQUFxQ0MsSUFBckMsQ0FBMENOLE9BQTFDLEVBQW1EQyxJQUFuRCxDQUFuQjtBQUFBLGFBSGMsRUFJZDtBQUFBLHVCQUFNLE9BQUtKLFFBQUwsQ0FBY1UsVUFBZCxHQUEyQkMsT0FBM0IsQ0FDRjtBQUFBLDJCQUFXQyxRQUFRQyxPQUFSLEVBQVg7QUFBQSxpQkFERSxFQUVGO0FBQUEsMkJBQU0sT0FBS2IsUUFBTCxDQUFjYyxJQUFkLEdBQXFCQyxRQUFyQixDQUE4QiwwQkFBZ0IsT0FBS2YsUUFBckIsQ0FBOUIsQ0FBTjtBQUFBLGlCQUZFLENBQU47QUFBQSxhQUpjLENBQWxCOztBQVFBLGlCQUFLQSxRQUFMLENBQWNDLFFBQWQsR0FDQWUsT0FEQSxDQUNRO0FBQUEsdUJBQ0pDLE1BQU1ILElBQU4sR0FBYUwsSUFBYixDQUFrQixpQkFBT1MsS0FBekIsRUFBZ0MsT0FBS2xCLFFBQUwsQ0FBY2MsSUFBZCxFQUFoQyxDQURJO0FBQUEsYUFEUjtBQUlIOzs7NkJBRUlYLE8sRUFBU0MsSSxFQUFNOztBQUVoQixpQkFBS0wsVUFBTCxDQUFnQm9CLElBQWhCLENBQXFCaEIsT0FBckIsRUFBOEJDLElBQTlCO0FBRUg7Ozs7OztrQkFJVVAsWSIsImZpbGUiOiJQYXVzaW5nU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgUmVmU3RhdGUgZnJvbSAnLi9SZWZTdGF0ZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBQYXVzZWRTdGF0ZSBmcm9tICcuL1BhdXNlZFN0YXRlJztcbmltcG9ydCBUaWNrZXIgZnJvbSAnLi9UaWNrZXInO1xuXG4vKipcbiAqIFBhdXNpbmdTdGF0ZVxuICovXG5jbGFzcyBQYXVzaW5nU3RhdGUgZXh0ZW5kcyBSZWZTdGF0ZSB7XG5cbiAgICBzaWduYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIFNpZ25hbC5QYXVzaW5nO1xuXG4gICAgfVxuXG4gICAgc3luYygpIHtcblxuICAgICAgICB0aGlzLl9jb3VudGRvd24gPSBuZXcgVGlja2VyKFxuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5jaGlsZHJlbigpLmxlbmd0aCxcbiAgICAgICAgICAgIChtZXNzYWdlLCBmcm9tKSA9PiAobWVzc2FnZSA9PT0gU2lnbmFsLlBhdXNlZCkgJiYgKHRoaXMuX2NvbnRleHQuaXNDaGlsZChmcm9tKSksXG4gICAgICAgICAgICAobWVzc2FnZSwgZnJvbSkgPT4gdGhpcy5fY29udGV4dC5zeXN0ZW0oKS5kZWFkTGV0dGVycygpLnRlbGwobWVzc2FnZSwgZnJvbSksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLl9jb250ZXh0LmRpc3BhdGNoZXIoKS5leGVjdXRlKFxuICAgICAgICAgICAgICAgIGNvbmNlcm4gPT4gY29uY2Vybi5vblBhdXNlKCksXG4gICAgICAgICAgICAgICAgKCkgPT4gdGhpcy5fY29udGV4dC5zZWxmKCkuc2V0U3RhdGUobmV3IFBhdXNlZFN0YXRlKHRoaXMuX2NvbnRleHQpKSkpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2hpbGRyZW4oKS5cbiAgICAgICAgZm9yRWFjaChjaGlsZCA9PlxuICAgICAgICAgICAgY2hpbGQuc2VsZigpLnRlbGwoU2lnbmFsLlBhdXNlLCB0aGlzLl9jb250ZXh0LnNlbGYoKSkpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy5fY291bnRkb3duLnRpY2sobWVzc2FnZSwgZnJvbSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF1c2luZ1N0YXRlXG4iXX0=
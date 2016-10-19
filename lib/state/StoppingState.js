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

var _StoppedState = require('./StoppedState');

var _StoppedState2 = _interopRequireDefault(_StoppedState);

var _Ticker = require('./Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * StoppingState
 */
var StoppingState = function (_RefState) {
    _inherits(StoppingState, _RefState);

    function StoppingState() {
        _classCallCheck(this, StoppingState);

        return _possibleConstructorReturn(this, (StoppingState.__proto__ || Object.getPrototypeOf(StoppingState)).apply(this, arguments));
    }

    _createClass(StoppingState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Stopping;
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this2 = this;

            this._countdown = new _Ticker2.default(this._context.children().length, function (message, from) {
                return message === _Signal2.default.Stopped && _this2._context.isChild(from);
            }, function (message, from) {
                return _this2._context.system().deadLetters().tell(message, from);
            }, function () {
                return _this2._context.dispatcher().execute(function (concern) {
                    return concern.onStop();
                }, function () {
                    return _this2._context.self().setState(new _StoppedState2.default(_this2._context));
                });
            });

            this._context.children().forEach(function (child) {
                return child.self().tell(_Signal2.default.Stop, _this2._context.self());
            });
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this._countdown.tick(message, from);
        }
    }, {
        key: 'ask',
        value: function ask(message, from) {

            this.tell(message, from);
            return _bluebird2.default.resolve();
        }
    }]);

    return StoppingState;
}(_RefState3.default);

exports.default = StoppingState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9TdG9wcGluZ1N0YXRlLmpzIl0sIm5hbWVzIjpbIlN0b3BwaW5nU3RhdGUiLCJTdG9wcGluZyIsIl9jb3VudGRvd24iLCJfY29udGV4dCIsImNoaWxkcmVuIiwibGVuZ3RoIiwibWVzc2FnZSIsImZyb20iLCJTdG9wcGVkIiwiaXNDaGlsZCIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwidGVsbCIsImRpc3BhdGNoZXIiLCJleGVjdXRlIiwiY29uY2VybiIsIm9uU3RvcCIsInNlbGYiLCJzZXRTdGF0ZSIsImZvckVhY2giLCJjaGlsZCIsIlN0b3AiLCJ0aWNrIiwicmVzb2x2ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLGE7Ozs7Ozs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPLGlCQUFPQyxRQUFkO0FBRUg7OzsrQkFFTTtBQUFBOztBQUVILGlCQUFLQyxVQUFMLEdBQWtCLHFCQUNkLEtBQUtDLFFBQUwsQ0FBY0MsUUFBZCxHQUF5QkMsTUFEWCxFQUVkLFVBQUNDLE9BQUQsRUFBVUMsSUFBVjtBQUFBLHVCQUFvQkQsWUFBWSxpQkFBT0UsT0FBcEIsSUFBaUMsT0FBS0wsUUFBTCxDQUFjTSxPQUFkLENBQXNCRixJQUF0QixDQUFwRDtBQUFBLGFBRmMsRUFHZCxVQUFDRCxPQUFELEVBQVVDLElBQVY7QUFBQSx1QkFBbUIsT0FBS0osUUFBTCxDQUFjTyxNQUFkLEdBQXVCQyxXQUF2QixHQUFxQ0MsSUFBckMsQ0FBMENOLE9BQTFDLEVBQW1EQyxJQUFuRCxDQUFuQjtBQUFBLGFBSGMsRUFJZDtBQUFBLHVCQUFNLE9BQUtKLFFBQUwsQ0FBY1UsVUFBZCxHQUEyQkMsT0FBM0IsQ0FDRjtBQUFBLDJCQUFXQyxRQUFRQyxNQUFSLEVBQVg7QUFBQSxpQkFERSxFQUVGO0FBQUEsMkJBQU0sT0FBS2IsUUFBTCxDQUFjYyxJQUFkLEdBQXFCQyxRQUFyQixDQUE4QiwyQkFBaUIsT0FBS2YsUUFBdEIsQ0FBOUIsQ0FBTjtBQUFBLGlCQUZFLENBQU47QUFBQSxhQUpjLENBQWxCOztBQVFBLGlCQUFLQSxRQUFMLENBQWNDLFFBQWQsR0FDQWUsT0FEQSxDQUNRO0FBQUEsdUJBQ0pDLE1BQU1ILElBQU4sR0FBYUwsSUFBYixDQUFrQixpQkFBT1MsSUFBekIsRUFBK0IsT0FBS2xCLFFBQUwsQ0FBY2MsSUFBZCxFQUEvQixDQURJO0FBQUEsYUFEUjtBQUlIOzs7NkJBRUlYLE8sRUFBU0MsSSxFQUFNOztBQUVoQixpQkFBS0wsVUFBTCxDQUFnQm9CLElBQWhCLENBQXFCaEIsT0FBckIsRUFBOEJDLElBQTlCO0FBRUg7Ozs0QkFHR0QsTyxFQUFTQyxJLEVBQU07O0FBRWYsaUJBQUtLLElBQUwsQ0FBVU4sT0FBVixFQUFtQkMsSUFBbkI7QUFDQSxtQkFBTyxtQkFBUWdCLE9BQVIsRUFBUDtBQUVIOzs7Ozs7a0JBSVV2QixhIiwiZmlsZSI6IlN0b3BwaW5nU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgUmVmU3RhdGUgZnJvbSAnLi9SZWZTdGF0ZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBTdG9wcGVkU3RhdGUgZnJvbSAnLi9TdG9wcGVkU3RhdGUnO1xuaW1wb3J0IFRpY2tlciBmcm9tICcuL1RpY2tlcic7XG5cbi8qKlxuICogU3RvcHBpbmdTdGF0ZVxuICovXG5jbGFzcyBTdG9wcGluZ1N0YXRlIGV4dGVuZHMgUmVmU3RhdGUge1xuXG4gICAgc2lnbmFsKCkge1xuXG4gICAgICAgIHJldHVybiBTaWduYWwuU3RvcHBpbmc7XG5cbiAgICB9XG5cbiAgICBzeW5jKCkge1xuXG4gICAgICAgIHRoaXMuX2NvdW50ZG93biA9IG5ldyBUaWNrZXIoXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LmNoaWxkcmVuKCkubGVuZ3RoLFxuICAgICAgICAgICAgKG1lc3NhZ2UsIGZyb20pID0+IChtZXNzYWdlID09PSBTaWduYWwuU3RvcHBlZCkgJiYgKHRoaXMuX2NvbnRleHQuaXNDaGlsZChmcm9tKSksXG4gICAgICAgICAgICAobWVzc2FnZSwgZnJvbSkgPT4gdGhpcy5fY29udGV4dC5zeXN0ZW0oKS5kZWFkTGV0dGVycygpLnRlbGwobWVzc2FnZSwgZnJvbSksXG4gICAgICAgICAgICAoKSA9PiB0aGlzLl9jb250ZXh0LmRpc3BhdGNoZXIoKS5leGVjdXRlKFxuICAgICAgICAgICAgICAgIGNvbmNlcm4gPT4gY29uY2Vybi5vblN0b3AoKSxcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLl9jb250ZXh0LnNlbGYoKS5zZXRTdGF0ZShuZXcgU3RvcHBlZFN0YXRlKHRoaXMuX2NvbnRleHQpKSkpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2hpbGRyZW4oKS5cbiAgICAgICAgZm9yRWFjaChjaGlsZCA9PlxuICAgICAgICAgICAgY2hpbGQuc2VsZigpLnRlbGwoU2lnbmFsLlN0b3AsIHRoaXMuX2NvbnRleHQuc2VsZigpKSk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLl9jb3VudGRvd24udGljayhtZXNzYWdlLCBmcm9tKTtcblxuICAgIH1cblxuXG4gICAgYXNrKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLnRlbGwobWVzc2FnZSwgZnJvbSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9wcGluZ1N0YXRlXG4iXX0=
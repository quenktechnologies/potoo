'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _RefState2 = require('./RefState');

var _RefState3 = _interopRequireDefault(_RefState2);

var _RunningState = require('./RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

var _Signal = require('./Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Ticker = require('./Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ResumingState
 */
var ResumingState = function (_RefState) {
    _inherits(ResumingState, _RefState);

    function ResumingState() {
        _classCallCheck(this, ResumingState);

        return _possibleConstructorReturn(this, (ResumingState.__proto__ || Object.getPrototypeOf(ResumingState)).apply(this, arguments));
    }

    _createClass(ResumingState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Resuming;
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this2 = this;

            this._countdown = new _Ticker2.default(this._context.children().length, function (message, from) {
                return message === _Signal2.default.Resumed && _this2._context.isChild(from);
            }, function (message, from) {
                return _this2._context.system().deadLetters().tell(message, from);
            }, function () {
                return _this2._context.dispatcher().execute(function (concern) {
                    return concern.onResume();
                }, function () {
                    return _this2._context.self().setState(new _RunningState2.default(_this2._context));
                });
            });

            this._context.children().forEach(function (child) {
                return child.self().tell(_Signal2.default.Resume, _this2._context.self());
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

    return ResumingState;
}(_RefState3.default);

exports.default = ResumingState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SZXN1bWluZ1N0YXRlLmpzIl0sIm5hbWVzIjpbIlJlc3VtaW5nU3RhdGUiLCJSZXN1bWluZyIsIl9jb3VudGRvd24iLCJfY29udGV4dCIsImNoaWxkcmVuIiwibGVuZ3RoIiwibWVzc2FnZSIsImZyb20iLCJSZXN1bWVkIiwiaXNDaGlsZCIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwidGVsbCIsImRpc3BhdGNoZXIiLCJleGVjdXRlIiwiY29uY2VybiIsIm9uUmVzdW1lIiwic2VsZiIsInNldFN0YXRlIiwiZm9yRWFjaCIsImNoaWxkIiwiUmVzdW1lIiwidGljayIsInJlc29sdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxhOzs7Ozs7Ozs7OztpQ0FFTzs7QUFFTCxtQkFBTyxpQkFBT0MsUUFBZDtBQUVIOzs7K0JBRU07QUFBQTs7QUFFSCxpQkFBS0MsVUFBTCxHQUFrQixxQkFDZCxLQUFLQyxRQUFMLENBQWNDLFFBQWQsR0FBeUJDLE1BRFgsRUFFZCxVQUFDQyxPQUFELEVBQVVDLElBQVY7QUFBQSx1QkFBb0JELFlBQVksaUJBQU9FLE9BQXBCLElBQWlDLE9BQUtMLFFBQUwsQ0FBY00sT0FBZCxDQUFzQkYsSUFBdEIsQ0FBcEQ7QUFBQSxhQUZjLEVBR2QsVUFBQ0QsT0FBRCxFQUFVQyxJQUFWO0FBQUEsdUJBQW1CLE9BQUtKLFFBQUwsQ0FBY08sTUFBZCxHQUF1QkMsV0FBdkIsR0FBcUNDLElBQXJDLENBQTBDTixPQUExQyxFQUFtREMsSUFBbkQsQ0FBbkI7QUFBQSxhQUhjLEVBSWQ7QUFBQSx1QkFBTSxPQUFLSixRQUFMLENBQWNVLFVBQWQsR0FBMkJDLE9BQTNCLENBQ0Y7QUFBQSwyQkFBV0MsUUFBUUMsUUFBUixFQUFYO0FBQUEsaUJBREUsRUFFRjtBQUFBLDJCQUFNLE9BQUtiLFFBQUwsQ0FBY2MsSUFBZCxHQUFxQkMsUUFBckIsQ0FBOEIsMkJBQWlCLE9BQUtmLFFBQXRCLENBQTlCLENBQU47QUFBQSxpQkFGRSxDQUFOO0FBQUEsYUFKYyxDQUFsQjs7QUFRQSxpQkFBS0EsUUFBTCxDQUFjQyxRQUFkLEdBQ0FlLE9BREEsQ0FDUTtBQUFBLHVCQUNKQyxNQUFNSCxJQUFOLEdBQWFMLElBQWIsQ0FBa0IsaUJBQU9TLE1BQXpCLEVBQWlDLE9BQUtsQixRQUFMLENBQWNjLElBQWQsRUFBakMsQ0FESTtBQUFBLGFBRFI7QUFJSDs7OzZCQUVJWCxPLEVBQVNDLEksRUFBTTs7QUFFaEIsaUJBQUtMLFVBQUwsQ0FBZ0JvQixJQUFoQixDQUFxQmhCLE9BQXJCLEVBQThCQyxJQUE5QjtBQUVIOzs7NEJBRUdELE8sRUFBU0MsSSxFQUFNOztBQUVmLGlCQUFLSyxJQUFMLENBQVVOLE9BQVYsRUFBbUJDLElBQW5CO0FBQ0EsbUJBQU8sbUJBQVFnQixPQUFSLEVBQVA7QUFFSDs7Ozs7O2tCQUlVdkIsYSIsImZpbGUiOiJSZXN1bWluZ1N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFJlZlN0YXRlIGZyb20gJy4vUmVmU3RhdGUnO1xuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL1J1bm5pbmdTdGF0ZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBUaWNrZXIgZnJvbSAnLi9UaWNrZXInO1xuXG4vKipcbiAqIFJlc3VtaW5nU3RhdGVcbiAqL1xuY2xhc3MgUmVzdW1pbmdTdGF0ZSBleHRlbmRzIFJlZlN0YXRlIHtcblxuICAgIHNpZ25hbCgpIHtcblxuICAgICAgICByZXR1cm4gU2lnbmFsLlJlc3VtaW5nO1xuXG4gICAgfVxuXG4gICAgc3luYygpIHtcblxuICAgICAgICB0aGlzLl9jb3VudGRvd24gPSBuZXcgVGlja2VyKFxuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5jaGlsZHJlbigpLmxlbmd0aCxcbiAgICAgICAgICAgIChtZXNzYWdlLCBmcm9tKSA9PiAobWVzc2FnZSA9PT0gU2lnbmFsLlJlc3VtZWQpICYmICh0aGlzLl9jb250ZXh0LmlzQ2hpbGQoZnJvbSkpLFxuICAgICAgICAgICAgKG1lc3NhZ2UsIGZyb20pID0+IHRoaXMuX2NvbnRleHQuc3lzdGVtKCkuZGVhZExldHRlcnMoKS50ZWxsKG1lc3NhZ2UsIGZyb20pLFxuICAgICAgICAgICAgKCkgPT4gdGhpcy5fY29udGV4dC5kaXNwYXRjaGVyKCkuZXhlY3V0ZShcbiAgICAgICAgICAgICAgICBjb25jZXJuID0+IGNvbmNlcm4ub25SZXN1bWUoKSxcbiAgICAgICAgICAgICAgICAoKSA9PiB0aGlzLl9jb250ZXh0LnNlbGYoKS5zZXRTdGF0ZShuZXcgUnVubmluZ1N0YXRlKHRoaXMuX2NvbnRleHQpKSkpO1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQuY2hpbGRyZW4oKS5cbiAgICAgICAgZm9yRWFjaChjaGlsZCA9PlxuICAgICAgICAgICAgY2hpbGQuc2VsZigpLnRlbGwoU2lnbmFsLlJlc3VtZSwgdGhpcy5fY29udGV4dC5zZWxmKCkpKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuX2NvdW50ZG93bi50aWNrKG1lc3NhZ2UsIGZyb20pO1xuXG4gICAgfVxuXG4gICAgYXNrKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLnRlbGwobWVzc2FnZSwgZnJvbSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXN1bWluZ1N0YXRlXG4iXX0=
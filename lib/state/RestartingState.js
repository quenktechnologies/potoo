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

var _Ticker = require('./Ticker');

var _Ticker2 = _interopRequireDefault(_Ticker);

var _RunningState = require('./RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * RestartingState
 */
var RestartingState = function (_RefState) {
    _inherits(RestartingState, _RefState);

    function RestartingState() {
        _classCallCheck(this, RestartingState);

        return _possibleConstructorReturn(this, (RestartingState.__proto__ || Object.getPrototypeOf(RestartingState)).apply(this, arguments));
    }

    _createClass(RestartingState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Restarting;
        }
    }, {
        key: 'sync',
        value: function sync() {
            var _this2 = this;

            this._countdown = new _Ticker2.default(this._context.children().length, function (message, from) {
                return message === _Signal2.default.Restarted && _this2._context.isChild(from);
            }, function (message, from) {
                return _this2._context.system().deadLetters().tell(message, from);
            }, function () {
                return _this2._context.dispatcher().execute(function (concern) {
                    return concern.onRestart();
                }, function () {
                    return _this2._context.self().setState(new _RunningState2.default(_this2._context));
                });
            });

            this._context.children().forEach(function (child) {
                return child.self().tell(_Signal2.default.Restart, _this2._context.self());
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

    return RestartingState;
}(_RefState3.default);

exports.default = RestartingState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SZXN0YXJ0aW5nU3RhdGUuanMiXSwibmFtZXMiOlsiUmVzdGFydGluZ1N0YXRlIiwiUmVzdGFydGluZyIsIl9jb3VudGRvd24iLCJfY29udGV4dCIsImNoaWxkcmVuIiwibGVuZ3RoIiwibWVzc2FnZSIsImZyb20iLCJSZXN0YXJ0ZWQiLCJpc0NoaWxkIiwic3lzdGVtIiwiZGVhZExldHRlcnMiLCJ0ZWxsIiwiZGlzcGF0Y2hlciIsImV4ZWN1dGUiLCJjb25jZXJuIiwib25SZXN0YXJ0Iiwic2VsZiIsInNldFN0YXRlIiwiZm9yRWFjaCIsImNoaWxkIiwiUmVzdGFydCIsInRpY2siLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHTUEsZTs7Ozs7Ozs7Ozs7aUNBRU87O0FBRUwsbUJBQU8saUJBQU9DLFVBQWQ7QUFFSDs7OytCQUVNO0FBQUE7O0FBR0gsaUJBQUtDLFVBQUwsR0FBa0IscUJBQ2QsS0FBS0MsUUFBTCxDQUFjQyxRQUFkLEdBQXlCQyxNQURYLEVBRWQsVUFBQ0MsT0FBRCxFQUFVQyxJQUFWO0FBQUEsdUJBQW9CRCxZQUFZLGlCQUFPRSxTQUFwQixJQUFtQyxPQUFLTCxRQUFMLENBQWNNLE9BQWQsQ0FBc0JGLElBQXRCLENBQXREO0FBQUEsYUFGYyxFQUdkLFVBQUNELE9BQUQsRUFBVUMsSUFBVjtBQUFBLHVCQUFtQixPQUFLSixRQUFMLENBQWNPLE1BQWQsR0FBdUJDLFdBQXZCLEdBQXFDQyxJQUFyQyxDQUEwQ04sT0FBMUMsRUFBbURDLElBQW5ELENBQW5CO0FBQUEsYUFIYyxFQUlkO0FBQUEsdUJBQU0sT0FBS0osUUFBTCxDQUFjVSxVQUFkLEdBQTJCQyxPQUEzQixDQUNGO0FBQUEsMkJBQVdDLFFBQVFDLFNBQVIsRUFBWDtBQUFBLGlCQURFLEVBRUY7QUFBQSwyQkFBTSxPQUFLYixRQUFMLENBQWNjLElBQWQsR0FBcUJDLFFBQXJCLENBQThCLDJCQUFpQixPQUFLZixRQUF0QixDQUE5QixDQUFOO0FBQUEsaUJBRkUsQ0FBTjtBQUFBLGFBSmMsQ0FBbEI7O0FBUUEsaUJBQUtBLFFBQUwsQ0FBY0MsUUFBZCxHQUNBZSxPQURBLENBQ1E7QUFBQSx1QkFDSkMsTUFBTUgsSUFBTixHQUFhTCxJQUFiLENBQWtCLGlCQUFPUyxPQUF6QixFQUFrQyxPQUFLbEIsUUFBTCxDQUFjYyxJQUFkLEVBQWxDLENBREk7QUFBQSxhQURSO0FBSUg7Ozs2QkFFSVgsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLTCxVQUFMLENBQWdCb0IsSUFBaEIsQ0FBcUJoQixPQUFyQixFQUE4QkMsSUFBOUI7QUFFSDs7OzRCQUVHRCxPLEVBQVNDLEksRUFBTTs7QUFFZixpQkFBS0ssSUFBTCxDQUFVTixPQUFWLEVBQW1CQyxJQUFuQjtBQUNBLG1CQUFPLG1CQUFRZ0IsT0FBUixFQUFQO0FBRUg7Ozs7OztrQkFJVXZCLGUiLCJmaWxlIjoiUmVzdGFydGluZ1N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFJlZlN0YXRlIGZyb20gJy4vUmVmU3RhdGUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgVGlja2VyIGZyb20gJy4vVGlja2VyJztcbmltcG9ydCBSdW5uaW5nU3RhdGUgZnJvbSAnLi9SdW5uaW5nU3RhdGUnO1xuXG4vKipcbiAqIFJlc3RhcnRpbmdTdGF0ZVxuICovXG5jbGFzcyBSZXN0YXJ0aW5nU3RhdGUgZXh0ZW5kcyBSZWZTdGF0ZSB7XG5cbiAgICBzaWduYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIFNpZ25hbC5SZXN0YXJ0aW5nO1xuXG4gICAgfVxuXG4gICAgc3luYygpIHtcblxuXG4gICAgICAgIHRoaXMuX2NvdW50ZG93biA9IG5ldyBUaWNrZXIoXG4gICAgICAgICAgICB0aGlzLl9jb250ZXh0LmNoaWxkcmVuKCkubGVuZ3RoLFxuICAgICAgICAgICAgKG1lc3NhZ2UsIGZyb20pID0+IChtZXNzYWdlID09PSBTaWduYWwuUmVzdGFydGVkKSAmJiAodGhpcy5fY29udGV4dC5pc0NoaWxkKGZyb20pKSxcbiAgICAgICAgICAgIChtZXNzYWdlLCBmcm9tKSA9PiB0aGlzLl9jb250ZXh0LnN5c3RlbSgpLmRlYWRMZXR0ZXJzKCkudGVsbChtZXNzYWdlLCBmcm9tKSxcbiAgICAgICAgICAgICgpID0+IHRoaXMuX2NvbnRleHQuZGlzcGF0Y2hlcigpLmV4ZWN1dGUoXG4gICAgICAgICAgICAgICAgY29uY2VybiA9PiBjb25jZXJuLm9uUmVzdGFydCgpLFxuICAgICAgICAgICAgICAgICgpID0+IHRoaXMuX2NvbnRleHQuc2VsZigpLnNldFN0YXRlKG5ldyBSdW5uaW5nU3RhdGUodGhpcy5fY29udGV4dCkpKSk7XG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5jaGlsZHJlbigpLlxuICAgICAgICBmb3JFYWNoKGNoaWxkID0+XG4gICAgICAgICAgICBjaGlsZC5zZWxmKCkudGVsbChTaWduYWwuUmVzdGFydCwgdGhpcy5fY29udGV4dC5zZWxmKCkpKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuX2NvdW50ZG93bi50aWNrKG1lc3NhZ2UsIGZyb20pO1xuXG4gICAgfVxuXG4gICAgYXNrKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLnRlbGwobWVzc2FnZSwgZnJvbSk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZXN0YXJ0aW5nU3RhdGVcbiJdfQ==
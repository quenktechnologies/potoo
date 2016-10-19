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

var _PausingState = require('./PausingState');

var _PausingState2 = _interopRequireDefault(_PausingState);

var _RestartingState = require('./RestartingState');

var _RestartingState2 = _interopRequireDefault(_RestartingState);

var _StoppingState = require('./StoppingState');

var _StoppingState2 = _interopRequireDefault(_StoppingState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * RunningState
 */
var RunningState = function (_RefState) {
    _inherits(RunningState, _RefState);

    function RunningState() {
        _classCallCheck(this, RunningState);

        return _possibleConstructorReturn(this, (RunningState.__proto__ || Object.getPrototypeOf(RunningState)).apply(this, arguments));
    }

    _createClass(RunningState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Running;
        }
    }, {
        key: 'pause',
        value: function pause() {

            return new _PausingState2.default(this._context);
        }
    }, {
        key: 'restart',
        value: function restart() {

            return new _RestartingState2.default(this._context);
        }
    }, {
        key: 'stop',
        value: function stop() {

            return new _StoppingState2.default(this._context);
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this._context.mailbox().enqueue({ message: message, from: from });
        }
    }, {
        key: 'ask',
        value: function ask(message, from) {

            return new _bluebird2.default(function (resolve, reject) {

                this._context.mailbox().enqueue({ message: message, from: from, resolve: resolve, reject: reject });
            });
        }
    }]);

    return RunningState;
}(_RefState3.default);

exports.default = RunningState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SdW5uaW5nU3RhdGUuanMiXSwibmFtZXMiOlsiUnVubmluZ1N0YXRlIiwiUnVubmluZyIsIl9jb250ZXh0IiwibWVzc2FnZSIsImZyb20iLCJtYWlsYm94IiwiZW5xdWV1ZSIsInJlc29sdmUiLCJyZWplY3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLFk7Ozs7Ozs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPLGlCQUFPQyxPQUFkO0FBRUg7OztnQ0FFTzs7QUFFSixtQkFBTywyQkFBaUIsS0FBS0MsUUFBdEIsQ0FBUDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sOEJBQW9CLEtBQUtBLFFBQXpCLENBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLDRCQUFrQixLQUFLQSxRQUF2QixDQUFQO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLRixRQUFMLENBQWNHLE9BQWQsR0FBd0JDLE9BQXhCLENBQWdDLEVBQUVILGdCQUFGLEVBQVdDLFVBQVgsRUFBaEM7QUFFSDs7OzRCQUVHRCxPLEVBQVNDLEksRUFBTTs7QUFFZixtQkFBTyx1QkFBWSxVQUFTRyxPQUFULEVBQWtCQyxNQUFsQixFQUEwQjs7QUFFekMscUJBQUtOLFFBQUwsQ0FBY0csT0FBZCxHQUF3QkMsT0FBeEIsQ0FBZ0MsRUFBRUgsZ0JBQUYsRUFBV0MsVUFBWCxFQUFpQkcsZ0JBQWpCLEVBQTBCQyxjQUExQixFQUFoQztBQUVILGFBSk0sQ0FBUDtBQU9IOzs7Ozs7a0JBSVVSLFkiLCJmaWxlIjoiUnVubmluZ1N0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFJlZlN0YXRlIGZyb20gJy4vUmVmU3RhdGUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgUGF1c2luZ1N0YXRlIGZyb20gJy4vUGF1c2luZ1N0YXRlJztcbmltcG9ydCBSZXN0YXJ0aW5nU3RhdGUgZnJvbSAnLi9SZXN0YXJ0aW5nU3RhdGUnO1xuaW1wb3J0IFN0b3BwaW5nU3RhdGUgZnJvbSAnLi9TdG9wcGluZ1N0YXRlJztcblxuLyoqXG4gKiBSdW5uaW5nU3RhdGVcbiAqL1xuY2xhc3MgUnVubmluZ1N0YXRlIGV4dGVuZHMgUmVmU3RhdGUge1xuXG4gICAgc2lnbmFsKCkge1xuXG4gICAgICAgIHJldHVybiBTaWduYWwuUnVubmluZztcblxuICAgIH1cblxuICAgIHBhdXNlKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUGF1c2luZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgcmVzdGFydCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlc3RhcnRpbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHN0b3AoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdG9wcGluZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5tYWlsYm94KCkuZW5xdWV1ZSh7IG1lc3NhZ2UsIGZyb20gfSk7XG5cbiAgICB9XG5cbiAgICBhc2sobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgICAgICAgdGhpcy5fY29udGV4dC5tYWlsYm94KCkuZW5xdWV1ZSh7IG1lc3NhZ2UsIGZyb20sIHJlc29sdmUsIHJlamVjdCB9KTtcblxuICAgICAgICB9KTtcblxuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bm5pbmdTdGF0ZVxuIl19
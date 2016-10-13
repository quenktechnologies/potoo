'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RefState2 = require('./RefState');

var _RefState3 = _interopRequireDefault(_RefState2);

var _RestartingState = require('./RestartingState');

var _RestartingState2 = _interopRequireDefault(_RestartingState);

var _ResumingState = require('./ResumingState');

var _ResumingState2 = _interopRequireDefault(_ResumingState);

var _StoppingState = require('./StoppingState');

var _StoppingState2 = _interopRequireDefault(_StoppingState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * PausedState
 */
var PausedState = function (_RefState) {
    _inherits(PausedState, _RefState);

    function PausedState() {
        _classCallCheck(this, PausedState);

        return _possibleConstructorReturn(this, (PausedState.__proto__ || Object.getPrototypeOf(PausedState)).apply(this, arguments));
    }

    _createClass(PausedState, [{
        key: 'signal',
        value: function signal() {

            return Signal.Paused;
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
        key: 'resume',
        value: function resume() {

            return new _ResumingState2.default(this._context);
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this._context.mailbox().enqueue({ message: message, from: from });
        }
    }]);

    return PausedState;
}(_RefState3.default);

exports.default = PausedState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9QYXVzZWRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJQYXVzZWRTdGF0ZSIsIlNpZ25hbCIsIlBhdXNlZCIsIl9jb250ZXh0IiwibWVzc2FnZSIsImZyb20iLCJtYWlsYm94IiwiZW5xdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxXOzs7Ozs7Ozs7OztpQ0FFTzs7QUFFTCxtQkFBT0MsT0FBT0MsTUFBZDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sOEJBQW9CLEtBQUtDLFFBQXpCLENBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLDRCQUFrQixLQUFLQSxRQUF2QixDQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyw0QkFBa0IsS0FBS0EsUUFBdkIsQ0FBUDtBQUVIOzs7NkJBRUlDLE8sRUFBU0MsSSxFQUFNOztBQUVoQixpQkFBS0YsUUFBTCxDQUFjRyxPQUFkLEdBQXdCQyxPQUF4QixDQUFnQyxFQUFDSCxnQkFBRCxFQUFVQyxVQUFWLEVBQWhDO0FBRUg7Ozs7OztrQkFJVUwsVyIsImZpbGUiOiJQYXVzZWRTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWZTdGF0ZSBmcm9tICcuL1JlZlN0YXRlJztcbmltcG9ydCBSZXN0YXJ0aW5nU3RhdGUgZnJvbSAnLi9SZXN0YXJ0aW5nU3RhdGUnO1xuaW1wb3J0IFJlc3VtaW5nU3RhdGUgZnJvbSAnLi9SZXN1bWluZ1N0YXRlJztcbmltcG9ydCBTdG9wcGluZ1N0YXRlIGZyb20gJy4vU3RvcHBpbmdTdGF0ZSc7XG5cbi8qKlxuICogUGF1c2VkU3RhdGVcbiAqL1xuY2xhc3MgUGF1c2VkU3RhdGUgZXh0ZW5kcyBSZWZTdGF0ZSB7XG5cbiAgICBzaWduYWwoKSB7XG5cbiAgICAgICAgcmV0dXJuIFNpZ25hbC5QYXVzZWQ7XG5cbiAgICB9XG5cbiAgICByZXN0YXJ0KCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVzdGFydGluZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgc3RvcCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0b3BwaW5nU3RhdGUodGhpcy5fY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXN1bWluZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy5fY29udGV4dC5tYWlsYm94KCkuZW5xdWV1ZSh7bWVzc2FnZSwgZnJvbX0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhdXNlZFN0YXRlXG4iXX0=
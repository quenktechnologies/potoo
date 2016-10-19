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

            return _Signal2.default.Paused;
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
    }, {
        key: 'ask',
        value: function ask(message, from) {

            this.tell(message, from);
            return _bluebird2.default.resolve();
        }
    }]);

    return PausedState;
}(_RefState3.default);

exports.default = PausedState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9QYXVzZWRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJQYXVzZWRTdGF0ZSIsIlBhdXNlZCIsIl9jb250ZXh0IiwibWVzc2FnZSIsImZyb20iLCJtYWlsYm94IiwiZW5xdWV1ZSIsInRlbGwiLCJyZXNvbHZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxXOzs7Ozs7Ozs7OztpQ0FFTzs7QUFFTCxtQkFBTyxpQkFBT0MsTUFBZDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sOEJBQW9CLEtBQUtDLFFBQXpCLENBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLDRCQUFrQixLQUFLQSxRQUF2QixDQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyw0QkFBa0IsS0FBS0EsUUFBdkIsQ0FBUDtBQUVIOzs7NkJBRUlDLE8sRUFBU0MsSSxFQUFNOztBQUVoQixpQkFBS0YsUUFBTCxDQUFjRyxPQUFkLEdBQXdCQyxPQUF4QixDQUFnQyxFQUFFSCxnQkFBRixFQUFXQyxVQUFYLEVBQWhDO0FBRUg7Ozs0QkFFR0QsTyxFQUFTQyxJLEVBQU07O0FBRWYsaUJBQUtHLElBQUwsQ0FBVUosT0FBVixFQUFtQkMsSUFBbkI7QUFDQSxtQkFBTyxtQkFBUUksT0FBUixFQUFQO0FBRUg7Ozs7OztrQkFJVVIsVyIsImZpbGUiOiJQYXVzZWRTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBSZWZTdGF0ZSBmcm9tICcuL1JlZlN0YXRlJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFJlc3RhcnRpbmdTdGF0ZSBmcm9tICcuL1Jlc3RhcnRpbmdTdGF0ZSc7XG5pbXBvcnQgUmVzdW1pbmdTdGF0ZSBmcm9tICcuL1Jlc3VtaW5nU3RhdGUnO1xuaW1wb3J0IFN0b3BwaW5nU3RhdGUgZnJvbSAnLi9TdG9wcGluZ1N0YXRlJztcblxuLyoqXG4gKiBQYXVzZWRTdGF0ZVxuICovXG5jbGFzcyBQYXVzZWRTdGF0ZSBleHRlbmRzIFJlZlN0YXRlIHtcblxuICAgIHNpZ25hbCgpIHtcblxuICAgICAgICByZXR1cm4gU2lnbmFsLlBhdXNlZDtcblxuICAgIH1cblxuICAgIHJlc3RhcnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXN0YXJ0aW5nU3RhdGUodGhpcy5fY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBzdG9wKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RvcHBpbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlc3VtaW5nU3RhdGUodGhpcy5fY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UsIGZyb20pIHtcblxuICAgICAgICB0aGlzLl9jb250ZXh0Lm1haWxib3goKS5lbnF1ZXVlKHsgbWVzc2FnZSwgZnJvbSB9KTtcblxuICAgIH1cblxuICAgIGFzayhtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy50ZWxsKG1lc3NhZ2UsIGZyb20pO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGF1c2VkU3RhdGVcbiJdfQ==
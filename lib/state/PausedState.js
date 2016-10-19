'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    }]);

    return PausedState;
}(_RefState3.default);

exports.default = PausedState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9QYXVzZWRTdGF0ZS5qcyJdLCJuYW1lcyI6WyJQYXVzZWRTdGF0ZSIsIlBhdXNlZCIsIl9jb250ZXh0IiwibWVzc2FnZSIsImZyb20iLCJtYWlsYm94IiwiZW5xdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLFc7Ozs7Ozs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPLGlCQUFPQyxNQUFkO0FBRUg7OztrQ0FFUzs7QUFFTixtQkFBTyw4QkFBb0IsS0FBS0MsUUFBekIsQ0FBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sNEJBQWtCLEtBQUtBLFFBQXZCLENBQVA7QUFFSDs7O2lDQUVROztBQUVMLG1CQUFPLDRCQUFrQixLQUFLQSxRQUF2QixDQUFQO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLRixRQUFMLENBQWNHLE9BQWQsR0FBd0JDLE9BQXhCLENBQWdDLEVBQUNILGdCQUFELEVBQVVDLFVBQVYsRUFBaEM7QUFFSDs7Ozs7O2tCQUlVSixXIiwiZmlsZSI6IlBhdXNlZFN0YXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlZlN0YXRlIGZyb20gJy4vUmVmU3RhdGUnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL1NpZ25hbCc7XG5pbXBvcnQgUmVzdGFydGluZ1N0YXRlIGZyb20gJy4vUmVzdGFydGluZ1N0YXRlJztcbmltcG9ydCBSZXN1bWluZ1N0YXRlIGZyb20gJy4vUmVzdW1pbmdTdGF0ZSc7XG5pbXBvcnQgU3RvcHBpbmdTdGF0ZSBmcm9tICcuL1N0b3BwaW5nU3RhdGUnO1xuXG4vKipcbiAqIFBhdXNlZFN0YXRlXG4gKi9cbmNsYXNzIFBhdXNlZFN0YXRlIGV4dGVuZHMgUmVmU3RhdGUge1xuXG4gICAgc2lnbmFsKCkge1xuXG4gICAgICAgIHJldHVybiBTaWduYWwuUGF1c2VkO1xuXG4gICAgfVxuXG4gICAgcmVzdGFydCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlc3RhcnRpbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHN0b3AoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdG9wcGluZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVzdW1pbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQubWFpbGJveCgpLmVucXVldWUoe21lc3NhZ2UsIGZyb219KTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXVzZWRTdGF0ZVxuIl19
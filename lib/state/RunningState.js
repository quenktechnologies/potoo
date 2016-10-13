'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

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
    }]);

    return RunningState;
}(_RefState3.default);

exports.default = RunningState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9SdW5uaW5nU3RhdGUuanMiXSwibmFtZXMiOlsiUnVubmluZ1N0YXRlIiwiUnVubmluZyIsIl9jb250ZXh0IiwibWVzc2FnZSIsImZyb20iLCJtYWlsYm94IiwiZW5xdWV1ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLFk7Ozs7Ozs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPLGlCQUFPQyxPQUFkO0FBRUg7OztnQ0FFTzs7QUFFSixtQkFBTywyQkFBaUIsS0FBS0MsUUFBdEIsQ0FBUDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sOEJBQW9CLEtBQUtBLFFBQXpCLENBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLDRCQUFrQixLQUFLQSxRQUF2QixDQUFQO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLRixRQUFMLENBQWNHLE9BQWQsR0FBd0JDLE9BQXhCLENBQWdDLEVBQUVILGdCQUFGLEVBQVdDLFVBQVgsRUFBaEM7QUFFSDs7Ozs7O2tCQUlVSixZIiwiZmlsZSI6IlJ1bm5pbmdTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWZTdGF0ZSBmcm9tICcuL1JlZlN0YXRlJztcbmltcG9ydCBTaWduYWwgZnJvbSAnLi9TaWduYWwnO1xuaW1wb3J0IFBhdXNpbmdTdGF0ZSBmcm9tICcuL1BhdXNpbmdTdGF0ZSc7XG5pbXBvcnQgUmVzdGFydGluZ1N0YXRlIGZyb20gJy4vUmVzdGFydGluZ1N0YXRlJztcbmltcG9ydCBTdG9wcGluZ1N0YXRlIGZyb20gJy4vU3RvcHBpbmdTdGF0ZSc7XG5cbi8qKlxuICogUnVubmluZ1N0YXRlXG4gKi9cbmNsYXNzIFJ1bm5pbmdTdGF0ZSBleHRlbmRzIFJlZlN0YXRlIHtcblxuICAgIHNpZ25hbCgpIHtcblxuICAgICAgICByZXR1cm4gU2lnbmFsLlJ1bm5pbmc7XG5cbiAgICB9XG5cbiAgICBwYXVzZSgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFBhdXNpbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHJlc3RhcnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXN0YXJ0aW5nU3RhdGUodGhpcy5fY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBzdG9wKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RvcHBpbmdTdGF0ZSh0aGlzLl9jb250ZXh0KTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuX2NvbnRleHQubWFpbGJveCgpLmVucXVldWUoeyBtZXNzYWdlLCBmcm9tIH0pO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFJ1bm5pbmdTdGF0ZVxuIl19
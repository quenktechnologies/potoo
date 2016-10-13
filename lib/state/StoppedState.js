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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * StoppedState means the Concern is stopped and will process no
 * more messages.
 */
var StoppedState = function (_RefState) {
    _inherits(StoppedState, _RefState);

    function StoppedState() {
        _classCallCheck(this, StoppedState);

        return _possibleConstructorReturn(this, (StoppedState.__proto__ || Object.getPrototypeOf(StoppedState)).apply(this, arguments));
    }

    _createClass(StoppedState, [{
        key: 'signal',
        value: function signal() {

            return _Signal2.default.Stopped;
        }
    }, {
        key: 'restart',
        value: function restart() {

            return new _RestartingState2.default(this._context);
        }
    }]);

    return StoppedState;
}(_RefState3.default);

exports.default = StoppedState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9TdG9wcGVkU3RhdGUuanMiXSwibmFtZXMiOlsiU3RvcHBlZFN0YXRlIiwiU3RvcHBlZCIsIl9jb250ZXh0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7SUFJTUEsWTs7Ozs7Ozs7Ozs7aUNBRU87O0FBRUwsbUJBQU8saUJBQU9DLE9BQWQ7QUFFSDs7O2tDQUVTOztBQUVOLG1CQUFPLDhCQUFvQixLQUFLQyxRQUF6QixDQUFQO0FBRUg7Ozs7OztrQkFJVUYsWSIsImZpbGUiOiJTdG9wcGVkU3RhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVmU3RhdGUgZnJvbSAnLi9SZWZTdGF0ZSc7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4vU2lnbmFsJztcbmltcG9ydCBSZXN0YXJ0aW5nU3RhdGUgZnJvbSAnLi9SZXN0YXJ0aW5nU3RhdGUnO1xuXG4vKipcbiAqIFN0b3BwZWRTdGF0ZSBtZWFucyB0aGUgQ29uY2VybiBpcyBzdG9wcGVkIGFuZCB3aWxsIHByb2Nlc3Mgbm9cbiAqIG1vcmUgbWVzc2FnZXMuXG4gKi9cbmNsYXNzIFN0b3BwZWRTdGF0ZSBleHRlbmRzIFJlZlN0YXRlIHtcblxuICAgIHNpZ25hbCgpIHtcblxuICAgICAgICByZXR1cm4gU2lnbmFsLlN0b3BwZWQ7XG5cbiAgICB9XG5cbiAgICByZXN0YXJ0KCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVzdGFydGluZ1N0YXRlKHRoaXMuX2NvbnRleHQpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0b3BwZWRTdGF0ZVxuIl19
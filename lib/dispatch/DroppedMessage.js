'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DroppedMessage = undefined;

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * DroppedMessage is an envelope for messages sent to an actor that does not exist.
 * @property {*} message
 * @property {string} to
 */
var DroppedMessage = exports.DroppedMessage = function (_Message) {
  _inherits(DroppedMessage, _Message);

  function DroppedMessage() {
    _classCallCheck(this, DroppedMessage);

    return _possibleConstructorReturn(this, (DroppedMessage.__proto__ || Object.getPrototypeOf(DroppedMessage)).apply(this, arguments));
  }

  return DroppedMessage;
}(_Message3.default);

exports.default = DroppedMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9Ecm9wcGVkTWVzc2FnZS5qcyJdLCJuYW1lcyI6WyJEcm9wcGVkTWVzc2FnZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTs7Ozs7SUFLYUEsYyxXQUFBQSxjOzs7Ozs7Ozs7Ozs7a0JBS0VBLGMiLCJmaWxlIjoiRHJvcHBlZE1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWVzc2FnZSBmcm9tICcuL01lc3NhZ2UnO1xuXG4vKipcbiAqIERyb3BwZWRNZXNzYWdlIGlzIGFuIGVudmVsb3BlIGZvciBtZXNzYWdlcyBzZW50IHRvIGFuIGFjdG9yIHRoYXQgZG9lcyBub3QgZXhpc3QuXG4gKiBAcHJvcGVydHkgeyp9IG1lc3NhZ2VcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICovXG5leHBvcnQgY2xhc3MgRHJvcHBlZE1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlIHtcblxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IERyb3BwZWRNZXNzYWdlXG4iXX0=
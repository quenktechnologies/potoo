'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnhandledMessage = undefined;

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * UnhandledMessage wraps messages that were not processed
 * by a receive call.
 *
 * @property {Reference} to
 * @property {*} Message
 */
var UnhandledMessage = exports.UnhandledMessage = function (_Message) {
  _inherits(UnhandledMessage, _Message);

  function UnhandledMessage() {
    _classCallCheck(this, UnhandledMessage);

    return _possibleConstructorReturn(this, (UnhandledMessage.__proto__ || Object.getPrototypeOf(UnhandledMessage)).apply(this, arguments));
  }

  return UnhandledMessage;
}(_Message3.default);

exports.default = UnhandledMessage;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9VbmhhbmRsZWRNZXNzYWdlLmpzIl0sIm5hbWVzIjpbIlVuaGFuZGxlZE1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPYUEsZ0IsV0FBQUEsZ0I7Ozs7Ozs7Ozs7OztrQkFFRUEsZ0IiLCJmaWxlIjoiVW5oYW5kbGVkTWVzc2FnZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNZXNzYWdlIGZyb20gJy4vTWVzc2FnZSc7XG5cbi8qKlxuICogVW5oYW5kbGVkTWVzc2FnZSB3cmFwcyBtZXNzYWdlcyB0aGF0IHdlcmUgbm90IHByb2Nlc3NlZFxuICogYnkgYSByZWNlaXZlIGNhbGwuXG4gKlxuICogQHByb3BlcnR5IHtSZWZlcmVuY2V9IHRvXG4gKiBAcHJvcGVydHkgeyp9IE1lc3NhZ2VcbiAqL1xuZXhwb3J0IGNsYXNzIFVuaGFuZGxlZE1lc3NhZ2UgZXh0ZW5kcyBNZXNzYWdlIHt9XG5cbmV4cG9ydCBkZWZhdWx0IFVuaGFuZGxlZE1lc3NhZ2VcbiJdfQ==
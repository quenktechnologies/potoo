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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZGlzcGF0Y2gvRHJvcHBlZE1lc3NhZ2UuanMiXSwibmFtZXMiOlsiRHJvcHBlZE1lc3NhZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7O0lBS2FBLGMsV0FBQUEsYzs7Ozs7Ozs7Ozs7O2tCQUtFQSxjIiwiZmlsZSI6IkRyb3BwZWRNZXNzYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IE1lc3NhZ2UgZnJvbSAnLi9NZXNzYWdlJztcblxuLyoqXG4gKiBEcm9wcGVkTWVzc2FnZSBpcyBhbiBlbnZlbG9wZSBmb3IgbWVzc2FnZXMgc2VudCB0byBhbiBhY3RvciB0aGF0IGRvZXMgbm90IGV4aXN0LlxuICogQHByb3BlcnR5IHsqfSBtZXNzYWdlXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9cbiAqL1xuZXhwb3J0IGNsYXNzIERyb3BwZWRNZXNzYWdlIGV4dGVuZHMgTWVzc2FnZSB7XG5cblxufVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wcGVkTWVzc2FnZVxuIl19
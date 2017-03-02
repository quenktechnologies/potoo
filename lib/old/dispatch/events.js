'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectFailedEvent = exports.SelectMissEvent = exports.SelectHitEvent = exports.MessageDroppedEvent = exports.MessageHandledEvent = exports.MessageUnhandledEvent = exports.MessageEvent = exports.ReceiveEvent = exports.Event = undefined;

var _Message2 = require('./Message');

var _Message3 = _interopRequireDefault(_Message2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Event = exports.Event = function (_Message) {
  _inherits(Event, _Message);

  function Event() {
    _classCallCheck(this, Event);

    return _possibleConstructorReturn(this, (Event.__proto__ || Object.getPrototypeOf(Event)).apply(this, arguments));
  }

  return Event;
}(_Message3.default);

var ReceiveEvent = exports.ReceiveEvent = function (_Event) {
  _inherits(ReceiveEvent, _Event);

  function ReceiveEvent() {
    _classCallCheck(this, ReceiveEvent);

    return _possibleConstructorReturn(this, (ReceiveEvent.__proto__ || Object.getPrototypeOf(ReceiveEvent)).apply(this, arguments));
  }

  return ReceiveEvent;
}(Event);

var MessageEvent = exports.MessageEvent = function (_Event2) {
  _inherits(MessageEvent, _Event2);

  function MessageEvent() {
    _classCallCheck(this, MessageEvent);

    return _possibleConstructorReturn(this, (MessageEvent.__proto__ || Object.getPrototypeOf(MessageEvent)).apply(this, arguments));
  }

  return MessageEvent;
}(Event);

var MessageUnhandledEvent = exports.MessageUnhandledEvent = function (_Event3) {
  _inherits(MessageUnhandledEvent, _Event3);

  function MessageUnhandledEvent() {
    _classCallCheck(this, MessageUnhandledEvent);

    return _possibleConstructorReturn(this, (MessageUnhandledEvent.__proto__ || Object.getPrototypeOf(MessageUnhandledEvent)).apply(this, arguments));
  }

  return MessageUnhandledEvent;
}(Event);

var MessageHandledEvent = exports.MessageHandledEvent = function (_Event4) {
  _inherits(MessageHandledEvent, _Event4);

  function MessageHandledEvent() {
    _classCallCheck(this, MessageHandledEvent);

    return _possibleConstructorReturn(this, (MessageHandledEvent.__proto__ || Object.getPrototypeOf(MessageHandledEvent)).apply(this, arguments));
  }

  return MessageHandledEvent;
}(Event);

var MessageDroppedEvent = exports.MessageDroppedEvent = function (_Event5) {
  _inherits(MessageDroppedEvent, _Event5);

  function MessageDroppedEvent() {
    _classCallCheck(this, MessageDroppedEvent);

    return _possibleConstructorReturn(this, (MessageDroppedEvent.__proto__ || Object.getPrototypeOf(MessageDroppedEvent)).apply(this, arguments));
  }

  return MessageDroppedEvent;
}(Event);

var SelectHitEvent = exports.SelectHitEvent = function (_Event6) {
  _inherits(SelectHitEvent, _Event6);

  function SelectHitEvent() {
    _classCallCheck(this, SelectHitEvent);

    return _possibleConstructorReturn(this, (SelectHitEvent.__proto__ || Object.getPrototypeOf(SelectHitEvent)).apply(this, arguments));
  }

  return SelectHitEvent;
}(Event);

var SelectMissEvent = exports.SelectMissEvent = function (_Event7) {
  _inherits(SelectMissEvent, _Event7);

  function SelectMissEvent() {
    _classCallCheck(this, SelectMissEvent);

    return _possibleConstructorReturn(this, (SelectMissEvent.__proto__ || Object.getPrototypeOf(SelectMissEvent)).apply(this, arguments));
  }

  return SelectMissEvent;
}(Event);

var SelectFailedEvent = exports.SelectFailedEvent = function (_Event8) {
  _inherits(SelectFailedEvent, _Event8);

  function SelectFailedEvent() {
    _classCallCheck(this, SelectFailedEvent);

    return _possibleConstructorReturn(this, (SelectFailedEvent.__proto__ || Object.getPrototypeOf(SelectFailedEvent)).apply(this, arguments));
  }

  return SelectFailedEvent;
}(Event);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9vbGQvZGlzcGF0Y2gvZXZlbnRzLmpzIl0sIm5hbWVzIjpbIkV2ZW50IiwiUmVjZWl2ZUV2ZW50IiwiTWVzc2FnZUV2ZW50IiwiTWVzc2FnZVVuaGFuZGxlZEV2ZW50IiwiTWVzc2FnZUhhbmRsZWRFdmVudCIsIk1lc3NhZ2VEcm9wcGVkRXZlbnQiLCJTZWxlY3RIaXRFdmVudCIsIlNlbGVjdE1pc3NFdmVudCIsIlNlbGVjdEZhaWxlZEV2ZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztJQUVhQSxLLFdBQUFBLEs7Ozs7Ozs7Ozs7OztJQUNBQyxZLFdBQUFBLFk7Ozs7Ozs7Ozs7RUFBcUJELEs7O0lBQ3JCRSxZLFdBQUFBLFk7Ozs7Ozs7Ozs7RUFBcUJGLEs7O0lBQ3JCRyxxQixXQUFBQSxxQjs7Ozs7Ozs7OztFQUE4QkgsSzs7SUFDOUJJLG1CLFdBQUFBLG1COzs7Ozs7Ozs7O0VBQTRCSixLOztJQUM1QkssbUIsV0FBQUEsbUI7Ozs7Ozs7Ozs7RUFBNEJMLEs7O0lBQzVCTSxjLFdBQUFBLGM7Ozs7Ozs7Ozs7RUFBdUJOLEs7O0lBQ3ZCTyxlLFdBQUFBLGU7Ozs7Ozs7Ozs7RUFBd0JQLEs7O0lBQ3hCUSxpQixXQUFBQSxpQjs7Ozs7Ozs7OztFQUEwQlIsSyIsImZpbGUiOiJldmVudHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTWVzc2FnZSBmcm9tICcuL01lc3NhZ2UnO1xuXG5leHBvcnQgY2xhc3MgRXZlbnQgZXh0ZW5kcyBNZXNzYWdlIHt9XG5leHBvcnQgY2xhc3MgUmVjZWl2ZUV2ZW50IGV4dGVuZHMgRXZlbnQge31cbmV4cG9ydCBjbGFzcyBNZXNzYWdlRXZlbnQgZXh0ZW5kcyBFdmVudCB7fVxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VVbmhhbmRsZWRFdmVudCBleHRlbmRzIEV2ZW50IHt9XG5leHBvcnQgY2xhc3MgTWVzc2FnZUhhbmRsZWRFdmVudCBleHRlbmRzIEV2ZW50IHt9XG5leHBvcnQgY2xhc3MgTWVzc2FnZURyb3BwZWRFdmVudCBleHRlbmRzIEV2ZW50IHt9XG5leHBvcnQgY2xhc3MgU2VsZWN0SGl0RXZlbnQgZXh0ZW5kcyBFdmVudCB7fVxuZXhwb3J0IGNsYXNzIFNlbGVjdE1pc3NFdmVudCBleHRlbmRzIEV2ZW50IHt9XG5leHBvcnQgY2xhc3MgU2VsZWN0RmFpbGVkRXZlbnQgZXh0ZW5kcyBFdmVudCB7fVxuIl19
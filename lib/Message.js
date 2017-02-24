"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Message copies the enumerable properties of an object and assigns them to itself.
 *
 * This class can be used to create adhoc type hiearchies for your code bases messages.
 * @param {object} src
 */
var Message = exports.Message = function Message() {
  var _this = this;

  var src = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  _classCallCheck(this, Message);

  Object.keys(src).forEach(function (k) {
    return _this[k] = src[k];
  });
};

/**
 * Task
 */


var Task = exports.Task = function (_Message) {
  _inherits(Task, _Message);

  function Task() {
    _classCallCheck(this, Task);

    return _possibleConstructorReturn(this, (Task.__proto__ || Object.getPrototypeOf(Task)).apply(this, arguments));
  }

  return Task;
}(Message);

/**
 * Spawn
 * @property {string} parent
 * @property {ActorT} template
 */


var Spawn = exports.Spawn = function (_Task) {
  _inherits(Spawn, _Task);

  function Spawn() {
    _classCallCheck(this, Spawn);

    return _possibleConstructorReturn(this, (Spawn.__proto__ || Object.getPrototypeOf(Spawn)).apply(this, arguments));
  }

  return Spawn;
}(Task);

/**
 * Tell
 * @property {string} to
 * @property {*} message
 */


var Tell = exports.Tell = function (_Task2) {
  _inherits(Tell, _Task2);

  function Tell() {
    _classCallCheck(this, Tell);

    return _possibleConstructorReturn(this, (Tell.__proto__ || Object.getPrototypeOf(Tell)).apply(this, arguments));
  }

  return Tell;
}(Task);

/**
 * Kill an Actor
 */


var Kill = exports.Kill = function (_Message2) {
  _inherits(Kill, _Message2);

  function Kill() {
    _classCallCheck(this, Kill);

    return _possibleConstructorReturn(this, (Kill.__proto__ || Object.getPrototypeOf(Kill)).apply(this, arguments));
  }

  return Kill;
}(Message);

/**
 * Receive
 * @property {string} path
 * @property {Behaviour} behaviour
 */


var Receive = exports.Receive = function (_Task3) {
  _inherits(Receive, _Task3);

  function Receive() {
    _classCallCheck(this, Receive);

    return _possibleConstructorReturn(this, (Receive.__proto__ || Object.getPrototypeOf(Receive)).apply(this, arguments));
  }

  return Receive;
}(Task);

/**
 * Drop
 * @property {string} to
 * @property {string} from
 * @property {*} message
 */


var Drop = exports.Drop = function (_Task4) {
  _inherits(Drop, _Task4);

  function Drop() {
    _classCallCheck(this, Drop);

    return _possibleConstructorReturn(this, (Drop.__proto__ || Object.getPrototypeOf(Drop)).apply(this, arguments));
  }

  return Drop;
}(Task);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NZXNzYWdlLmpzIl0sIm5hbWVzIjpbIk1lc3NhZ2UiLCJzcmMiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImsiLCJUYXNrIiwiU3Bhd24iLCJUZWxsIiwiS2lsbCIsIlJlY2VpdmUiLCJEcm9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7O0lBTWFBLE8sV0FBQUEsTyxHQUVULG1CQUFzQjtBQUFBOztBQUFBLE1BQVZDLEdBQVUsdUVBQUosRUFBSTs7QUFBQTs7QUFFbEJDLFNBQU9DLElBQVAsQ0FBWUYsR0FBWixFQUFpQkcsT0FBakIsQ0FBeUI7QUFBQSxXQUFLLE1BQUtDLENBQUwsSUFBVUosSUFBSUksQ0FBSixDQUFmO0FBQUEsR0FBekI7QUFFSCxDOztBQUlMOzs7OztJQUdhQyxJLFdBQUFBLEk7Ozs7Ozs7Ozs7RUFBYU4sTzs7QUFFMUI7Ozs7Ozs7SUFLYU8sSyxXQUFBQSxLOzs7Ozs7Ozs7O0VBQWNELEk7O0FBRTNCOzs7Ozs7O0lBS2FFLEksV0FBQUEsSTs7Ozs7Ozs7OztFQUFhRixJOztBQUUxQjs7Ozs7SUFHYUcsSSxXQUFBQSxJOzs7Ozs7Ozs7O0VBQWFULE87O0FBRTFCOzs7Ozs7O0lBS2FVLE8sV0FBQUEsTzs7Ozs7Ozs7OztFQUFnQkosSTs7QUFFN0I7Ozs7Ozs7O0lBTWFLLEksV0FBQUEsSTs7Ozs7Ozs7OztFQUFhTCxJIiwiZmlsZSI6Ik1lc3NhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIE1lc3NhZ2UgY29waWVzIHRoZSBlbnVtZXJhYmxlIHByb3BlcnRpZXMgb2YgYW4gb2JqZWN0IGFuZCBhc3NpZ25zIHRoZW0gdG8gaXRzZWxmLlxuICpcbiAqIFRoaXMgY2xhc3MgY2FuIGJlIHVzZWQgdG8gY3JlYXRlIGFkaG9jIHR5cGUgaGllYXJjaGllcyBmb3IgeW91ciBjb2RlIGJhc2VzIG1lc3NhZ2VzLlxuICogQHBhcmFtIHtvYmplY3R9IHNyY1xuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihzcmMgPSB7fSkge1xuXG4gICAgICAgIE9iamVjdC5rZXlzKHNyYykuZm9yRWFjaChrID0+IHRoaXNba10gPSBzcmNba10pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVGFza1xuICovXG5leHBvcnQgY2xhc3MgVGFzayBleHRlbmRzIE1lc3NhZ2Uge31cblxuLyoqXG4gKiBTcGF3blxuICogQHByb3BlcnR5IHtzdHJpbmd9IHBhcmVudFxuICogQHByb3BlcnR5IHtBY3RvclR9IHRlbXBsYXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTcGF3biBleHRlbmRzIFRhc2sge31cblxuLyoqXG4gKiBUZWxsXG4gKiBAcHJvcGVydHkge3N0cmluZ30gdG9cbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgVGVsbCBleHRlbmRzIFRhc2sge31cblxuLyoqXG4gKiBLaWxsIGFuIEFjdG9yXG4gKi9cbmV4cG9ydCBjbGFzcyBLaWxsIGV4dGVuZHMgTWVzc2FnZSB7fVxuXG4vKipcbiAqIFJlY2VpdmVcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwYXRoXG4gKiBAcHJvcGVydHkge0JlaGF2aW91cn0gYmVoYXZpb3VyXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWNlaXZlIGV4dGVuZHMgVGFzayB7fVxuXG4vKipcbiAqIERyb3BcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSB0b1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGZyb21cbiAqIEBwcm9wZXJ0eSB7Kn0gbWVzc2FnZVxuICovXG5leHBvcnQgY2xhc3MgRHJvcCBleHRlbmRzIFRhc2sge31cblxuIl19
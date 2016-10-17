'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RefFactory2 = require('./RefFactory');

var _RefFactory3 = _interopRequireDefault(_RefFactory2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Context represents the context a Concern is created in.
 * With a Context you can:
 * * Create Concerns
 * * Listen to events via subscribe()
 * * more
 * @interface
 */
var Context = function (_RefFactory) {
  _inherits(Context, _RefFactory);

  function Context() {
    _classCallCheck(this, Context);

    return _possibleConstructorReturn(this, (Context.__proto__ || Object.getPrototypeOf(Context)).apply(this, arguments));
  }

  _createClass(Context, [{
    key: 'path',


    /**
     * path returns the path to this context
     * @returns {string}
     */
    value: function path() {}

    /**
     * self returns the Reference for this Context
     * @returns {Reference}
     */

  }, {
    key: 'self',
    value: function self() {}

    /**
     * isChild tells us if ref is a child of this Context
     * @param {Reference} ref
     * @returns {boolean}
     */

  }, {
    key: 'isChild',
    value: function isChild(ref) {}

    /**
     * children returns an array of all this Context's children
     * @returns {array<Reference>}
     */

  }, {
    key: 'children',
    value: function children() {}

    /**
     * parent returns the parent Context for this Context or
     * null if none exists.
     * @returns {Context}
     */

  }, {
    key: 'parent',
    value: function parent() {}

    /**
     * mailbox returns this Context's Mailbox.
     * @returns {Mailbox}
     */

  }, {
    key: 'mailbox',
    value: function mailbox() {}

    /**
     * dispatcher returns this Context's Dispatcher
     * @returns {Dispatcher}
     */

  }, {
    key: 'dispatcher',
    value: function dispatcher() {}

    /**
     * system returns the System this Context belongs to.
     * @returns {System}
     */

  }, {
    key: 'system',
    value: function system() {}

    /**
     * concernOf creates a new child concern.
     * @param {ConcernFactory} factory
     * @param {string} name
     */

  }, {
    key: 'concernOf',
    value: function concernOf() {}
  }]);

  return Context;
}(_RefFactory3.default);

exports.default = Context;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db250ZXh0LmpzIl0sIm5hbWVzIjpbIkNvbnRleHQiLCJyZWYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBOzs7Ozs7OztJQVFNQSxPOzs7Ozs7Ozs7Ozs7O0FBRUY7Ozs7MkJBSU8sQ0FFTjs7QUFFRDs7Ozs7OzsyQkFJTyxDQUVOOztBQUVEOzs7Ozs7Ozs0QkFLUUMsRyxFQUFLLENBRVo7O0FBRUQ7Ozs7Ozs7K0JBSVcsQ0FFVjs7QUFFRDs7Ozs7Ozs7NkJBS1MsQ0FFUjs7QUFFRDs7Ozs7Ozs4QkFJVSxDQUVUOztBQUVEOzs7Ozs7O2lDQUlhLENBRVo7O0FBRUQ7Ozs7Ozs7NkJBSVMsQ0FFUjs7QUFFRDs7Ozs7Ozs7Z0NBS1ksQ0FFWDs7Ozs7O2tCQUlVRCxPIiwiZmlsZSI6IkNvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVmRmFjdG9yeSBmcm9tICcuL1JlZkZhY3RvcnknO1xuXG4vKipcbiAqIENvbnRleHQgcmVwcmVzZW50cyB0aGUgY29udGV4dCBhIENvbmNlcm4gaXMgY3JlYXRlZCBpbi5cbiAqIFdpdGggYSBDb250ZXh0IHlvdSBjYW46XG4gKiAqIENyZWF0ZSBDb25jZXJuc1xuICogKiBMaXN0ZW4gdG8gZXZlbnRzIHZpYSBzdWJzY3JpYmUoKVxuICogKiBtb3JlXG4gKiBAaW50ZXJmYWNlXG4gKi9cbmNsYXNzIENvbnRleHQgZXh0ZW5kcyBSZWZGYWN0b3J5IHtcblxuICAgIC8qKlxuICAgICAqIHBhdGggcmV0dXJucyB0aGUgcGF0aCB0byB0aGlzIGNvbnRleHRcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIHBhdGgoKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZWxmIHJldHVybnMgdGhlIFJlZmVyZW5jZSBmb3IgdGhpcyBDb250ZXh0XG4gICAgICogQHJldHVybnMge1JlZmVyZW5jZX1cbiAgICAgKi9cbiAgICBzZWxmKCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaXNDaGlsZCB0ZWxscyB1cyBpZiByZWYgaXMgYSBjaGlsZCBvZiB0aGlzIENvbnRleHRcbiAgICAgKiBAcGFyYW0ge1JlZmVyZW5jZX0gcmVmXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59XG4gICAgICovXG4gICAgaXNDaGlsZChyZWYpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoaWxkcmVuIHJldHVybnMgYW4gYXJyYXkgb2YgYWxsIHRoaXMgQ29udGV4dCdzIGNoaWxkcmVuXG4gICAgICogQHJldHVybnMge2FycmF5PFJlZmVyZW5jZT59XG4gICAgICovXG4gICAgY2hpbGRyZW4oKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBwYXJlbnQgcmV0dXJucyB0aGUgcGFyZW50IENvbnRleHQgZm9yIHRoaXMgQ29udGV4dCBvclxuICAgICAqIG51bGwgaWYgbm9uZSBleGlzdHMuXG4gICAgICogQHJldHVybnMge0NvbnRleHR9XG4gICAgICovXG4gICAgcGFyZW50KCkge1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogbWFpbGJveCByZXR1cm5zIHRoaXMgQ29udGV4dCdzIE1haWxib3guXG4gICAgICogQHJldHVybnMge01haWxib3h9XG4gICAgICovXG4gICAgbWFpbGJveCgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRpc3BhdGNoZXIgcmV0dXJucyB0aGlzIENvbnRleHQncyBEaXNwYXRjaGVyXG4gICAgICogQHJldHVybnMge0Rpc3BhdGNoZXJ9XG4gICAgICovXG4gICAgZGlzcGF0Y2hlcigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHN5c3RlbSByZXR1cm5zIHRoZSBTeXN0ZW0gdGhpcyBDb250ZXh0IGJlbG9uZ3MgdG8uXG4gICAgICogQHJldHVybnMge1N5c3RlbX1cbiAgICAgKi9cbiAgICBzeXN0ZW0oKSB7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25jZXJuT2YgY3JlYXRlcyBhIG5ldyBjaGlsZCBjb25jZXJuLlxuICAgICAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqL1xuICAgIGNvbmNlcm5PZigpIHtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDb250ZXh0O1xuIl19
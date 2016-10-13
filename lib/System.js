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
 * System
 * @interface
 */
var System = function (_RefFactory) {
  _inherits(System, _RefFactory);

  function System() {
    _classCallCheck(this, System);

    return _possibleConstructorReturn(this, (System.__proto__ || Object.getPrototypeOf(System)).apply(this, arguments));
  }

  _createClass(System, [{
    key: 'deadLetters',


    /**
     * deadLetters returns the DeadLetters reference.
     * @returns {DeadLetters}
     */
    value: function deadLetters() {}
  }, {
    key: 'select',
    value: function select(path) {}

    /**
     * concernOf considers a Concern part of this system when it activates.
     * @param {System.ConcernFactory} factory
     * @param {string} name
     * @returns {Reference}
     */

  }, {
    key: 'concernOf',
    value: function concernOf(factory, name) {}

    /**
     * on - taken from EventEmitter
     */

  }, {
    key: 'on',
    value: function on() {}

    /**
     * emit - taken from EventEmitter
     */

  }, {
    key: 'emit',
    value: function emit() {}
  }]);

  return System;
}(_RefFactory3.default);

exports.default = System;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TeXN0ZW0uanMiXSwibmFtZXMiOlsiU3lzdGVtIiwicGF0aCIsImZhY3RvcnkiLCJuYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTs7OztJQUlNQSxNOzs7Ozs7Ozs7Ozs7O0FBRUY7Ozs7a0NBSWMsQ0FFYjs7OzJCQUVNQyxJLEVBQU0sQ0FFWjs7QUFFRDs7Ozs7Ozs7OzhCQU1VQyxPLEVBQVNDLEksRUFBTSxDQUV4Qjs7QUFFRDs7Ozs7O3lCQUdLLENBRUo7O0FBRUQ7Ozs7OzsyQkFHTyxDQUVOOzs7Ozs7a0JBSVVILE0iLCJmaWxlIjoiU3lzdGVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlZkZhY3RvcnkgZnJvbSAnLi9SZWZGYWN0b3J5JztcblxuLyoqXG4gKiBTeXN0ZW1cbiAqIEBpbnRlcmZhY2VcbiAqL1xuY2xhc3MgU3lzdGVtIGV4dGVuZHMgUmVmRmFjdG9yeSB7XG5cbiAgICAvKipcbiAgICAgKiBkZWFkTGV0dGVycyByZXR1cm5zIHRoZSBEZWFkTGV0dGVycyByZWZlcmVuY2UuXG4gICAgICogQHJldHVybnMge0RlYWRMZXR0ZXJzfVxuICAgICAqL1xuICAgIGRlYWRMZXR0ZXJzKCkge1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbmNlcm5PZiBjb25zaWRlcnMgYSBDb25jZXJuIHBhcnQgb2YgdGhpcyBzeXN0ZW0gd2hlbiBpdCBhY3RpdmF0ZXMuXG4gICAgICogQHBhcmFtIHtTeXN0ZW0uQ29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZVxuICAgICAqIEByZXR1cm5zIHtSZWZlcmVuY2V9XG4gICAgICovXG4gICAgY29uY2Vybk9mKGZhY3RvcnksIG5hbWUpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG9uIC0gdGFrZW4gZnJvbSBFdmVudEVtaXR0ZXJcbiAgICAgKi9cbiAgICBvbigpIHtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVtaXQgLSB0YWtlbiBmcm9tIEV2ZW50RW1pdHRlclxuICAgICAqL1xuICAgIGVtaXQoKSB7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU3lzdGVtO1xuIl19
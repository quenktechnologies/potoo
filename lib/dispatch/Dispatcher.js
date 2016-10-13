'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Mailbox = require('./Mailbox');

var _Mailbox2 = _interopRequireDefault(_Mailbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Dispatcher provides an API for handling the actual delivery of messages.
 * @param {ConcernFactory} factory`
 */
var Dispatcher = function (_Mailbox$EnqueueListe) {
  _inherits(Dispatcher, _Mailbox$EnqueueListe);

  function Dispatcher() {
    _classCallCheck(this, Dispatcher);

    return _possibleConstructorReturn(this, (Dispatcher.__proto__ || Object.getPrototypeOf(Dispatcher)).apply(this, arguments));
  }

  _createClass(Dispatcher, [{
    key: 'executeChildError',
    value: function executeChildError() {}
  }, {
    key: 'execute',
    value: function execute() {}
  }]);

  return Dispatcher;
}(_Mailbox2.default.EnqueueListener);

exports.default = Dispatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaXNwYXRjaC9EaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbIkRpc3BhdGNoZXIiLCJFbnF1ZXVlTGlzdGVuZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7OztBQUVBOzs7O0lBSU1BLFU7Ozs7Ozs7Ozs7O3dDQUVrQixDQUFFOzs7OEJBRVosQ0FBRTs7OztFQUpTLGtCQUFRQyxlOztrQkFRbEJELFUiLCJmaWxlIjoiRGlzcGF0Y2hlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBNYWlsYm94IGZyb20gJy4vTWFpbGJveCc7XG5cbi8qKlxuICogRGlzcGF0Y2hlciBwcm92aWRlcyBhbiBBUEkgZm9yIGhhbmRsaW5nIHRoZSBhY3R1YWwgZGVsaXZlcnkgb2YgbWVzc2FnZXMuXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5YFxuICovXG5jbGFzcyBEaXNwYXRjaGVyIGV4dGVuZHMgTWFpbGJveC5FbnF1ZXVlTGlzdGVuZXIge1xuXG4gICAgZXhlY3V0ZUNoaWxkRXJyb3IoKSB7fVxuXG4gICAgZXhlY3V0ZSgpIHt9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGlzcGF0Y2hlclxuIl19
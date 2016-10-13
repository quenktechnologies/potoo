'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _RefState = require('../RefState');

var _RefState2 = _interopRequireDefault(_RefState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * ChildActiveState represents the Active state of a child processes's Concern
 */
var ChildActiveState = function (_RefState$Active) {
    _inherits(ChildActiveState, _RefState$Active);

    function ChildActiveState(child, path, remotePath, concern, context, provider) {
        _classCallCheck(this, ChildActiveState);

        var _this = _possibleConstructorReturn(this, (ChildActiveState.__proto__ || Object.getPrototypeOf(ChildActiveState)).call(this, path, concern, context, provider));

        _this._child = child;
        _this._remotePath = remotePath;

        return _this;
    }

    _createClass(ChildActiveState, [{
        key: 'action',
        value: function action(msg, sender, ref) {

            this._child.send(RemoteMessage.asString(this.remotePath, msg, sender));
        }
    }]);

    return ChildActiveState;
}(_RefState2.default.Active);

exports.default = ChildActiveState;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL0NoaWxkQWN0aXZlU3RhdGUuanMiXSwibmFtZXMiOlsiQ2hpbGRBY3RpdmVTdGF0ZSIsImNoaWxkIiwicGF0aCIsInJlbW90ZVBhdGgiLCJjb25jZXJuIiwiY29udGV4dCIsInByb3ZpZGVyIiwiX2NoaWxkIiwiX3JlbW90ZVBhdGgiLCJtc2ciLCJzZW5kZXIiLCJyZWYiLCJzZW5kIiwiUmVtb3RlTWVzc2FnZSIsImFzU3RyaW5nIiwiQWN0aXZlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLGdCOzs7QUFFRiw4QkFBWUMsS0FBWixFQUFtQkMsSUFBbkIsRUFBeUJDLFVBQXpCLEVBQXFDQyxPQUFyQyxFQUE4Q0MsT0FBOUMsRUFBdURDLFFBQXZELEVBQWlFO0FBQUE7O0FBQUEsd0lBRXZESixJQUZ1RCxFQUVqREUsT0FGaUQsRUFFeENDLE9BRndDLEVBRS9CQyxRQUYrQjs7QUFHN0QsY0FBS0MsTUFBTCxHQUFjTixLQUFkO0FBQ0EsY0FBS08sV0FBTCxHQUFtQkwsVUFBbkI7O0FBSjZEO0FBTWhFOzs7OytCQUVNTSxHLEVBQUtDLE0sRUFBUUMsRyxFQUFLOztBQUVyQixpQkFBS0osTUFBTCxDQUFZSyxJQUFaLENBQWlCQyxjQUFjQyxRQUFkLENBQXVCLEtBQUtYLFVBQTVCLEVBQXdDTSxHQUF4QyxFQUE2Q0MsTUFBN0MsQ0FBakI7QUFFSDs7OztFQWQwQixtQkFBU0ssTTs7a0JBaUJ6QmYsZ0IiLCJmaWxlIjoiQ2hpbGRBY3RpdmVTdGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWZTdGF0ZSBmcm9tICcuLi9SZWZTdGF0ZSc7XG5cbi8qKlxuICogQ2hpbGRBY3RpdmVTdGF0ZSByZXByZXNlbnRzIHRoZSBBY3RpdmUgc3RhdGUgb2YgYSBjaGlsZCBwcm9jZXNzZXMncyBDb25jZXJuXG4gKi9cbmNsYXNzIENoaWxkQWN0aXZlU3RhdGUgZXh0ZW5kcyBSZWZTdGF0ZS5BY3RpdmUge1xuXG4gICAgY29uc3RydWN0b3IoY2hpbGQsIHBhdGgsIHJlbW90ZVBhdGgsIGNvbmNlcm4sIGNvbnRleHQsIHByb3ZpZGVyKSB7XG5cbiAgICAgICAgc3VwZXIocGF0aCwgY29uY2VybiwgY29udGV4dCwgcHJvdmlkZXIpO1xuICAgICAgICB0aGlzLl9jaGlsZCA9IGNoaWxkO1xuICAgICAgICB0aGlzLl9yZW1vdGVQYXRoID0gcmVtb3RlUGF0aDtcblxuICAgIH1cblxuICAgIGFjdGlvbihtc2csIHNlbmRlciwgcmVmKSB7XG5cbiAgICAgICAgdGhpcy5fY2hpbGQuc2VuZChSZW1vdGVNZXNzYWdlLmFzU3RyaW5nKHRoaXMucmVtb3RlUGF0aCwgbXNnLCBzZW5kZXIpKTtcblxuICAgIH1cblxufVxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRBY3RpdmVTdGF0ZVxuIl19
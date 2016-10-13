'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _RemoteMessage = require('../RemoteMessage');

var _RemoteMessage2 = _interopRequireDefault(_RemoteMessage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ParentReference represents a Reference to
 */
var ParentReference = function () {
    function ParentReference(process) {
        _classCallCheck(this, ParentReference);

        this._process = process;
    }

    _createClass(ParentReference, [{
        key: 'accept',
        value: function accept(msg, sender) {

            this._process.send(_RemoteMessage2.default.asString('', msg, sender.path()));
        }
    }, {
        key: 'acceptAndPromise',
        value: function acceptAndPromise(msg, sender) {

            return _bluebird2.default.resolve(this.accept(msg, sender));
        }
    }]);

    return ParentReference;
}();

exports.default = ParentReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL1BhcmVudFJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6WyJQYXJlbnRSZWZlcmVuY2UiLCJwcm9jZXNzIiwiX3Byb2Nlc3MiLCJtc2ciLCJzZW5kZXIiLCJzZW5kIiwiYXNTdHJpbmciLCJwYXRoIiwicmVzb2x2ZSIsImFjY2VwdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7SUFHTUEsZTtBQUVGLDZCQUFZQyxPQUFaLEVBQXFCO0FBQUE7O0FBRWpCLGFBQUtDLFFBQUwsR0FBZ0JELE9BQWhCO0FBRUg7Ozs7K0JBRU1FLEcsRUFBS0MsTSxFQUFROztBQUV4QixpQkFBS0YsUUFBTCxDQUFjRyxJQUFkLENBQW1CLHdCQUFjQyxRQUFkLENBQXVCLEVBQXZCLEVBQTJCSCxHQUEzQixFQUFnQ0MsT0FBT0csSUFBUCxFQUFoQyxDQUFuQjtBQUVLOzs7eUNBRWdCSixHLEVBQUtDLE0sRUFBUTs7QUFFMUIsbUJBQU8sbUJBQVFJLE9BQVIsQ0FBZ0IsS0FBS0MsTUFBTCxDQUFZTixHQUFaLEVBQWlCQyxNQUFqQixDQUFoQixDQUFQO0FBRUg7Ozs7OztrQkFJVUosZSIsImZpbGUiOiJQYXJlbnRSZWZlcmVuY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgUmVtb3RlTWVzc2FnZSBmcm9tICcuLi9SZW1vdGVNZXNzYWdlJztcblxuLyoqXG4gKiBQYXJlbnRSZWZlcmVuY2UgcmVwcmVzZW50cyBhIFJlZmVyZW5jZSB0b1xuICovXG5jbGFzcyBQYXJlbnRSZWZlcmVuY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJvY2Vzcykge1xuXG4gICAgICAgIHRoaXMuX3Byb2Nlc3MgPSBwcm9jZXNzO1xuXG4gICAgfVxuXG4gICAgYWNjZXB0KG1zZywgc2VuZGVyKSB7XG5cbnRoaXMuX3Byb2Nlc3Muc2VuZChSZW1vdGVNZXNzYWdlLmFzU3RyaW5nKCcnLCBtc2csIHNlbmRlci5wYXRoKCkpKTtcblxuICAgIH1cblxuICAgIGFjY2VwdEFuZFByb21pc2UobXNnLCBzZW5kZXIpIHtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuYWNjZXB0KG1zZywgc2VuZGVyKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGFyZW50UmVmZXJlbmNlXG4iXX0=
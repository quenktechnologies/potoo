'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Address = require('../Address');

var _Address2 = _interopRequireDefault(_Address);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Parent allows a child process to communicate with a peered System.
 * @implements {Peer}
 */
var Parent = function () {
    function Parent() {
        _classCallCheck(this, Parent);
    }

    _createClass(Parent, [{
        key: 'resolve',
        value: function resolve(path) {

            var addr = _Address2.default.fromString(path);

            if (addr.isRemote()) return path;

            return 'parent://' + path;
        }
    }, {
        key: 'unresolve',
        value: function unresolve(path) {

            var addr = _Address2.default.fromString(path);

            if (!addr.isRemote()) return path;

            return addr.uri.pathname;
        }
    }, {
        key: 'handles',
        value: function handles(address) {

            if (address.uri.protocol === 'parent:') return true;
        }
    }, {
        key: 'associate',
        value: function associate(remote) {

            this._monitor = remote;
            process.on('message', function (message) {
                return remote.message(message);
            });
            return _bluebird2.default.resolve();
        }
    }, {
        key: 'disassociate',
        value: function disassociate() {}
    }, {
        key: 'send',
        value: function send(message) {
            var _this = this;

            _bluebird2.default.try(function () {
                return process.send(message);
            }).catch(function (e) {
                return _this._monitor.error(e);
            });
        }
    }]);

    return Parent;
}();

exports.default = Parent;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL1BhcmVudC5qcyJdLCJuYW1lcyI6WyJQYXJlbnQiLCJwYXRoIiwiYWRkciIsImZyb21TdHJpbmciLCJpc1JlbW90ZSIsInVyaSIsInBhdGhuYW1lIiwiYWRkcmVzcyIsInByb3RvY29sIiwicmVtb3RlIiwiX21vbml0b3IiLCJwcm9jZXNzIiwib24iLCJtZXNzYWdlIiwicmVzb2x2ZSIsInRyeSIsInNlbmQiLCJjYXRjaCIsImVycm9yIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7O0lBSU1BLE07Ozs7Ozs7Z0NBRU1DLEksRUFBTTs7QUFFVixnQkFBSUMsT0FBTyxrQkFBUUMsVUFBUixDQUFtQkYsSUFBbkIsQ0FBWDs7QUFFQSxnQkFBR0MsS0FBS0UsUUFBTCxFQUFILEVBQ0ksT0FBT0gsSUFBUDs7QUFFSixpQ0FBbUJBLElBQW5CO0FBRUg7OztrQ0FFU0EsSSxFQUFNOztBQUVaLGdCQUFJQyxPQUFPLGtCQUFRQyxVQUFSLENBQW1CRixJQUFuQixDQUFYOztBQUVBLGdCQUFJLENBQUNDLEtBQUtFLFFBQUwsRUFBTCxFQUNJLE9BQU9ILElBQVA7O0FBRUosbUJBQU9DLEtBQUtHLEdBQUwsQ0FBU0MsUUFBaEI7QUFFSDs7O2dDQUVPQyxPLEVBQVM7O0FBRWIsZ0JBQUlBLFFBQVFGLEdBQVIsQ0FBWUcsUUFBWixLQUF5QixTQUE3QixFQUNJLE9BQU8sSUFBUDtBQUVQOzs7a0NBRVNDLE0sRUFBUTs7QUFFZCxpQkFBS0MsUUFBTCxHQUFnQkQsTUFBaEI7QUFDQUUsb0JBQVFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCO0FBQUEsdUJBQVdILE9BQU9JLE9BQVAsQ0FBZUEsT0FBZixDQUFYO0FBQUEsYUFBdEI7QUFDQSxtQkFBTyxtQkFBUUMsT0FBUixFQUFQO0FBRUg7Ozt1Q0FFYyxDQUdkOzs7NkJBRUlELE8sRUFBUztBQUFBOztBQUVWLCtCQUFRRSxHQUFSLENBQVk7QUFBQSx1QkFBTUosUUFBUUssSUFBUixDQUFhSCxPQUFiLENBQU47QUFBQSxhQUFaLEVBQ0FJLEtBREEsQ0FDTTtBQUFBLHVCQUFLLE1BQUtQLFFBQUwsQ0FBY1EsS0FBZCxDQUFvQkMsQ0FBcEIsQ0FBTDtBQUFBLGFBRE47QUFFSDs7Ozs7O2tCQUlVbkIsTSIsImZpbGUiOiJQYXJlbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQWRkcmVzcyBmcm9tICcuLi9BZGRyZXNzJztcblxuLyoqXG4gKiBQYXJlbnQgYWxsb3dzIGEgY2hpbGQgcHJvY2VzcyB0byBjb21tdW5pY2F0ZSB3aXRoIGEgcGVlcmVkIFN5c3RlbS5cbiAqIEBpbXBsZW1lbnRzIHtQZWVyfVxuICovXG5jbGFzcyBQYXJlbnQge1xuXG4gICAgcmVzb2x2ZShwYXRoKSB7XG5cbiAgICAgICAgdmFyIGFkZHIgPSBBZGRyZXNzLmZyb21TdHJpbmcocGF0aCk7XG5cbiAgICAgICAgaWYoYWRkci5pc1JlbW90ZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG5cbiAgICAgICAgcmV0dXJuIGBwYXJlbnQ6Ly8ke3BhdGh9YDtcblxuICAgIH1cblxuICAgIHVucmVzb2x2ZShwYXRoKSB7XG5cbiAgICAgICAgdmFyIGFkZHIgPSBBZGRyZXNzLmZyb21TdHJpbmcocGF0aCk7XG5cbiAgICAgICAgaWYgKCFhZGRyLmlzUmVtb3RlKCkpXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcblxuICAgICAgICByZXR1cm4gYWRkci51cmkucGF0aG5hbWU7XG5cbiAgICB9XG5cbiAgICBoYW5kbGVzKGFkZHJlc3MpIHtcblxuICAgICAgICBpZiAoYWRkcmVzcy51cmkucHJvdG9jb2wgPT09ICdwYXJlbnQ6JylcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuXG4gICAgfVxuXG4gICAgYXNzb2NpYXRlKHJlbW90ZSkge1xuXG4gICAgICAgIHRoaXMuX21vbml0b3IgPSByZW1vdGU7XG4gICAgICAgIHByb2Nlc3Mub24oJ21lc3NhZ2UnLCBtZXNzYWdlID0+IHJlbW90ZS5tZXNzYWdlKG1lc3NhZ2UpKTtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgfVxuXG4gICAgZGlzYXNzb2NpYXRlKCkge1xuXG5cbiAgICB9XG5cbiAgICBzZW5kKG1lc3NhZ2UpIHtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBwcm9jZXNzLnNlbmQobWVzc2FnZSkpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuX21vbml0b3IuZXJyb3IoZSkpO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJlbnRcbiJdfQ==
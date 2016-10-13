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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL1BhcmVudC5qcyJdLCJuYW1lcyI6WyJQYXJlbnQiLCJwYXRoIiwiYWRkciIsImZyb21TdHJpbmciLCJpc1JlbW90ZSIsInVyaSIsInBhdGhuYW1lIiwiYWRkcmVzcyIsInByb3RvY29sIiwicmVtb3RlIiwiX21vbml0b3IiLCJwcm9jZXNzIiwib24iLCJtZXNzYWdlIiwicmVzb2x2ZSIsInRyeSIsInNlbmQiLCJjYXRjaCIsImVycm9yIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7O0lBSU1BLE07Ozs7Ozs7Z0NBRU1DLEksRUFBTTs7QUFFVixnQkFBSUMsT0FBTyxrQkFBUUMsVUFBUixDQUFtQkYsSUFBbkIsQ0FBWDs7QUFFQSxnQkFBR0MsS0FBS0UsUUFBTCxFQUFILEVBQ0ksT0FBT0gsSUFBUDs7QUFFSixpQ0FBbUJBLElBQW5CO0FBRUg7OztrQ0FFU0EsSSxFQUFNOztBQUVaLGdCQUFJQyxPQUFPLGtCQUFRQyxVQUFSLENBQW1CRixJQUFuQixDQUFYOztBQUVBLGdCQUFJLENBQUNDLEtBQUtFLFFBQUwsRUFBTCxFQUNJLE9BQU9ILElBQVA7O0FBRUosbUJBQU9DLEtBQUtHLEdBQUwsQ0FBU0MsUUFBaEI7QUFFSDs7O2dDQUVPQyxPLEVBQVM7O0FBRWIsZ0JBQUlBLFFBQVFGLEdBQVIsQ0FBWUcsUUFBWixLQUF5QixTQUE3QixFQUNJLE9BQU8sSUFBUDtBQUVQOzs7a0NBRVNDLE0sRUFBUTs7QUFFZCxpQkFBS0MsUUFBTCxHQUFnQkQsTUFBaEI7QUFDQUUsb0JBQVFDLEVBQVIsQ0FBVyxTQUFYLEVBQXNCO0FBQUEsdUJBQVdILE9BQU9JLE9BQVAsQ0FBZUEsT0FBZixDQUFYO0FBQUEsYUFBdEI7QUFDQSxtQkFBTyxtQkFBUUMsT0FBUixFQUFQO0FBRUg7Ozs2QkFFSUQsTyxFQUFTO0FBQUE7O0FBRVYsK0JBQVFFLEdBQVIsQ0FBWTtBQUFBLHVCQUFNSixRQUFRSyxJQUFSLENBQWFILE9BQWIsQ0FBTjtBQUFBLGFBQVosRUFDQUksS0FEQSxDQUNNO0FBQUEsdUJBQUssTUFBS1AsUUFBTCxDQUFjUSxLQUFkLENBQW9CQyxDQUFwQixDQUFMO0FBQUEsYUFETjtBQUVIOzs7Ozs7a0JBSVVuQixNIiwiZmlsZSI6IlBhcmVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBBZGRyZXNzIGZyb20gJy4uL0FkZHJlc3MnO1xuXG4vKipcbiAqIFBhcmVudCBhbGxvd3MgYSBjaGlsZCBwcm9jZXNzIHRvIGNvbW11bmljYXRlIHdpdGggYSBwZWVyZWQgU3lzdGVtLlxuICogQGltcGxlbWVudHMge1BlZXJ9XG4gKi9cbmNsYXNzIFBhcmVudCB7XG5cbiAgICByZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZihhZGRyLmlzUmVtb3RlKCkpXG4gICAgICAgICAgICByZXR1cm4gcGF0aDtcblxuICAgICAgICByZXR1cm4gYHBhcmVudDovLyR7cGF0aH1gO1xuXG4gICAgfVxuXG4gICAgdW5yZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZiAoIWFkZHIuaXNSZW1vdGUoKSlcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuXG4gICAgICAgIHJldHVybiBhZGRyLnVyaS5wYXRobmFtZTtcblxuICAgIH1cblxuICAgIGhhbmRsZXMoYWRkcmVzcykge1xuXG4gICAgICAgIGlmIChhZGRyZXNzLnVyaS5wcm90b2NvbCA9PT0gJ3BhcmVudDonKVxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9XG5cbiAgICBhc3NvY2lhdGUocmVtb3RlKSB7XG5cbiAgICAgICAgdGhpcy5fbW9uaXRvciA9IHJlbW90ZTtcbiAgICAgICAgcHJvY2Vzcy5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gcmVtb3RlLm1lc3NhZ2UobWVzc2FnZSkpO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG5cbiAgICB9XG5cbiAgICBzZW5kKG1lc3NhZ2UpIHtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiBwcm9jZXNzLnNlbmQobWVzc2FnZSkpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuX21vbml0b3IuZXJyb3IoZSkpO1xuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJlbnRcbiJdfQ==
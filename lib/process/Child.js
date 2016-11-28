'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _Signal = require('../state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Address = require('../Address');

var _Address2 = _interopRequireDefault(_Address);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Child is the peer to use for running another System as a child process.
 * It will take care of forking the the child and transfering messages between the two
 * systems.
 * @param {string} path - The absolute path to the file to execute.
 * @implements {Peer}
 */
var Child = function () {
    function Child(path) {
        _classCallCheck(this, Child);

        (0, _beof2.default)({ path: path }).string();

        this._path = path;
        this._child = null;
    }

    _createClass(Child, [{
        key: 'unresolve',
        value: function unresolve(path) {

            var addr = _Address2.default.fromString(path);

            if (!addr.isRemote()) return path;

            return addr.uri.hash.split('#')[1];
        }
    }, {
        key: 'resolve',
        value: function resolve(path) {

            var addr = _Address2.default.fromString(path);

            if (addr.isRemote()) return path;

            return 'child://' + this._path + '#' + path;
        }
    }, {
        key: 'handles',
        value: function handles(address) {

            if (address.uri.protocol === 'child:') if (address.uri.pathname === this._path) return true;
        }
    }, {
        key: 'associate',
        value: function associate(remote) {
            var _this = this;

            this._monitor = remote;

            return _bluebird2.default.try(function () {
                _this._child = _child_process2.default.fork(_this._path);
                _this._child.on('message', function (message) {
                    return remote.message(message);
                });
                _this._child.on('error', function (e) {
                    return remote.error(e);
                });
                _this._child.on('exit', function (e) {
                    return remote.closed(_Signal2.default.Closed);
                });
            });
        }
    }, {
        key: 'disassociate',
        value: function disassociate() {

            this._child.kill('SIGTERM');
        }
    }, {
        key: 'send',
        value: function send(message) {
            var _this2 = this;

            _bluebird2.default.try(function () {
                return _this2._child.send(message);
            }).catch(function (e) {
                return _this2._monitor.error(e);
            });
        }
    }]);

    return Child;
}();

exports.default = Child;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL0NoaWxkLmpzIl0sIm5hbWVzIjpbIkNoaWxkIiwicGF0aCIsInN0cmluZyIsIl9wYXRoIiwiX2NoaWxkIiwiYWRkciIsImZyb21TdHJpbmciLCJpc1JlbW90ZSIsInVyaSIsImhhc2giLCJzcGxpdCIsImFkZHJlc3MiLCJwcm90b2NvbCIsInBhdGhuYW1lIiwicmVtb3RlIiwiX21vbml0b3IiLCJ0cnkiLCJmb3JrIiwib24iLCJtZXNzYWdlIiwiZXJyb3IiLCJlIiwiY2xvc2VkIiwiQ2xvc2VkIiwia2lsbCIsInNlbmQiLCJjYXRjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7O0lBT01BLEs7QUFFRixtQkFBWUMsSUFBWixFQUFrQjtBQUFBOztBQUVkLDRCQUFLLEVBQUVBLFVBQUYsRUFBTCxFQUFlQyxNQUFmOztBQUVBLGFBQUtDLEtBQUwsR0FBYUYsSUFBYjtBQUNBLGFBQUtHLE1BQUwsR0FBYyxJQUFkO0FBRUg7Ozs7a0NBRVNILEksRUFBTTs7QUFFWixnQkFBSUksT0FBTyxrQkFBUUMsVUFBUixDQUFtQkwsSUFBbkIsQ0FBWDs7QUFFQSxnQkFBSSxDQUFDSSxLQUFLRSxRQUFMLEVBQUwsRUFDSSxPQUFPTixJQUFQOztBQUVKLG1CQUFPSSxLQUFLRyxHQUFMLENBQVNDLElBQVQsQ0FBY0MsS0FBZCxDQUFvQixHQUFwQixFQUF5QixDQUF6QixDQUFQO0FBRUg7OztnQ0FFT1QsSSxFQUFNOztBQUVWLGdCQUFJSSxPQUFPLGtCQUFRQyxVQUFSLENBQW1CTCxJQUFuQixDQUFYOztBQUVBLGdCQUFJSSxLQUFLRSxRQUFMLEVBQUosRUFDSSxPQUFPTixJQUFQOztBQUdKLGdDQUFrQixLQUFLRSxLQUF2QixTQUFnQ0YsSUFBaEM7QUFFSDs7O2dDQUVPVSxPLEVBQVM7O0FBRWIsZ0JBQUlBLFFBQVFILEdBQVIsQ0FBWUksUUFBWixLQUF5QixRQUE3QixFQUNJLElBQUlELFFBQVFILEdBQVIsQ0FBWUssUUFBWixLQUF5QixLQUFLVixLQUFsQyxFQUNJLE9BQU8sSUFBUDtBQUVYOzs7a0NBRVNXLE0sRUFBUTtBQUFBOztBQUVkLGlCQUFLQyxRQUFMLEdBQWdCRCxNQUFoQjs7QUFFQSxtQkFBTyxtQkFBUUUsR0FBUixDQUFZLFlBQU07QUFDckIsc0JBQUtaLE1BQUwsR0FBYyx3QkFBY2EsSUFBZCxDQUFtQixNQUFLZCxLQUF4QixDQUFkO0FBQ0Esc0JBQUtDLE1BQUwsQ0FBWWMsRUFBWixDQUFlLFNBQWYsRUFBMEI7QUFBQSwyQkFBV0osT0FBT0ssT0FBUCxDQUFlQSxPQUFmLENBQVg7QUFBQSxpQkFBMUI7QUFDQSxzQkFBS2YsTUFBTCxDQUFZYyxFQUFaLENBQWUsT0FBZixFQUF3QjtBQUFBLDJCQUFLSixPQUFPTSxLQUFQLENBQWFDLENBQWIsQ0FBTDtBQUFBLGlCQUF4QjtBQUNBLHNCQUFLakIsTUFBTCxDQUFZYyxFQUFaLENBQWUsTUFBZixFQUF1QjtBQUFBLDJCQUFLSixPQUFPUSxNQUFQLENBQWMsaUJBQU9DLE1BQXJCLENBQUw7QUFBQSxpQkFBdkI7QUFDSCxhQUxNLENBQVA7QUFPSDs7O3VDQUVjOztBQUVYLGlCQUFLbkIsTUFBTCxDQUFZb0IsSUFBWixDQUFpQixTQUFqQjtBQUVIOzs7NkJBRUlMLE8sRUFBUztBQUFBOztBQUVWLCtCQUFRSCxHQUFSLENBQVk7QUFBQSx1QkFBTSxPQUFLWixNQUFMLENBQVlxQixJQUFaLENBQWlCTixPQUFqQixDQUFOO0FBQUEsYUFBWixFQUNBTyxLQURBLENBQ007QUFBQSx1QkFBSyxPQUFLWCxRQUFMLENBQWNLLEtBQWQsQ0FBb0JDLENBQXBCLENBQUw7QUFBQSxhQUROO0FBR0g7Ozs7OztrQkFJVXJCLEsiLCJmaWxlIjoiQ2hpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IEFkZHJlc3MgZnJvbSAnLi4vQWRkcmVzcyc7XG5cbi8qKlxuICogQ2hpbGQgaXMgdGhlIHBlZXIgdG8gdXNlIGZvciBydW5uaW5nIGFub3RoZXIgU3lzdGVtIGFzIGEgY2hpbGQgcHJvY2Vzcy5cbiAqIEl0IHdpbGwgdGFrZSBjYXJlIG9mIGZvcmtpbmcgdGhlIHRoZSBjaGlsZCBhbmQgdHJhbnNmZXJpbmcgbWVzc2FnZXMgYmV0d2VlbiB0aGUgdHdvXG4gKiBzeXN0ZW1zLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSB0byBleGVjdXRlLlxuICogQGltcGxlbWVudHMge1BlZXJ9XG4gKi9cbmNsYXNzIENoaWxkIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fY2hpbGQgPSBudWxsO1xuXG4gICAgfVxuXG4gICAgdW5yZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZiAoIWFkZHIuaXNSZW1vdGUoKSlcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuXG4gICAgICAgIHJldHVybiBhZGRyLnVyaS5oYXNoLnNwbGl0KCcjJylbMV07XG5cbiAgICB9XG5cbiAgICByZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZiAoYWRkci5pc1JlbW90ZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG5cblxuICAgICAgICByZXR1cm4gYGNoaWxkOi8vJHt0aGlzLl9wYXRofSMke3BhdGh9YDtcblxuICAgIH1cblxuICAgIGhhbmRsZXMoYWRkcmVzcykge1xuXG4gICAgICAgIGlmIChhZGRyZXNzLnVyaS5wcm90b2NvbCA9PT0gJ2NoaWxkOicpXG4gICAgICAgICAgICBpZiAoYWRkcmVzcy51cmkucGF0aG5hbWUgPT09IHRoaXMuX3BhdGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9XG5cbiAgICBhc3NvY2lhdGUocmVtb3RlKSB7XG5cbiAgICAgICAgdGhpcy5fbW9uaXRvciA9IHJlbW90ZTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQgPSBjaGlsZF9wcm9jZXNzLmZvcmsodGhpcy5fcGF0aCk7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZC5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gcmVtb3RlLm1lc3NhZ2UobWVzc2FnZSkpO1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQub24oJ2Vycm9yJywgZSA9PiByZW1vdGUuZXJyb3IoZSkpO1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQub24oJ2V4aXQnLCBlID0+IHJlbW90ZS5jbG9zZWQoU2lnbmFsLkNsb3NlZCkpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGRpc2Fzc29jaWF0ZSgpIHtcblxuICAgICAgICB0aGlzLl9jaGlsZC5raWxsKCdTSUdURVJNJyk7XG5cbiAgICB9XG5cbiAgICBzZW5kKG1lc3NhZ2UpIHtcblxuICAgICAgICBQcm9taXNlLnRyeSgoKSA9PiB0aGlzLl9jaGlsZC5zZW5kKG1lc3NhZ2UpKS5cbiAgICAgICAgY2F0Y2goZSA9PiB0aGlzLl9tb25pdG9yLmVycm9yKGUpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlsZFxuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzL0NoaWxkLmpzIl0sIm5hbWVzIjpbIkNoaWxkIiwicGF0aCIsInN0cmluZyIsIl9wYXRoIiwiX2NoaWxkIiwiYWRkciIsImZyb21TdHJpbmciLCJpc1JlbW90ZSIsInVyaSIsImhhc2giLCJzcGxpdCIsImFkZHJlc3MiLCJwcm90b2NvbCIsInBhdGhuYW1lIiwicmVtb3RlIiwiX21vbml0b3IiLCJ0cnkiLCJmb3JrIiwib24iLCJtZXNzYWdlIiwiZXJyb3IiLCJlIiwiY2xvc2VkIiwiQ2xvc2VkIiwic2VuZCIsImNhdGNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPTUEsSztBQUVGLG1CQUFZQyxJQUFaLEVBQWtCO0FBQUE7O0FBRWQsNEJBQUssRUFBRUEsVUFBRixFQUFMLEVBQWVDLE1BQWY7O0FBRUEsYUFBS0MsS0FBTCxHQUFhRixJQUFiO0FBQ0EsYUFBS0csTUFBTCxHQUFjLElBQWQ7QUFFSDs7OztrQ0FFU0gsSSxFQUFNOztBQUVaLGdCQUFJSSxPQUFPLGtCQUFRQyxVQUFSLENBQW1CTCxJQUFuQixDQUFYOztBQUVBLGdCQUFJLENBQUNJLEtBQUtFLFFBQUwsRUFBTCxFQUNJLE9BQU9OLElBQVA7O0FBRUosbUJBQU9JLEtBQUtHLEdBQUwsQ0FBU0MsSUFBVCxDQUFjQyxLQUFkLENBQW9CLEdBQXBCLEVBQXlCLENBQXpCLENBQVA7QUFFSDs7O2dDQUVPVCxJLEVBQU07O0FBRVYsZ0JBQUlJLE9BQU8sa0JBQVFDLFVBQVIsQ0FBbUJMLElBQW5CLENBQVg7O0FBRUEsZ0JBQUlJLEtBQUtFLFFBQUwsRUFBSixFQUNJLE9BQU9OLElBQVA7O0FBR0osZ0NBQWtCLEtBQUtFLEtBQXZCLFNBQWdDRixJQUFoQztBQUVIOzs7Z0NBRU9VLE8sRUFBUzs7QUFFYixnQkFBSUEsUUFBUUgsR0FBUixDQUFZSSxRQUFaLEtBQXlCLFFBQTdCLEVBQ0ksSUFBSUQsUUFBUUgsR0FBUixDQUFZSyxRQUFaLEtBQXlCLEtBQUtWLEtBQWxDLEVBQ0ksT0FBTyxJQUFQO0FBRVg7OztrQ0FFU1csTSxFQUFRO0FBQUE7O0FBRWQsaUJBQUtDLFFBQUwsR0FBZ0JELE1BQWhCOztBQUVBLG1CQUFPLG1CQUFRRSxHQUFSLENBQVksWUFBTTtBQUNyQixzQkFBS1osTUFBTCxHQUFjLHdCQUFjYSxJQUFkLENBQW1CLE1BQUtkLEtBQXhCLENBQWQ7QUFDQSxzQkFBS0MsTUFBTCxDQUFZYyxFQUFaLENBQWUsU0FBZixFQUEwQjtBQUFBLDJCQUFXSixPQUFPSyxPQUFQLENBQWVBLE9BQWYsQ0FBWDtBQUFBLGlCQUExQjtBQUNBLHNCQUFLZixNQUFMLENBQVljLEVBQVosQ0FBZSxPQUFmLEVBQXdCO0FBQUEsMkJBQUtKLE9BQU9NLEtBQVAsQ0FBYUMsQ0FBYixDQUFMO0FBQUEsaUJBQXhCO0FBQ0Esc0JBQUtqQixNQUFMLENBQVljLEVBQVosQ0FBZSxNQUFmLEVBQXVCO0FBQUEsMkJBQUtKLE9BQU9RLE1BQVAsQ0FBYyxpQkFBT0MsTUFBckIsQ0FBTDtBQUFBLGlCQUF2QjtBQUNILGFBTE0sQ0FBUDtBQU9IOzs7NkJBRUlKLE8sRUFBUztBQUFBOztBQUVWLCtCQUFRSCxHQUFSLENBQVk7QUFBQSx1QkFBTSxPQUFLWixNQUFMLENBQVlvQixJQUFaLENBQWlCTCxPQUFqQixDQUFOO0FBQUEsYUFBWixFQUNBTSxLQURBLENBQ007QUFBQSx1QkFBSyxPQUFLVixRQUFMLENBQWNLLEtBQWQsQ0FBb0JDLENBQXBCLENBQUw7QUFBQSxhQUROO0FBR0g7Ozs7OztrQkFJVXJCLEsiLCJmaWxlIjoiQ2hpbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFByb21pc2UgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9zdGF0ZS9TaWduYWwnO1xuaW1wb3J0IEFkZHJlc3MgZnJvbSAnLi4vQWRkcmVzcyc7XG5cbi8qKlxuICogQ2hpbGQgaXMgdGhlIHBlZXIgdG8gdXNlIGZvciBydW5uaW5nIGFub3RoZXIgU3lzdGVtIGFzIGEgY2hpbGQgcHJvY2Vzcy5cbiAqIEl0IHdpbGwgdGFrZSBjYXJlIG9mIGZvcmtpbmcgdGhlIHRoZSBjaGlsZCBhbmQgdHJhbnNmZXJpbmcgbWVzc2FnZXMgYmV0d2VlbiB0aGUgdHdvXG4gKiBzeXN0ZW1zLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggLSBUaGUgYWJzb2x1dGUgcGF0aCB0byB0aGUgZmlsZSB0byBleGVjdXRlLlxuICogQGltcGxlbWVudHMge1BlZXJ9XG4gKi9cbmNsYXNzIENoaWxkIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fY2hpbGQgPSBudWxsO1xuXG4gICAgfVxuXG4gICAgdW5yZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZiAoIWFkZHIuaXNSZW1vdGUoKSlcbiAgICAgICAgICAgIHJldHVybiBwYXRoO1xuXG4gICAgICAgIHJldHVybiBhZGRyLnVyaS5oYXNoLnNwbGl0KCcjJylbMV07XG5cbiAgICB9XG5cbiAgICByZXNvbHZlKHBhdGgpIHtcblxuICAgICAgICB2YXIgYWRkciA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcblxuICAgICAgICBpZiAoYWRkci5pc1JlbW90ZSgpKVxuICAgICAgICAgICAgcmV0dXJuIHBhdGg7XG5cblxuICAgICAgICByZXR1cm4gYGNoaWxkOi8vJHt0aGlzLl9wYXRofSMke3BhdGh9YDtcblxuICAgIH1cblxuICAgIGhhbmRsZXMoYWRkcmVzcykge1xuXG4gICAgICAgIGlmIChhZGRyZXNzLnVyaS5wcm90b2NvbCA9PT0gJ2NoaWxkOicpXG4gICAgICAgICAgICBpZiAoYWRkcmVzcy51cmkucGF0aG5hbWUgPT09IHRoaXMuX3BhdGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG5cbiAgICB9XG5cbiAgICBhc3NvY2lhdGUocmVtb3RlKSB7XG5cbiAgICAgICAgdGhpcy5fbW9uaXRvciA9IHJlbW90ZTtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQgPSBjaGlsZF9wcm9jZXNzLmZvcmsodGhpcy5fcGF0aCk7XG4gICAgICAgICAgICB0aGlzLl9jaGlsZC5vbignbWVzc2FnZScsIG1lc3NhZ2UgPT4gcmVtb3RlLm1lc3NhZ2UobWVzc2FnZSkpO1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQub24oJ2Vycm9yJywgZSA9PiByZW1vdGUuZXJyb3IoZSkpO1xuICAgICAgICAgICAgdGhpcy5fY2hpbGQub24oJ2V4aXQnLCBlID0+IHJlbW90ZS5jbG9zZWQoU2lnbmFsLkNsb3NlZCkpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHNlbmQobWVzc2FnZSkge1xuXG4gICAgICAgIFByb21pc2UudHJ5KCgpID0+IHRoaXMuX2NoaWxkLnNlbmQobWVzc2FnZSkpLlxuICAgICAgICBjYXRjaChlID0+IHRoaXMuX21vbml0b3IuZXJyb3IoZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaWxkXG4iXX0=
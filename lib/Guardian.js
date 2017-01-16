'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Guardian = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _ChildContext = require('./ChildContext');

var _ChildContext2 = _interopRequireDefault(_ChildContext);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var strategy = function strategy(e) {
    throw e;
};

/**
 * Guardian
 * @implements {Context}
 * @implements {Reference}
 * @implements {Mailbox}
 * @implements {Dispatcher}
 */

var Guardian = exports.Guardian = function () {
    function Guardian(system) {
        _classCallCheck(this, Guardian);

        (0, _beof2.default)({ system: system }).interface(_System2.default);

        this._system = system;
        this._tree = new _ChildContext2.default('', this, this, { inbox: this, strategy: strategy, dispatch: this });
    }

    _createClass(Guardian, [{
        key: 'path',
        value: function path() {

            return '';
        }
    }, {
        key: 'self',
        value: function self() {

            return this;
        }
    }, {
        key: 'parent',
        value: function parent() {

            return this;
        }
    }, {
        key: 'root',
        value: function root() {

            return this;
        }
    }, {
        key: 'inbox',
        value: function inbox() {

            return this;
        }
    }, {
        key: 'select',
        value: function select(path) {

            return this;
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this._tree.spawn(spec, name);
        }
    }, {
        key: 'receive',
        value: function receive(cb) {

            return _bluebird2.default.try(function () {
                return cb(null);
            });
        }
    }, {
        key: 'tell',
        value: function tell(message) {

            this._system.publish(message);
        }
    }, {
        key: 'enqueue',
        value: function enqueue() {

            throw new Error('enqueue is not supported');
        }
    }, {
        key: 'dequeue',
        value: function dequeue() {

            throw new Error('dequeue is not supported');
        }
    }, {
        key: 'schedule',
        value: function schedule() {

            throw new Error('schedule is not supported');
        }
    }, {
        key: 'dispatch',
        value: function dispatch() {

            throw new Error('dispatch is not supported');
        }
    }]);

    return Guardian;
}();

exports.default = Guardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJzdHJhdGVneSIsImUiLCJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJfdHJlZSIsImluYm94IiwiZGlzcGF0Y2giLCJwYXRoIiwic3BlYyIsIm5hbWUiLCJzcGF3biIsImNiIiwidHJ5IiwibWVzc2FnZSIsInB1Ymxpc2giLCJFcnJvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsV0FBVyxTQUFYQSxRQUFXLElBQUs7QUFBRSxVQUFNQyxDQUFOO0FBQVUsQ0FBbEM7O0FBRUE7Ozs7Ozs7O0lBT2FDLFEsV0FBQUEsUTtBQUVULHNCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLDRCQUFLLEVBQUVBLGNBQUYsRUFBTCxFQUFpQkMsU0FBakI7O0FBRUEsYUFBS0MsT0FBTCxHQUFlRixNQUFmO0FBQ0EsYUFBS0csS0FBTCxHQUFhLDJCQUFpQixFQUFqQixFQUFxQixJQUFyQixFQUEyQixJQUEzQixFQUFpQyxFQUFFQyxPQUFPLElBQVQsRUFBZVAsa0JBQWYsRUFBeUJRLFVBQVUsSUFBbkMsRUFBakMsQ0FBYjtBQUVIOzs7OytCQUVNOztBQUVILG1CQUFPLEVBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLElBQVA7QUFFSDs7O2lDQUVROztBQUVMLG1CQUFPLElBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLElBQVA7QUFFSDs7O2dDQUVPOztBQUVKLG1CQUFPLElBQVA7QUFFSDs7OytCQUVNQyxJLEVBQU07O0FBRVQsbUJBQU8sSUFBUDtBQUVIOzs7OEJBRUtDLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtMLEtBQUwsQ0FBV00sS0FBWCxDQUFpQkYsSUFBakIsRUFBdUJDLElBQXZCLENBQVA7QUFFSDs7O2dDQUVPRSxFLEVBQUk7O0FBRVIsbUJBQU8sbUJBQVFDLEdBQVIsQ0FBWTtBQUFBLHVCQUFNRCxHQUFHLElBQUgsQ0FBTjtBQUFBLGFBQVosQ0FBUDtBQUVIOzs7NkJBRUlFLE8sRUFBUzs7QUFFVixpQkFBS1YsT0FBTCxDQUFhVyxPQUFiLENBQXFCRCxPQUFyQjtBQUVIOzs7a0NBRVM7O0FBRU4sa0JBQU0sSUFBSUUsS0FBSixDQUFVLDBCQUFWLENBQU47QUFFSDs7O2tDQUVTOztBQUVOLGtCQUFNLElBQUlBLEtBQUosQ0FBVSwwQkFBVixDQUFOO0FBRUg7OzttQ0FFVTs7QUFFUCxrQkFBTSxJQUFJQSxLQUFKLENBQVUsMkJBQVYsQ0FBTjtBQUVIOzs7bUNBRVU7O0FBRVAsa0JBQU0sSUFBSUEsS0FBSixDQUFVLDJCQUFWLENBQU47QUFFSDs7Ozs7O2tCQUlVZixRIiwiZmlsZSI6Ikd1YXJkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ2hpbGRDb250ZXh0IGZyb20gJy4vQ2hpbGRDb250ZXh0JztcbmltcG9ydCBTeXN0ZW0gZnJvbSAnLi9TeXN0ZW0nO1xuXG5jb25zdCBzdHJhdGVneSA9IGUgPT4geyB0aHJvdyBlOyB9XG5cbi8qKlxuICogR3VhcmRpYW5cbiAqIEBpbXBsZW1lbnRzIHtDb250ZXh0fVxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZX1cbiAqIEBpbXBsZW1lbnRzIHtNYWlsYm94fVxuICogQGltcGxlbWVudHMge0Rpc3BhdGNoZXJ9XG4gKi9cbmV4cG9ydCBjbGFzcyBHdWFyZGlhbiB7XG5cbiAgICBjb25zdHJ1Y3RvcihzeXN0ZW0pIHtcblxuICAgICAgICBiZW9mKHsgc3lzdGVtIH0pLmludGVyZmFjZShTeXN0ZW0pO1xuXG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgdGhpcy5fdHJlZSA9IG5ldyBDaGlsZENvbnRleHQoJycsIHRoaXMsIHRoaXMsIHsgaW5ib3g6IHRoaXMsIHN0cmF0ZWd5LCBkaXNwYXRjaDogdGhpcyB9KTtcblxuICAgIH1cblxuICAgIHBhdGgoKSB7XG5cbiAgICAgICAgcmV0dXJuICcnO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHJvb3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBpbmJveCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBzcGF3bihzcGVjLCBuYW1lKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3RyZWUuc3Bhd24oc3BlYywgbmFtZSk7XG5cbiAgICB9XG5cbiAgICByZWNlaXZlKGNiKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IGNiKG51bGwpKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSkge1xuXG4gICAgICAgIHRoaXMuX3N5c3RlbS5wdWJsaXNoKG1lc3NhZ2UpO1xuXG4gICAgfVxuXG4gICAgZW5xdWV1ZSgpIHtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2VucXVldWUgaXMgbm90IHN1cHBvcnRlZCcpO1xuXG4gICAgfVxuXG4gICAgZGVxdWV1ZSgpIHtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2RlcXVldWUgaXMgbm90IHN1cHBvcnRlZCcpO1xuXG4gICAgfVxuXG4gICAgc2NoZWR1bGUoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdzY2hlZHVsZSBpcyBub3Qgc3VwcG9ydGVkJyk7XG5cbiAgICB9XG5cbiAgICBkaXNwYXRjaCgpIHtcblxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2Rpc3BhdGNoIGlzIG5vdCBzdXBwb3J0ZWQnKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBHdWFyZGlhblxuIl19
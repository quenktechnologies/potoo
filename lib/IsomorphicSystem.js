'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Signal = require('./state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

var _Guardian = require('./Guardian');

var _Guardian2 = _interopRequireDefault(_Guardian);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the root of a tree your application will
 * branch into.
 * @param {Context} parent
 * @implements {Context}
 */
var IsomorphicSystem = function () {
    function IsomorphicSystem() {
        _classCallCheck(this, IsomorphicSystem);

        this._events = new _events2.default.EventEmitter();
        this._root = new _Guardian2.default(this);
    }

    /**
     * create a new IsomorphicSystem
     * @param {string} name
     * @returns {IsomorphicSystem}
     */


    _createClass(IsomorphicSystem, [{
        key: 'deadLetters',
        value: function deadLetters() {

            return this._root.deadLetters;
        }
    }, {
        key: 'peer',
        value: function peer(instance, config) {

            this._root.peer(instance, config);
        }
    }, {
        key: 'select',
        value: function select(path) {

            return this._root.app.select(path);
        }
    }, {
        key: 'concernOf',
        value: function concernOf(factory, name) {

            return this._root.app.concernOf(factory, name);
        }
    }, {
        key: 'shutdown',
        value: function shutdown(reason) {
            var _this = this;

            // this._root.app.tell(Signal.Stop, this._root);

            //@todo -> actually wait until app and sys finished shutting down
            //perhaps this is better done in the root/Guardian?
            //
            setTimeout(function () {

                _this._root = null;
                _this._events = null;

                if (reason) throw reason;
            }, 1000);
        }
    }, {
        key: 'on',
        value: function on() {

            this._events.on.apply(this._events, arguments);
        }
    }, {
        key: 'emit',
        value: function emit() {

            this._events.emit.apply(this._events, arguments);
        }
    }], [{
        key: 'create',
        value: function create(name) {

            return new IsomorphicSystem();
        }
    }]);

    return IsomorphicSystem;
}();

exports.default = IsomorphicSystem;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Jc29tb3JwaGljU3lzdGVtLmpzIl0sIm5hbWVzIjpbIklzb21vcnBoaWNTeXN0ZW0iLCJfZXZlbnRzIiwiRXZlbnRFbWl0dGVyIiwiX3Jvb3QiLCJkZWFkTGV0dGVycyIsImluc3RhbmNlIiwiY29uZmlnIiwicGVlciIsInBhdGgiLCJhcHAiLCJzZWxlY3QiLCJmYWN0b3J5IiwibmFtZSIsImNvbmNlcm5PZiIsInJlYXNvbiIsInNldFRpbWVvdXQiLCJvbiIsImFwcGx5IiwiYXJndW1lbnRzIiwiZW1pdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7O0lBT01BLGdCO0FBRUYsZ0NBQWM7QUFBQTs7QUFFVixhQUFLQyxPQUFMLEdBQWUsSUFBSSxpQkFBT0MsWUFBWCxFQUFmO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLHVCQUFhLElBQWIsQ0FBYjtBQUVIOztBQUVEOzs7Ozs7Ozs7c0NBV2M7O0FBRVYsbUJBQU8sS0FBS0EsS0FBTCxDQUFXQyxXQUFsQjtBQUVIOzs7NkJBRUlDLFEsRUFBVUMsTSxFQUFROztBQUVuQixpQkFBS0gsS0FBTCxDQUFXSSxJQUFYLENBQWdCRixRQUFoQixFQUEwQkMsTUFBMUI7QUFFSDs7OytCQUVNRSxJLEVBQU07O0FBRVQsbUJBQU8sS0FBS0wsS0FBTCxDQUFXTSxHQUFYLENBQWVDLE1BQWYsQ0FBc0JGLElBQXRCLENBQVA7QUFFSDs7O2tDQUVTRyxPLEVBQVNDLEksRUFBTTs7QUFFckIsbUJBQU8sS0FBS1QsS0FBTCxDQUFXTSxHQUFYLENBQWVJLFNBQWYsQ0FBeUJGLE9BQXpCLEVBQWtDQyxJQUFsQyxDQUFQO0FBRUg7OztpQ0FFUUUsTSxFQUFRO0FBQUE7O0FBRWQ7O0FBRUM7QUFDQTtBQUNBO0FBQ0FDLHVCQUFXLFlBQU07O0FBRWIsc0JBQUtaLEtBQUwsR0FBYSxJQUFiO0FBQ0Esc0JBQUtGLE9BQUwsR0FBZSxJQUFmOztBQUVBLG9CQUFJYSxNQUFKLEVBQ0ksTUFBTUEsTUFBTjtBQUVQLGFBUkQsRUFRRyxJQVJIO0FBVUg7Ozs2QkFFSTs7QUFFRCxpQkFBS2IsT0FBTCxDQUFhZSxFQUFiLENBQWdCQyxLQUFoQixDQUFzQixLQUFLaEIsT0FBM0IsRUFBb0NpQixTQUFwQztBQUVIOzs7K0JBRU07O0FBRUgsaUJBQUtqQixPQUFMLENBQWFrQixJQUFiLENBQWtCRixLQUFsQixDQUF3QixLQUFLaEIsT0FBN0IsRUFBc0NpQixTQUF0QztBQUVIOzs7K0JBM0RhTixJLEVBQU07O0FBRWhCLG1CQUFPLElBQUlaLGdCQUFKLEVBQVA7QUFFSDs7Ozs7O2tCQTJEVUEsZ0IiLCJmaWxlIjoiSXNvbW9ycGhpY1N5c3RlbS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBldmVudHMgZnJvbSAnZXZlbnRzJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFNpZ25hbCBmcm9tICcuL3N0YXRlL1NpZ25hbCc7XG5pbXBvcnQgR3VhcmRpYW4gZnJvbSAnLi9HdWFyZGlhbic7XG5cbi8qKlxuICogSXNvbW9ycGhpY1N5c3RlbSByZXByZXNlbnRzIGEgY29sbGVjdGlvbiBvZiByZWxhdGVkIENvbmNlcm5zIHRoYXQgc2hhcmUgYSBwYXJlbnQgQ29udGV4dC5cbiAqIFVzZSB0aGVtIHRvIGNyZWF0ZSB0byByZXByZXNlbnQgdGhlIHJvb3Qgb2YgYSB0cmVlIHlvdXIgYXBwbGljYXRpb24gd2lsbFxuICogYnJhbmNoIGludG8uXG4gKiBAcGFyYW0ge0NvbnRleHR9IHBhcmVudFxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKi9cbmNsYXNzIElzb21vcnBoaWNTeXN0ZW0ge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5fZXZlbnRzID0gbmV3IGV2ZW50cy5FdmVudEVtaXR0ZXIoKTtcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBHdWFyZGlhbih0aGlzKTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNyZWF0ZSBhIG5ldyBJc29tb3JwaGljU3lzdGVtXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWVcbiAgICAgKiBAcmV0dXJucyB7SXNvbW9ycGhpY1N5c3RlbX1cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlKG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElzb21vcnBoaWNTeXN0ZW0oKTtcblxuICAgIH1cblxuICAgIGRlYWRMZXR0ZXJzKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9yb290LmRlYWRMZXR0ZXJzO1xuXG4gICAgfVxuXG4gICAgcGVlcihpbnN0YW5jZSwgY29uZmlnKSB7XG5cbiAgICAgICAgdGhpcy5fcm9vdC5wZWVyKGluc3RhbmNlLCBjb25maWcpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5hcHAuc2VsZWN0KHBhdGgpO1xuXG4gICAgfVxuXG4gICAgY29uY2Vybk9mKGZhY3RvcnksIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcm9vdC5hcHAuY29uY2Vybk9mKGZhY3RvcnksIG5hbWUpO1xuXG4gICAgfVxuXG4gICAgc2h1dGRvd24ocmVhc29uKSB7XG5cbiAgICAgICAvLyB0aGlzLl9yb290LmFwcC50ZWxsKFNpZ25hbC5TdG9wLCB0aGlzLl9yb290KTtcblxuICAgICAgICAvL0B0b2RvIC0+IGFjdHVhbGx5IHdhaXQgdW50aWwgYXBwIGFuZCBzeXMgZmluaXNoZWQgc2h1dHRpbmcgZG93blxuICAgICAgICAvL3BlcmhhcHMgdGhpcyBpcyBiZXR0ZXIgZG9uZSBpbiB0aGUgcm9vdC9HdWFyZGlhbj9cbiAgICAgICAgLy9cbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG5cbiAgICAgICAgICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gbnVsbDtcblxuICAgICAgICAgICAgaWYgKHJlYXNvbilcbiAgICAgICAgICAgICAgICB0aHJvdyByZWFzb247XG5cbiAgICAgICAgfSwgMTAwMCk7XG5cbiAgICB9XG5cbiAgICBvbigpIHtcblxuICAgICAgICB0aGlzLl9ldmVudHMub24uYXBwbHkodGhpcy5fZXZlbnRzLCBhcmd1bWVudHMpO1xuXG4gICAgfVxuXG4gICAgZW1pdCgpIHtcblxuICAgICAgICB0aGlzLl9ldmVudHMuZW1pdC5hcHBseSh0aGlzLl9ldmVudHMsIGFyZ3VtZW50cyk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgSXNvbW9ycGhpY1N5c3RlbTtcbiJdfQ==
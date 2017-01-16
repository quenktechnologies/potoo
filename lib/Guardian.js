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

var _DroppedMessage = require('./dispatch/DroppedMessage');

var _DroppedMessage2 = _interopRequireDefault(_DroppedMessage);

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
        this.tree = new _ChildContext2.default('/', this, this, { strategy: strategy, dispatch: this });
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
        key: 'select',
        value: function select(path) {
            var _this = this;

            return { tell: function tell(m) {
                    return _this.tell(new _DroppedMessage2.default({ message: m, to: path }));
                } };
        }
    }, {
        key: 'spawn',
        value: function spawn(spec, name) {

            return this.tree.spawn(spec, name);
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
    }]);

    return Guardian;
}();

exports.default = Guardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJzdHJhdGVneSIsImUiLCJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJ0cmVlIiwiZGlzcGF0Y2giLCJwYXRoIiwidGVsbCIsIm1lc3NhZ2UiLCJtIiwidG8iLCJzcGVjIiwibmFtZSIsInNwYXduIiwiY2IiLCJ0cnkiLCJwdWJsaXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLFdBQVcsU0FBWEEsUUFBVyxJQUFLO0FBQUUsVUFBTUMsQ0FBTjtBQUFVLENBQWxDOztBQUVBOzs7Ozs7OztJQU9hQyxRLFdBQUFBLFE7QUFFVCxzQkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUVoQiw0QkFBSyxFQUFFQSxjQUFGLEVBQUwsRUFBaUJDLFNBQWpCOztBQUVBLGFBQUtDLE9BQUwsR0FBZUYsTUFBZjtBQUNBLGFBQUtHLElBQUwsR0FBWSwyQkFBaUIsR0FBakIsRUFBc0IsSUFBdEIsRUFBNEIsSUFBNUIsRUFBa0MsRUFBRU4sa0JBQUYsRUFBWU8sVUFBVSxJQUF0QixFQUFsQyxDQUFaO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sRUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU1DLEksRUFBTTtBQUFBOztBQUVULG1CQUFPLEVBQUVDLE1BQU07QUFBQSwyQkFBSyxNQUFLQSxJQUFMLENBQVUsNkJBQW1CLEVBQUVDLFNBQVNDLENBQVgsRUFBY0MsSUFBSUosSUFBbEIsRUFBbkIsQ0FBVixDQUFMO0FBQUEsaUJBQVIsRUFBUDtBQUVIOzs7OEJBRUtLLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtSLElBQUwsQ0FBVVMsS0FBVixDQUFnQkYsSUFBaEIsRUFBc0JDLElBQXRCLENBQVA7QUFFSDs7O2dDQUVPRSxFLEVBQUk7O0FBRVIsbUJBQU8sbUJBQVFDLEdBQVIsQ0FBWTtBQUFBLHVCQUFNRCxHQUFHLElBQUgsQ0FBTjtBQUFBLGFBQVosQ0FBUDtBQUVIOzs7NkJBRUlOLE8sRUFBUzs7QUFFVixpQkFBS0wsT0FBTCxDQUFhYSxPQUFiLENBQXFCUixPQUFyQjtBQUVIOzs7Ozs7a0JBSVVSLFEiLCJmaWxlIjoiR3VhcmRpYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5pbXBvcnQgRHJvcHBlZE1lc3NhZ2UgZnJvbSAnLi9kaXNwYXRjaC9Ecm9wcGVkTWVzc2FnZSc7XG5cbmNvbnN0IHN0cmF0ZWd5ID0gZSA9PiB7IHRocm93IGU7IH1cblxuLyoqXG4gKiBHdWFyZGlhblxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAaW1wbGVtZW50cyB7UmVmZXJlbmNlfVxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKiBAaW1wbGVtZW50cyB7RGlzcGF0Y2hlcn1cbiAqL1xuZXhwb3J0IGNsYXNzIEd1YXJkaWFuIHtcblxuICAgIGNvbnN0cnVjdG9yKHN5c3RlbSkge1xuXG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtID0gc3lzdGVtO1xuICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ2hpbGRDb250ZXh0KCcvJywgdGhpcywgdGhpcywgeyBzdHJhdGVneSwgZGlzcGF0Y2g6IHRoaXMgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiAnJztcblxuICAgIH1cblxuICAgIHNlbGYoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICByZXR1cm4geyB0ZWxsOiBtID0+IHRoaXMudGVsbChuZXcgRHJvcHBlZE1lc3NhZ2UoeyBtZXNzYWdlOiBtLCB0bzogcGF0aCB9KSkgfTtcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50cmVlLnNwYXduKHNwZWMsIG5hbWUpO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShjYikge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiBjYihudWxsKSk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UpIHtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0ucHVibGlzaChtZXNzYWdlKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBHdWFyZGlhblxuIl19
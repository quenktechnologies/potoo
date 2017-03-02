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

var _events = require('./dispatch/events');

var _strategy = require('./dispatch/strategy');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
        this.tree = new _ChildContext2.default('/', this, this, { strategy: _strategy.escalate, dispatch: this });
    }

    _createClass(Guardian, [{
        key: 'path',
        value: function path() {

            return '/';
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
        key: 'none',
        value: function none() {
            var _this = this;

            return { tell: function tell(m) {
                    return _this.tell(new _events.MessageDroppedEvent({ message: m, to: '<none>' }));
                } };
        }
    }, {
        key: 'select',
        value: function select(path) {
            var _this2 = this;

            this.tell(new _events.SelectFailedEvent({ path: path }));
            return { tell: function tell(m) {
                    return _this2.tell(new _events.MessageDroppedEvent({ message: m, to: path }));
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

            if (message instanceof Error) throw message;

            this._system.publish(message);
        }
    }]);

    return Guardian;
}();

exports.default = Guardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9vbGQvR3VhcmRpYW4uanMiXSwibmFtZXMiOlsiR3VhcmRpYW4iLCJzeXN0ZW0iLCJpbnRlcmZhY2UiLCJfc3lzdGVtIiwidHJlZSIsInN0cmF0ZWd5IiwiZGlzcGF0Y2giLCJ0ZWxsIiwibWVzc2FnZSIsIm0iLCJ0byIsInBhdGgiLCJzcGVjIiwibmFtZSIsInNwYXduIiwiY2IiLCJ0cnkiLCJFcnJvciIsInB1Ymxpc2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7O0lBT2FBLFEsV0FBQUEsUTtBQUVULHNCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLDRCQUFLLEVBQUVBLGNBQUYsRUFBTCxFQUFpQkMsU0FBakI7O0FBRUEsYUFBS0MsT0FBTCxHQUFlRixNQUFmO0FBQ0EsYUFBS0csSUFBTCxHQUFZLDJCQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFrQyxFQUFFQyw0QkFBRixFQUFzQkMsVUFBVSxJQUFoQyxFQUFsQyxDQUFaO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sR0FBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07QUFBQTs7QUFFSCxtQkFBTyxFQUFFQyxNQUFNO0FBQUEsMkJBQUssTUFBS0EsSUFBTCxDQUFVLGdDQUF3QixFQUFFQyxTQUFTQyxDQUFYLEVBQWNDLElBQUksUUFBbEIsRUFBeEIsQ0FBVixDQUFMO0FBQUEsaUJBQVIsRUFBUDtBQUVIOzs7K0JBRU1DLEksRUFBTTtBQUFBOztBQUVULGlCQUFLSixJQUFMLENBQVUsOEJBQXNCLEVBQUNJLFVBQUQsRUFBdEIsQ0FBVjtBQUNBLG1CQUFPLEVBQUVKLE1BQU07QUFBQSwyQkFBSyxPQUFLQSxJQUFMLENBQVUsZ0NBQXdCLEVBQUVDLFNBQVNDLENBQVgsRUFBY0MsSUFBSUMsSUFBbEIsRUFBeEIsQ0FBVixDQUFMO0FBQUEsaUJBQVIsRUFBUDtBQUVIOzs7OEJBRUtDLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtULElBQUwsQ0FBVVUsS0FBVixDQUFnQkYsSUFBaEIsRUFBc0JDLElBQXRCLENBQVA7QUFFSDs7O2dDQUVPRSxFLEVBQUk7O0FBRVIsbUJBQU8sbUJBQVFDLEdBQVIsQ0FBWTtBQUFBLHVCQUFNRCxHQUFHLElBQUgsQ0FBTjtBQUFBLGFBQVosQ0FBUDtBQUVIOzs7NkJBRUlQLE8sRUFBUzs7QUFFVixnQkFBSUEsbUJBQW1CUyxLQUF2QixFQUNJLE1BQU1ULE9BQU47O0FBRUosaUJBQUtMLE9BQUwsQ0FBYWUsT0FBYixDQUFxQlYsT0FBckI7QUFFSDs7Ozs7O2tCQUlVUixRIiwiZmlsZSI6Ikd1YXJkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ2hpbGRDb250ZXh0IGZyb20gJy4vQ2hpbGRDb250ZXh0JztcbmltcG9ydCBTeXN0ZW0gZnJvbSAnLi9TeXN0ZW0nO1xuaW1wb3J0IHtNZXNzYWdlRHJvcHBlZEV2ZW50LCBTZWxlY3RGYWlsZWRFdmVudH0gZnJvbSAnLi9kaXNwYXRjaC9ldmVudHMnO1xuaW1wb3J0IHsgZXNjYWxhdGUgfSBmcm9tICcuL2Rpc3BhdGNoL3N0cmF0ZWd5JztcblxuLyoqXG4gKiBHdWFyZGlhblxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAaW1wbGVtZW50cyB7UmVmZXJlbmNlfVxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKiBAaW1wbGVtZW50cyB7RGlzcGF0Y2hlcn1cbiAqL1xuZXhwb3J0IGNsYXNzIEd1YXJkaWFuIHtcblxuICAgIGNvbnN0cnVjdG9yKHN5c3RlbSkge1xuXG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtID0gc3lzdGVtO1xuICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ2hpbGRDb250ZXh0KCcvJywgdGhpcywgdGhpcywgeyBzdHJhdGVneTogZXNjYWxhdGUsIGRpc3BhdGNoOiB0aGlzIH0pO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gJy8nO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHJvb3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBub25lKCkge1xuXG4gICAgICAgIHJldHVybiB7IHRlbGw6IG0gPT4gdGhpcy50ZWxsKG5ldyBNZXNzYWdlRHJvcHBlZEV2ZW50KHsgbWVzc2FnZTogbSwgdG86ICc8bm9uZT4nIH0pKSB9O1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICB0aGlzLnRlbGwobmV3IFNlbGVjdEZhaWxlZEV2ZW50KHtwYXRofSkpO1xuICAgICAgICByZXR1cm4geyB0ZWxsOiBtID0+IHRoaXMudGVsbChuZXcgTWVzc2FnZURyb3BwZWRFdmVudCh7IG1lc3NhZ2U6IG0sIHRvOiBwYXRoIH0pKSB9O1xuXG4gICAgfVxuXG4gICAgc3Bhd24oc3BlYywgbmFtZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnRyZWUuc3Bhd24oc3BlYywgbmFtZSk7XG5cbiAgICB9XG5cbiAgICByZWNlaXZlKGNiKSB7XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2UudHJ5KCgpID0+IGNiKG51bGwpKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSkge1xuXG4gICAgICAgIGlmIChtZXNzYWdlIGluc3RhbmNlb2YgRXJyb3IpXG4gICAgICAgICAgICB0aHJvdyBtZXNzYWdlO1xuXG4gICAgICAgIHRoaXMuX3N5c3RlbS5wdWJsaXNoKG1lc3NhZ2UpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IEd1YXJkaWFuXG4iXX0=
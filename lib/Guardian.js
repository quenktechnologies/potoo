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

            return this.self();
        }
    }, {
        key: 'select',
        value: function select(path) {
            var _this = this;

            this.tell(new _events.SelectFailedEvent({ path: path }));
            return { tell: function tell(m) {
                    return _this.tell(new _events.MessageDroppedEvent({ message: m, to: path }));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJ0cmVlIiwic3RyYXRlZ3kiLCJkaXNwYXRjaCIsInNlbGYiLCJwYXRoIiwidGVsbCIsIm1lc3NhZ2UiLCJtIiwidG8iLCJzcGVjIiwibmFtZSIsInNwYXduIiwiY2IiLCJ0cnkiLCJFcnJvciIsInB1Ymxpc2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVBOzs7Ozs7O0lBT2FBLFEsV0FBQUEsUTtBQUVULHNCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLDRCQUFLLEVBQUVBLGNBQUYsRUFBTCxFQUFpQkMsU0FBakI7O0FBRUEsYUFBS0MsT0FBTCxHQUFlRixNQUFmO0FBQ0EsYUFBS0csSUFBTCxHQUFZLDJCQUFpQixHQUFqQixFQUFzQixJQUF0QixFQUE0QixJQUE1QixFQUFrQyxFQUFFQyw0QkFBRixFQUFzQkMsVUFBVSxJQUFoQyxFQUFsQyxDQUFaO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sR0FBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0MsSUFBTCxFQUFQO0FBRUg7OzsrQkFFTUMsSSxFQUFNO0FBQUE7O0FBRVQsaUJBQUtDLElBQUwsQ0FBVSw4QkFBc0IsRUFBQ0QsVUFBRCxFQUF0QixDQUFWO0FBQ0EsbUJBQU8sRUFBRUMsTUFBTTtBQUFBLDJCQUFLLE1BQUtBLElBQUwsQ0FBVSxnQ0FBd0IsRUFBRUMsU0FBU0MsQ0FBWCxFQUFjQyxJQUFJSixJQUFsQixFQUF4QixDQUFWLENBQUw7QUFBQSxpQkFBUixFQUFQO0FBRUg7Ozs4QkFFS0ssSSxFQUFNQyxJLEVBQU07O0FBRWQsbUJBQU8sS0FBS1YsSUFBTCxDQUFVVyxLQUFWLENBQWdCRixJQUFoQixFQUFzQkMsSUFBdEIsQ0FBUDtBQUVIOzs7Z0NBRU9FLEUsRUFBSTs7QUFFUixtQkFBTyxtQkFBUUMsR0FBUixDQUFZO0FBQUEsdUJBQU1ELEdBQUcsSUFBSCxDQUFOO0FBQUEsYUFBWixDQUFQO0FBRUg7Ozs2QkFFSU4sTyxFQUFTOztBQUVWLGdCQUFJQSxtQkFBbUJRLEtBQXZCLEVBQ0ksTUFBTVIsT0FBTjs7QUFFSixpQkFBS1AsT0FBTCxDQUFhZ0IsT0FBYixDQUFxQlQsT0FBckI7QUFFSDs7Ozs7O2tCQUlVVixRIiwiZmlsZSI6Ikd1YXJkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgQ2hpbGRDb250ZXh0IGZyb20gJy4vQ2hpbGRDb250ZXh0JztcbmltcG9ydCBTeXN0ZW0gZnJvbSAnLi9TeXN0ZW0nO1xuaW1wb3J0IHtNZXNzYWdlRHJvcHBlZEV2ZW50LCBTZWxlY3RGYWlsZWRFdmVudH0gZnJvbSAnLi9kaXNwYXRjaC9ldmVudHMnO1xuaW1wb3J0IHsgZXNjYWxhdGUgfSBmcm9tICcuL2Rpc3BhdGNoL3N0cmF0ZWd5JztcblxuLyoqXG4gKiBHdWFyZGlhblxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAaW1wbGVtZW50cyB7UmVmZXJlbmNlfVxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKiBAaW1wbGVtZW50cyB7RGlzcGF0Y2hlcn1cbiAqL1xuZXhwb3J0IGNsYXNzIEd1YXJkaWFuIHtcblxuICAgIGNvbnN0cnVjdG9yKHN5c3RlbSkge1xuXG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtID0gc3lzdGVtO1xuICAgICAgICB0aGlzLnRyZWUgPSBuZXcgQ2hpbGRDb250ZXh0KCcvJywgdGhpcywgdGhpcywgeyBzdHJhdGVneTogZXNjYWxhdGUsIGRpc3BhdGNoOiB0aGlzIH0pO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gJy8nO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHJvb3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBub25lKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnNlbGYoKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgdGhpcy50ZWxsKG5ldyBTZWxlY3RGYWlsZWRFdmVudCh7cGF0aH0pKTtcbiAgICAgICAgcmV0dXJuIHsgdGVsbDogbSA9PiB0aGlzLnRlbGwobmV3IE1lc3NhZ2VEcm9wcGVkRXZlbnQoeyBtZXNzYWdlOiBtLCB0bzogcGF0aCB9KSkgfTtcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50cmVlLnNwYXduKHNwZWMsIG5hbWUpO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShjYikge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiBjYihudWxsKSk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0ucHVibGlzaChtZXNzYWdlKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBHdWFyZGlhblxuIl19
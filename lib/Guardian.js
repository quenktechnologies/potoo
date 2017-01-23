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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJ0cmVlIiwic3RyYXRlZ3kiLCJkaXNwYXRjaCIsInRlbGwiLCJtZXNzYWdlIiwibSIsInRvIiwicGF0aCIsInNwZWMiLCJuYW1lIiwic3Bhd24iLCJjYiIsInRyeSIsIkVycm9yIiwicHVibGlzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7SUFPYUEsUSxXQUFBQSxRO0FBRVQsc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFFaEIsNEJBQUssRUFBRUEsY0FBRixFQUFMLEVBQWlCQyxTQUFqQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWVGLE1BQWY7QUFDQSxhQUFLRyxJQUFMLEdBQVksMkJBQWlCLEdBQWpCLEVBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDLEVBQUVDLDRCQUFGLEVBQXNCQyxVQUFVLElBQWhDLEVBQWxDLENBQVo7QUFFSDs7OzsrQkFFTTs7QUFFSCxtQkFBTyxHQUFQO0FBRUg7OzsrQkFFTTs7QUFFSCxtQkFBTyxJQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyxJQUFQO0FBRUg7OzsrQkFFTTs7QUFFSCxtQkFBTyxJQUFQO0FBRUg7OzsrQkFFTTtBQUFBOztBQUVILG1CQUFPLEVBQUVDLE1BQU07QUFBQSwyQkFBSyxNQUFLQSxJQUFMLENBQVUsZ0NBQXdCLEVBQUVDLFNBQVNDLENBQVgsRUFBY0MsSUFBSSxRQUFsQixFQUF4QixDQUFWLENBQUw7QUFBQSxpQkFBUixFQUFQO0FBRUg7OzsrQkFFTUMsSSxFQUFNO0FBQUE7O0FBRVQsaUJBQUtKLElBQUwsQ0FBVSw4QkFBc0IsRUFBQ0ksVUFBRCxFQUF0QixDQUFWO0FBQ0EsbUJBQU8sRUFBRUosTUFBTTtBQUFBLDJCQUFLLE9BQUtBLElBQUwsQ0FBVSxnQ0FBd0IsRUFBRUMsU0FBU0MsQ0FBWCxFQUFjQyxJQUFJQyxJQUFsQixFQUF4QixDQUFWLENBQUw7QUFBQSxpQkFBUixFQUFQO0FBRUg7Ozs4QkFFS0MsSSxFQUFNQyxJLEVBQU07O0FBRWQsbUJBQU8sS0FBS1QsSUFBTCxDQUFVVSxLQUFWLENBQWdCRixJQUFoQixFQUFzQkMsSUFBdEIsQ0FBUDtBQUVIOzs7Z0NBRU9FLEUsRUFBSTs7QUFFUixtQkFBTyxtQkFBUUMsR0FBUixDQUFZO0FBQUEsdUJBQU1ELEdBQUcsSUFBSCxDQUFOO0FBQUEsYUFBWixDQUFQO0FBRUg7Ozs2QkFFSVAsTyxFQUFTOztBQUVWLGdCQUFJQSxtQkFBbUJTLEtBQXZCLEVBQ0ksTUFBTVQsT0FBTjs7QUFFSixpQkFBS0wsT0FBTCxDQUFhZSxPQUFiLENBQXFCVixPQUFyQjtBQUVIOzs7Ozs7a0JBSVVSLFEiLCJmaWxlIjoiR3VhcmRpYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5pbXBvcnQge01lc3NhZ2VEcm9wcGVkRXZlbnQsIFNlbGVjdEZhaWxlZEV2ZW50fSBmcm9tICcuL2Rpc3BhdGNoL2V2ZW50cyc7XG5pbXBvcnQgeyBlc2NhbGF0ZSB9IGZyb20gJy4vZGlzcGF0Y2gvc3RyYXRlZ3knO1xuXG4vKipcbiAqIEd1YXJkaWFuXG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBpbXBsZW1lbnRzIHtSZWZlcmVuY2V9XG4gKiBAaW1wbGVtZW50cyB7TWFpbGJveH1cbiAqIEBpbXBsZW1lbnRzIHtEaXNwYXRjaGVyfVxuICovXG5leHBvcnQgY2xhc3MgR3VhcmRpYW4ge1xuXG4gICAgY29uc3RydWN0b3Ioc3lzdGVtKSB7XG5cbiAgICAgICAgYmVvZih7IHN5c3RlbSB9KS5pbnRlcmZhY2UoU3lzdGVtKTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0gPSBzeXN0ZW07XG4gICAgICAgIHRoaXMudHJlZSA9IG5ldyBDaGlsZENvbnRleHQoJy8nLCB0aGlzLCB0aGlzLCB7IHN0cmF0ZWd5OiBlc2NhbGF0ZSwgZGlzcGF0Y2g6IHRoaXMgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiAnLyc7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcm9vdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG5vbmUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHsgdGVsbDogbSA9PiB0aGlzLnRlbGwobmV3IE1lc3NhZ2VEcm9wcGVkRXZlbnQoeyBtZXNzYWdlOiBtLCB0bzogJzxub25lPicgfSkpIH07XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIHRoaXMudGVsbChuZXcgU2VsZWN0RmFpbGVkRXZlbnQoe3BhdGh9KSk7XG4gICAgICAgIHJldHVybiB7IHRlbGw6IG0gPT4gdGhpcy50ZWxsKG5ldyBNZXNzYWdlRHJvcHBlZEV2ZW50KHsgbWVzc2FnZTogbSwgdG86IHBhdGggfSkpIH07XG5cbiAgICB9XG5cbiAgICBzcGF3bihzcGVjLCBuYW1lKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudHJlZS5zcGF3bihzcGVjLCBuYW1lKTtcblxuICAgIH1cblxuICAgIHJlY2VpdmUoY2IpIHtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4gY2IobnVsbCkpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlKSB7XG5cbiAgICAgICAgaWYgKG1lc3NhZ2UgaW5zdGFuY2VvZiBFcnJvcilcbiAgICAgICAgICAgIHRocm93IG1lc3NhZ2U7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtLnB1Ymxpc2gobWVzc2FnZSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3VhcmRpYW5cbiJdfQ==
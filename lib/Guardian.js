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

            if (message instanceof Error) throw message;

            this._system.publish(message);
        }
    }]);

    return Guardian;
}();

exports.default = Guardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJ0cmVlIiwic3RyYXRlZ3kiLCJkaXNwYXRjaCIsInNlbGYiLCJwYXRoIiwidGVsbCIsIm1lc3NhZ2UiLCJtIiwidG8iLCJzcGVjIiwibmFtZSIsInNwYXduIiwiY2IiLCJ0cnkiLCJFcnJvciIsInB1Ymxpc2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUE7Ozs7Ozs7SUFPYUEsUSxXQUFBQSxRO0FBRVQsc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFFaEIsNEJBQUssRUFBRUEsY0FBRixFQUFMLEVBQWlCQyxTQUFqQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWVGLE1BQWY7QUFDQSxhQUFLRyxJQUFMLEdBQVksMkJBQWlCLEdBQWpCLEVBQXNCLElBQXRCLEVBQTRCLElBQTVCLEVBQWtDLEVBQUVDLDRCQUFGLEVBQXNCQyxVQUFVLElBQWhDLEVBQWxDLENBQVo7QUFFSDs7OzsrQkFFTTs7QUFFSCxtQkFBTyxHQUFQO0FBRUg7OzsrQkFFTTs7QUFFSCxtQkFBTyxJQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBTyxJQUFQO0FBRUg7OzsrQkFFTTs7QUFFSCxtQkFBTyxJQUFQO0FBRUg7OzsrQkFFTTs7QUFFSCxtQkFBTyxLQUFLQyxJQUFMLEVBQVA7QUFFSDs7OytCQUVNQyxJLEVBQU07QUFBQTs7QUFFVCxtQkFBTyxFQUFFQyxNQUFNO0FBQUEsMkJBQUssTUFBS0EsSUFBTCxDQUFVLDZCQUFtQixFQUFFQyxTQUFTQyxDQUFYLEVBQWNDLElBQUlKLElBQWxCLEVBQW5CLENBQVYsQ0FBTDtBQUFBLGlCQUFSLEVBQVA7QUFFSDs7OzhCQUVLSyxJLEVBQU1DLEksRUFBTTs7QUFFZCxtQkFBTyxLQUFLVixJQUFMLENBQVVXLEtBQVYsQ0FBZ0JGLElBQWhCLEVBQXNCQyxJQUF0QixDQUFQO0FBRUg7OztnQ0FFT0UsRSxFQUFJOztBQUVSLG1CQUFPLG1CQUFRQyxHQUFSLENBQVk7QUFBQSx1QkFBTUQsR0FBRyxJQUFILENBQU47QUFBQSxhQUFaLENBQVA7QUFFSDs7OzZCQUVJTixPLEVBQVM7O0FBRVYsZ0JBQUlBLG1CQUFtQlEsS0FBdkIsRUFDSSxNQUFNUixPQUFOOztBQUVKLGlCQUFLUCxPQUFMLENBQWFnQixPQUFiLENBQXFCVCxPQUFyQjtBQUVIOzs7Ozs7a0JBSVVWLFEiLCJmaWxlIjoiR3VhcmRpYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5pbXBvcnQgRHJvcHBlZE1lc3NhZ2UgZnJvbSAnLi9kaXNwYXRjaC9Ecm9wcGVkTWVzc2FnZSc7XG5pbXBvcnQgeyBlc2NhbGF0ZSB9IGZyb20gJy4vZGlzcGF0Y2gvc3RyYXRlZ3knO1xuXG4vKipcbiAqIEd1YXJkaWFuXG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBpbXBsZW1lbnRzIHtSZWZlcmVuY2V9XG4gKiBAaW1wbGVtZW50cyB7TWFpbGJveH1cbiAqIEBpbXBsZW1lbnRzIHtEaXNwYXRjaGVyfVxuICovXG5leHBvcnQgY2xhc3MgR3VhcmRpYW4ge1xuXG4gICAgY29uc3RydWN0b3Ioc3lzdGVtKSB7XG5cbiAgICAgICAgYmVvZih7IHN5c3RlbSB9KS5pbnRlcmZhY2UoU3lzdGVtKTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0gPSBzeXN0ZW07XG4gICAgICAgIHRoaXMudHJlZSA9IG5ldyBDaGlsZENvbnRleHQoJy8nLCB0aGlzLCB0aGlzLCB7IHN0cmF0ZWd5OiBlc2NhbGF0ZSwgZGlzcGF0Y2g6IHRoaXMgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiAnLyc7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcm9vdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG5vbmUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZigpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICByZXR1cm4geyB0ZWxsOiBtID0+IHRoaXMudGVsbChuZXcgRHJvcHBlZE1lc3NhZ2UoeyBtZXNzYWdlOiBtLCB0bzogcGF0aCB9KSkgfTtcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy50cmVlLnNwYXduKHNwZWMsIG5hbWUpO1xuXG4gICAgfVxuXG4gICAgcmVjZWl2ZShjYikge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnRyeSgoKSA9PiBjYihudWxsKSk7XG5cbiAgICB9XG5cbiAgICB0ZWxsKG1lc3NhZ2UpIHtcblxuICAgICAgICBpZiAobWVzc2FnZSBpbnN0YW5jZW9mIEVycm9yKVxuICAgICAgICAgICAgdGhyb3cgbWVzc2FnZTtcblxuICAgICAgICB0aGlzLl9zeXN0ZW0ucHVibGlzaChtZXNzYWdlKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBHdWFyZGlhblxuIl19
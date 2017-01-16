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
        this._tree = new _ChildContext2.default('', this, this, { strategy: strategy, dispatch: this });
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
    }]);

    return Guardian;
}();

exports.default = Guardian;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJzdHJhdGVneSIsImUiLCJHdWFyZGlhbiIsInN5c3RlbSIsImludGVyZmFjZSIsIl9zeXN0ZW0iLCJfdHJlZSIsImRpc3BhdGNoIiwicGF0aCIsInNwZWMiLCJuYW1lIiwic3Bhd24iLCJjYiIsInRyeSIsIm1lc3NhZ2UiLCJwdWJsaXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQSxJQUFNQSxXQUFXLFNBQVhBLFFBQVcsSUFBSztBQUFFLFVBQU1DLENBQU47QUFBVSxDQUFsQzs7QUFFQTs7Ozs7Ozs7SUFPYUMsUSxXQUFBQSxRO0FBRVQsc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFFaEIsNEJBQUssRUFBRUEsY0FBRixFQUFMLEVBQWlCQyxTQUFqQjs7QUFFQSxhQUFLQyxPQUFMLEdBQWVGLE1BQWY7QUFDQSxhQUFLRyxLQUFMLEdBQWEsMkJBQWlCLEVBQWpCLEVBQXFCLElBQXJCLEVBQTJCLElBQTNCLEVBQWlDLEVBQUVOLGtCQUFGLEVBQVlPLFVBQVUsSUFBdEIsRUFBakMsQ0FBYjtBQUVIOzs7OytCQUVNOztBQUVILG1CQUFPLEVBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLElBQVA7QUFFSDs7O2lDQUVROztBQUVMLG1CQUFPLElBQVA7QUFFSDs7OytCQUVNOztBQUVILG1CQUFPLElBQVA7QUFFSDs7OytCQUVNQyxJLEVBQU07O0FBRVQsbUJBQU8sSUFBUDtBQUVIOzs7OEJBRUtDLEksRUFBTUMsSSxFQUFNOztBQUVkLG1CQUFPLEtBQUtKLEtBQUwsQ0FBV0ssS0FBWCxDQUFpQkYsSUFBakIsRUFBdUJDLElBQXZCLENBQVA7QUFFSDs7O2dDQUVPRSxFLEVBQUk7O0FBRVIsbUJBQU8sbUJBQVFDLEdBQVIsQ0FBWTtBQUFBLHVCQUFNRCxHQUFHLElBQUgsQ0FBTjtBQUFBLGFBQVosQ0FBUDtBQUVIOzs7NkJBRUlFLE8sRUFBUzs7QUFFVixpQkFBS1QsT0FBTCxDQUFhVSxPQUFiLENBQXFCRCxPQUFyQjtBQUVIOzs7Ozs7a0JBSVVaLFEiLCJmaWxlIjoiR3VhcmRpYW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBQcm9taXNlIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5cbmNvbnN0IHN0cmF0ZWd5ID0gZSA9PiB7IHRocm93IGU7IH1cblxuLyoqXG4gKiBHdWFyZGlhblxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAaW1wbGVtZW50cyB7UmVmZXJlbmNlfVxuICogQGltcGxlbWVudHMge01haWxib3h9XG4gKiBAaW1wbGVtZW50cyB7RGlzcGF0Y2hlcn1cbiAqL1xuZXhwb3J0IGNsYXNzIEd1YXJkaWFuIHtcblxuICAgIGNvbnN0cnVjdG9yKHN5c3RlbSkge1xuXG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtID0gc3lzdGVtO1xuICAgICAgICB0aGlzLl90cmVlID0gbmV3IENoaWxkQ29udGV4dCgnJywgdGhpcywgdGhpcywgeyBzdHJhdGVneSwgZGlzcGF0Y2g6IHRoaXMgfSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiAnJztcblxuICAgIH1cblxuICAgIHNlbGYoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBwYXJlbnQoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICByb290KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHNwYXduKHNwZWMsIG5hbWUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdHJlZS5zcGF3bihzcGVjLCBuYW1lKTtcblxuICAgIH1cblxuICAgIHJlY2VpdmUoY2IpIHtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCkgPT4gY2IobnVsbCkpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlKSB7XG5cbiAgICAgICAgdGhpcy5fc3lzdGVtLnB1Ymxpc2gobWVzc2FnZSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3VhcmRpYW5cbiJdfQ==
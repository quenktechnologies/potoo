'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Reference = require('./Reference');

var _Reference2 = _interopRequireDefault(_Reference);

var _System = require('./System');

var _System2 = _interopRequireDefault(_System);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

var _SimpleDispatcher = require('./dispatch/SimpleDispatcher');

var _SimpleDispatcher2 = _interopRequireDefault(_SimpleDispatcher);

var _SimpleMailbox = require('./dispatch/SimpleMailbox');

var _SimpleMailbox2 = _interopRequireDefault(_SimpleMailbox);

var _RunningState = require('./state/RunningState');

var _RunningState2 = _interopRequireDefault(_RunningState);

var _ConcernFactory = require('./ConcernFactory');

var _ConcernFactory2 = _interopRequireDefault(_ConcernFactory);

var _Address = require('./Address');

var _Address2 = _interopRequireDefault(_Address);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ChildContext is the Context of each self created in this address space.
 * @implements {RefFactory}
 * @implements {Context}
 * @param {string} path
 * @param {Context} [parent]
 * @param {ConcernFactory} factory
 * @param {System} system
 */
var ChildContext = function () {
    function ChildContext(path, parent, factory, system) {
        _classCallCheck(this, ChildContext);

        (0, _beof2.default)({ path: path }).string();
        (0, _beof2.default)({ parent: parent }).optional().interface(_Context2.default);
        (0, _beof2.default)({ factory: factory }).interface(_ConcernFactory2.default);
        (0, _beof2.default)({ system: system }).interface(_System2.default);

        this._path = path;
        this._parent = parent;
        this._system = system;
        this._children = [];

        //The order these are called in is important
        this._ref = factory.reference(this);
        this._dispatcher = factory.dispatcher(this);
        this._mailbox = factory.mailbox(this._dispatcher);

        this._dispatcher.executeOnStart();
    }

    _createClass(ChildContext, [{
        key: 'path',
        value: function path() {

            return this._path;
        }
    }, {
        key: 'self',
        value: function self() {

            return this._ref;
        }
    }, {
        key: 'parent',
        value: function parent() {

            return this._parent;
        }
    }, {
        key: 'isChild',
        value: function isChild(ref) {

            var ret = false;

            this._children.forEach(function (child) {

                if (child.self() === ref) ret = true;
            });

            return ret;
        }
    }, {
        key: 'children',
        value: function children() {

            return this._children.slice();
        }
    }, {
        key: 'mailbox',
        value: function mailbox() {

            return this._mailbox;
        }
    }, {
        key: 'dispatcher',
        value: function dispatcher() {

            return this._dispatcher;
        }
    }, {
        key: 'system',
        value: function system() {

            return this._system;
        }
    }, {
        key: 'concernOf',
        value: function concernOf(factory, name) {

            (0, _beof2.default)({ factory: factory }).interface(_ConcernFactory2.default);
            (0, _beof2.default)({ name: name }).string();

            var context = new ChildContext(this._path + '/' + name, this, factory, this._system);
            this._children.push(context);
            return context.self();
        }
    }, {
        key: 'select',
        value: function select(path) {

            (0, _beof2.default)({ path: path }).string();

            var address = _Address2.default.fromString(path);
            var childs = this.children();
            var parent = this.parent();

            var next = function next(child) {

                var ref;

                if (!child) {

                    return parent.select(address.toString());
                } else if (address.is(child.path())) {

                    return child.self();
                } else if (address.isBelow(child.path())) {

                    return child.select(path);
                }

                return next(childs.pop());
            };

            return next(childs.pop());
        }
    }, {
        key: 'stop',
        value: function stop() {}
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsiQ2hpbGRDb250ZXh0IiwicGF0aCIsInBhcmVudCIsImZhY3RvcnkiLCJzeXN0ZW0iLCJzdHJpbmciLCJvcHRpb25hbCIsImludGVyZmFjZSIsIl9wYXRoIiwiX3BhcmVudCIsIl9zeXN0ZW0iLCJfY2hpbGRyZW4iLCJfcmVmIiwicmVmZXJlbmNlIiwiX2Rpc3BhdGNoZXIiLCJkaXNwYXRjaGVyIiwiX21haWxib3giLCJtYWlsYm94IiwiZXhlY3V0ZU9uU3RhcnQiLCJyZWYiLCJyZXQiLCJmb3JFYWNoIiwiY2hpbGQiLCJzZWxmIiwic2xpY2UiLCJuYW1lIiwiY29udGV4dCIsInB1c2giLCJhZGRyZXNzIiwiZnJvbVN0cmluZyIsImNoaWxkcyIsImNoaWxkcmVuIiwibmV4dCIsInNlbGVjdCIsInRvU3RyaW5nIiwiaXMiLCJpc0JlbG93IiwicG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7O0lBU01BLFk7QUFFRiwwQkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEJDLE9BQTFCLEVBQW1DQyxNQUFuQyxFQUEyQztBQUFBOztBQUV2Qyw0QkFBSyxFQUFFSCxVQUFGLEVBQUwsRUFBZUksTUFBZjtBQUNBLDRCQUFLLEVBQUVILGNBQUYsRUFBTCxFQUFpQkksUUFBakIsR0FBNEJDLFNBQTVCO0FBQ0EsNEJBQUssRUFBRUosZ0JBQUYsRUFBTCxFQUFrQkksU0FBbEI7QUFDQSw0QkFBSyxFQUFFSCxjQUFGLEVBQUwsRUFBaUJHLFNBQWpCOztBQUVBLGFBQUtDLEtBQUwsR0FBYVAsSUFBYjtBQUNBLGFBQUtRLE9BQUwsR0FBZVAsTUFBZjtBQUNBLGFBQUtRLE9BQUwsR0FBZU4sTUFBZjtBQUNBLGFBQUtPLFNBQUwsR0FBaUIsRUFBakI7O0FBRUE7QUFDQSxhQUFLQyxJQUFMLEdBQVlULFFBQVFVLFNBQVIsQ0FBa0IsSUFBbEIsQ0FBWjtBQUNBLGFBQUtDLFdBQUwsR0FBbUJYLFFBQVFZLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBbkI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCYixRQUFRYyxPQUFSLENBQWdCLEtBQUtILFdBQXJCLENBQWhCOztBQUVBLGFBQUtBLFdBQUwsQ0FBaUJJLGNBQWpCO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS1YsS0FBWjtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0ksSUFBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0gsT0FBWjtBQUVIOzs7Z0NBRU9VLEcsRUFBSzs7QUFFVCxnQkFBSUMsTUFBTSxLQUFWOztBQUVBLGlCQUFLVCxTQUFMLENBQWVVLE9BQWYsQ0FBdUIsaUJBQVM7O0FBRTVCLG9CQUFJQyxNQUFNQyxJQUFOLE9BQWlCSixHQUFyQixFQUNJQyxNQUFNLElBQU47QUFFUCxhQUxEOztBQU9BLG1CQUFPQSxHQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLVCxTQUFMLENBQWVhLEtBQWYsRUFBUDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sS0FBS1IsUUFBWjtBQUVIOzs7cUNBRVk7O0FBRVQsbUJBQU8sS0FBS0YsV0FBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0osT0FBWjtBQUVIOzs7a0NBRVNQLE8sRUFBU3NCLEksRUFBTTs7QUFFckIsZ0NBQUssRUFBRXRCLGdCQUFGLEVBQUwsRUFBa0JJLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRWtCLFVBQUYsRUFBTCxFQUFlcEIsTUFBZjs7QUFFQSxnQkFBSXFCLFVBQVUsSUFBSTFCLFlBQUosQ0FBb0IsS0FBS1EsS0FBekIsU0FBa0NpQixJQUFsQyxFQUEwQyxJQUExQyxFQUFnRHRCLE9BQWhELEVBQXlELEtBQUtPLE9BQTlELENBQWQ7QUFDQSxpQkFBS0MsU0FBTCxDQUFlZ0IsSUFBZixDQUFvQkQsT0FBcEI7QUFDQSxtQkFBT0EsUUFBUUgsSUFBUixFQUFQO0FBRUg7OzsrQkFFTXRCLEksRUFBTTs7QUFFVCxnQ0FBSyxFQUFFQSxVQUFGLEVBQUwsRUFBZUksTUFBZjs7QUFFQSxnQkFBSXVCLFVBQVUsa0JBQVFDLFVBQVIsQ0FBbUI1QixJQUFuQixDQUFkO0FBQ0EsZ0JBQUk2QixTQUFTLEtBQUtDLFFBQUwsRUFBYjtBQUNBLGdCQUFJN0IsU0FBUyxLQUFLQSxNQUFMLEVBQWI7O0FBRUEsZ0JBQUk4QixPQUFPLFNBQVBBLElBQU8sUUFBUzs7QUFFaEIsb0JBQUliLEdBQUo7O0FBRUEsb0JBQUksQ0FBQ0csS0FBTCxFQUFZOztBQUVSLDJCQUFPcEIsT0FBTytCLE1BQVAsQ0FBY0wsUUFBUU0sUUFBUixFQUFkLENBQVA7QUFFSCxpQkFKRCxNQUlPLElBQUlOLFFBQVFPLEVBQVIsQ0FBV2IsTUFBTXJCLElBQU4sRUFBWCxDQUFKLEVBQThCOztBQUVqQywyQkFBT3FCLE1BQU1DLElBQU4sRUFBUDtBQUVILGlCQUpNLE1BSUEsSUFBSUssUUFBUVEsT0FBUixDQUFnQmQsTUFBTXJCLElBQU4sRUFBaEIsQ0FBSixFQUFtQzs7QUFFdEMsMkJBQU9xQixNQUFNVyxNQUFOLENBQWFoQyxJQUFiLENBQVA7QUFFSDs7QUFFRCx1QkFBTytCLEtBQUtGLE9BQU9PLEdBQVAsRUFBTCxDQUFQO0FBQ0gsYUFuQkQ7O0FBcUJBLG1CQUFPTCxLQUFLRixPQUFPTyxHQUFQLEVBQUwsQ0FBUDtBQUVIOzs7K0JBRU0sQ0FBRTs7Ozs7O2tCQUlFckMsWSIsImZpbGUiOiJDaGlsZENvbnRleHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBSZWZlcmVuY2UgZnJvbSAnLi9SZWZlcmVuY2UnO1xuaW1wb3J0IFN5c3RlbSBmcm9tICcuL1N5c3RlbSc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuL0NvbnRleHQnO1xuaW1wb3J0IFNpbXBsZURpc3BhdGNoZXIgZnJvbSAnLi9kaXNwYXRjaC9TaW1wbGVEaXNwYXRjaGVyJztcbmltcG9ydCBTaW1wbGVNYWlsYm94IGZyb20gJy4vZGlzcGF0Y2gvU2ltcGxlTWFpbGJveCc7XG5pbXBvcnQgUnVubmluZ1N0YXRlIGZyb20gJy4vc3RhdGUvUnVubmluZ1N0YXRlJztcbmltcG9ydCBDb25jZXJuRmFjdG9yeSBmcm9tICcuL0NvbmNlcm5GYWN0b3J5JztcbmltcG9ydCBBZGRyZXNzIGZyb20gJy4vQWRkcmVzcyc7XG5cbi8qKlxuICogQ2hpbGRDb250ZXh0IGlzIHRoZSBDb250ZXh0IG9mIGVhY2ggc2VsZiBjcmVhdGVkIGluIHRoaXMgYWRkcmVzcyBzcGFjZS5cbiAqIEBpbXBsZW1lbnRzIHtSZWZGYWN0b3J5fVxuICogQGltcGxlbWVudHMge0NvbnRleHR9XG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aFxuICogQHBhcmFtIHtDb250ZXh0fSBbcGFyZW50XVxuICogQHBhcmFtIHtDb25jZXJuRmFjdG9yeX0gZmFjdG9yeVxuICogQHBhcmFtIHtTeXN0ZW19IHN5c3RlbVxuICovXG5jbGFzcyBDaGlsZENvbnRleHQge1xuXG4gICAgY29uc3RydWN0b3IocGF0aCwgcGFyZW50LCBmYWN0b3J5LCBzeXN0ZW0pIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcbiAgICAgICAgYmVvZih7IHBhcmVudCB9KS5vcHRpb25hbCgpLmludGVyZmFjZShDb250ZXh0KTtcbiAgICAgICAgYmVvZih7IGZhY3RvcnkgfSkuaW50ZXJmYWNlKENvbmNlcm5GYWN0b3J5KTtcbiAgICAgICAgYmVvZih7IHN5c3RlbSB9KS5pbnRlcmZhY2UoU3lzdGVtKTtcblxuICAgICAgICB0aGlzLl9wYXRoID0gcGF0aDtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50O1xuICAgICAgICB0aGlzLl9zeXN0ZW0gPSBzeXN0ZW07XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gW107XG5cbiAgICAgICAgLy9UaGUgb3JkZXIgdGhlc2UgYXJlIGNhbGxlZCBpbiBpcyBpbXBvcnRhbnRcbiAgICAgICAgdGhpcy5fcmVmID0gZmFjdG9yeS5yZWZlcmVuY2UodGhpcyk7XG4gICAgICAgIHRoaXMuX2Rpc3BhdGNoZXIgPSBmYWN0b3J5LmRpc3BhdGNoZXIodGhpcyk7XG4gICAgICAgIHRoaXMuX21haWxib3ggPSBmYWN0b3J5Lm1haWxib3godGhpcy5fZGlzcGF0Y2hlcik7XG5cbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlci5leGVjdXRlT25TdGFydCgpO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcGF0aDtcblxuICAgIH1cblxuICAgIHNlbGYoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3JlZjtcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcGFyZW50O1xuXG4gICAgfVxuXG4gICAgaXNDaGlsZChyZWYpIHtcblxuICAgICAgICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5fY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIGlmIChjaGlsZC5zZWxmKCkgPT09IHJlZilcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiByZXQ7XG5cbiAgICB9XG5cbiAgICBjaGlsZHJlbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fY2hpbGRyZW4uc2xpY2UoKTtcblxuICAgIH1cblxuICAgIG1haWxib3goKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX21haWxib3g7XG5cbiAgICB9XG5cbiAgICBkaXNwYXRjaGVyKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9kaXNwYXRjaGVyO1xuXG4gICAgfVxuXG4gICAgc3lzdGVtKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zeXN0ZW07XG5cbiAgICB9XG5cbiAgICBjb25jZXJuT2YoZmFjdG9yeSwgbmFtZSkge1xuXG4gICAgICAgIGJlb2YoeyBmYWN0b3J5IH0pLmludGVyZmFjZShDb25jZXJuRmFjdG9yeSk7XG4gICAgICAgIGJlb2YoeyBuYW1lIH0pLnN0cmluZygpO1xuXG4gICAgICAgIHZhciBjb250ZXh0ID0gbmV3IENoaWxkQ29udGV4dChgJHt0aGlzLl9wYXRofS8ke25hbWV9YCwgdGhpcywgZmFjdG9yeSwgdGhpcy5fc3lzdGVtKTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4ucHVzaChjb250ZXh0KTtcbiAgICAgICAgcmV0dXJuIGNvbnRleHQuc2VsZigpO1xuXG4gICAgfVxuXG4gICAgc2VsZWN0KHBhdGgpIHtcblxuICAgICAgICBiZW9mKHsgcGF0aCB9KS5zdHJpbmcoKTtcblxuICAgICAgICB2YXIgYWRkcmVzcyA9IEFkZHJlc3MuZnJvbVN0cmluZyhwYXRoKTtcbiAgICAgICAgdmFyIGNoaWxkcyA9IHRoaXMuY2hpbGRyZW4oKTtcbiAgICAgICAgdmFyIHBhcmVudCA9IHRoaXMucGFyZW50KCk7XG5cbiAgICAgICAgdmFyIG5leHQgPSBjaGlsZCA9PiB7XG5cbiAgICAgICAgICAgIHZhciByZWY7XG5cbiAgICAgICAgICAgIGlmICghY2hpbGQpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJlbnQuc2VsZWN0KGFkZHJlc3MudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcy5pcyhjaGlsZC5wYXRoKCkpKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQuc2VsZigpO1xuXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFkZHJlc3MuaXNCZWxvdyhjaGlsZC5wYXRoKCkpKSB7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gY2hpbGQuc2VsZWN0KHBhdGgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbmV4dChjaGlsZHMucG9wKCkpO1xuXG4gICAgfVxuXG4gICAgc3RvcCgpIHt9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=
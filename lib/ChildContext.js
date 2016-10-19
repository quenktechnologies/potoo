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
    }]);

    return ChildContext;
}();

exports.default = ChildContext;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsiQ2hpbGRDb250ZXh0IiwicGF0aCIsInBhcmVudCIsImZhY3RvcnkiLCJzeXN0ZW0iLCJzdHJpbmciLCJvcHRpb25hbCIsImludGVyZmFjZSIsIl9wYXRoIiwiX3BhcmVudCIsIl9zeXN0ZW0iLCJfY2hpbGRyZW4iLCJfcmVmIiwicmVmZXJlbmNlIiwiX2Rpc3BhdGNoZXIiLCJkaXNwYXRjaGVyIiwiX21haWxib3giLCJtYWlsYm94IiwiZXhlY3V0ZU9uU3RhcnQiLCJyZWYiLCJyZXQiLCJmb3JFYWNoIiwiY2hpbGQiLCJzZWxmIiwic2xpY2UiLCJuYW1lIiwiY29udGV4dCIsInB1c2giLCJhZGRyZXNzIiwiZnJvbVN0cmluZyIsImNoaWxkcyIsImNoaWxkcmVuIiwibmV4dCIsInNlbGVjdCIsInRvU3RyaW5nIiwiaXMiLCJpc0JlbG93IiwicG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7O0lBU01BLFk7QUFFRiwwQkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEJDLE9BQTFCLEVBQW1DQyxNQUFuQyxFQUEyQztBQUFBOztBQUV2Qyw0QkFBSyxFQUFFSCxVQUFGLEVBQUwsRUFBZUksTUFBZjtBQUNBLDRCQUFLLEVBQUVILGNBQUYsRUFBTCxFQUFpQkksUUFBakIsR0FBNEJDLFNBQTVCO0FBQ0EsNEJBQUssRUFBRUosZ0JBQUYsRUFBTCxFQUFrQkksU0FBbEI7QUFDQSw0QkFBSyxFQUFFSCxjQUFGLEVBQUwsRUFBaUJHLFNBQWpCOztBQUVBLGFBQUtDLEtBQUwsR0FBYVAsSUFBYjtBQUNBLGFBQUtRLE9BQUwsR0FBZVAsTUFBZjtBQUNBLGFBQUtRLE9BQUwsR0FBZU4sTUFBZjtBQUNBLGFBQUtPLFNBQUwsR0FBaUIsRUFBakI7O0FBRUE7QUFDQSxhQUFLQyxJQUFMLEdBQVlULFFBQVFVLFNBQVIsQ0FBa0IsSUFBbEIsQ0FBWjtBQUNBLGFBQUtDLFdBQUwsR0FBbUJYLFFBQVFZLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBbkI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCYixRQUFRYyxPQUFSLENBQWdCLEtBQUtILFdBQXJCLENBQWhCOztBQUVBLGFBQUtBLFdBQUwsQ0FBaUJJLGNBQWpCO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS1YsS0FBWjtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0ksSUFBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0gsT0FBWjtBQUVIOzs7Z0NBRU9VLEcsRUFBSzs7QUFFVCxnQkFBSUMsTUFBTSxLQUFWOztBQUVBLGlCQUFLVCxTQUFMLENBQWVVLE9BQWYsQ0FBdUIsaUJBQVM7O0FBRTVCLG9CQUFJQyxNQUFNQyxJQUFOLE9BQWlCSixHQUFyQixFQUNJQyxNQUFNLElBQU47QUFFUCxhQUxEOztBQU9BLG1CQUFPQSxHQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLVCxTQUFMLENBQWVhLEtBQWYsRUFBUDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sS0FBS1IsUUFBWjtBQUVIOzs7cUNBRVk7O0FBRVQsbUJBQU8sS0FBS0YsV0FBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0osT0FBWjtBQUVIOzs7a0NBRVNQLE8sRUFBU3NCLEksRUFBTTs7QUFFckIsZ0NBQUssRUFBRXRCLGdCQUFGLEVBQUwsRUFBa0JJLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRWtCLFVBQUYsRUFBTCxFQUFlcEIsTUFBZjs7QUFFQSxnQkFBSXFCLFVBQVUsSUFBSTFCLFlBQUosQ0FBb0IsS0FBS1EsS0FBekIsU0FBa0NpQixJQUFsQyxFQUEwQyxJQUExQyxFQUFnRHRCLE9BQWhELEVBQXlELEtBQUtPLE9BQTlELENBQWQ7QUFDQSxpQkFBS0MsU0FBTCxDQUFlZ0IsSUFBZixDQUFvQkQsT0FBcEI7QUFDQSxtQkFBT0EsUUFBUUgsSUFBUixFQUFQO0FBRUg7OzsrQkFFTXRCLEksRUFBTTs7QUFFVCxnQ0FBSyxFQUFFQSxVQUFGLEVBQUwsRUFBZUksTUFBZjs7QUFFQSxnQkFBSXVCLFVBQVUsa0JBQVFDLFVBQVIsQ0FBbUI1QixJQUFuQixDQUFkO0FBQ0EsZ0JBQUk2QixTQUFTLEtBQUtDLFFBQUwsRUFBYjtBQUNBLGdCQUFJN0IsU0FBUyxLQUFLQSxNQUFMLEVBQWI7O0FBRUEsZ0JBQUk4QixPQUFPLFNBQVBBLElBQU8sUUFBUzs7QUFFaEIsb0JBQUliLEdBQUo7O0FBRUEsb0JBQUksQ0FBQ0csS0FBTCxFQUFZOztBQUVSLDJCQUFPcEIsT0FBTytCLE1BQVAsQ0FBY0wsUUFBUU0sUUFBUixFQUFkLENBQVA7QUFFSCxpQkFKRCxNQUlPLElBQUlOLFFBQVFPLEVBQVIsQ0FBV2IsTUFBTXJCLElBQU4sRUFBWCxDQUFKLEVBQThCOztBQUVqQywyQkFBT3FCLE1BQU1DLElBQU4sRUFBUDtBQUVILGlCQUpNLE1BSUEsSUFBSUssUUFBUVEsT0FBUixDQUFnQmQsTUFBTXJCLElBQU4sRUFBaEIsQ0FBSixFQUFtQzs7QUFFdEMsMkJBQU9xQixNQUFNVyxNQUFOLENBQWFoQyxJQUFiLENBQVA7QUFFSDs7QUFFRCx1QkFBTytCLEtBQUtGLE9BQU9PLEdBQVAsRUFBTCxDQUFQO0FBQ0gsYUFuQkQ7O0FBcUJBLG1CQUFPTCxLQUFLRixPQUFPTyxHQUFQLEVBQUwsQ0FBUDtBQUVIOzs7Ozs7a0JBSVVyQyxZIiwiZmlsZSI6IkNoaWxkQ29udGV4dC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IFJlZmVyZW5jZSBmcm9tICcuL1JlZmVyZW5jZSc7XG5pbXBvcnQgU3lzdGVtIGZyb20gJy4vU3lzdGVtJztcbmltcG9ydCBDb250ZXh0IGZyb20gJy4vQ29udGV4dCc7XG5pbXBvcnQgU2ltcGxlRGlzcGF0Y2hlciBmcm9tICcuL2Rpc3BhdGNoL1NpbXBsZURpc3BhdGNoZXInO1xuaW1wb3J0IFNpbXBsZU1haWxib3ggZnJvbSAnLi9kaXNwYXRjaC9TaW1wbGVNYWlsYm94JztcbmltcG9ydCBSdW5uaW5nU3RhdGUgZnJvbSAnLi9zdGF0ZS9SdW5uaW5nU3RhdGUnO1xuaW1wb3J0IENvbmNlcm5GYWN0b3J5IGZyb20gJy4vQ29uY2VybkZhY3RvcnknO1xuaW1wb3J0IEFkZHJlc3MgZnJvbSAnLi9BZGRyZXNzJztcblxuLyoqXG4gKiBDaGlsZENvbnRleHQgaXMgdGhlIENvbnRleHQgb2YgZWFjaCBzZWxmIGNyZWF0ZWQgaW4gdGhpcyBhZGRyZXNzIHNwYWNlLlxuICogQGltcGxlbWVudHMge1JlZkZhY3Rvcnl9XG4gKiBAaW1wbGVtZW50cyB7Q29udGV4dH1cbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoXG4gKiBAcGFyYW0ge0NvbnRleHR9IFtwYXJlbnRdXG4gKiBAcGFyYW0ge0NvbmNlcm5GYWN0b3J5fSBmYWN0b3J5XG4gKiBAcGFyYW0ge1N5c3RlbX0gc3lzdGVtXG4gKi9cbmNsYXNzIENoaWxkQ29udGV4dCB7XG5cbiAgICBjb25zdHJ1Y3RvcihwYXRoLCBwYXJlbnQsIGZhY3RvcnksIHN5c3RlbSkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuICAgICAgICBiZW9mKHsgcGFyZW50IH0pLm9wdGlvbmFsKCkuaW50ZXJmYWNlKENvbnRleHQpO1xuICAgICAgICBiZW9mKHsgZmFjdG9yeSB9KS5pbnRlcmZhY2UoQ29uY2VybkZhY3RvcnkpO1xuICAgICAgICBiZW9mKHsgc3lzdGVtIH0pLmludGVyZmFjZShTeXN0ZW0pO1xuXG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl9wYXJlbnQgPSBwYXJlbnQ7XG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICAvL1RoZSBvcmRlciB0aGVzZSBhcmUgY2FsbGVkIGluIGlzIGltcG9ydGFudFxuICAgICAgICB0aGlzLl9yZWYgPSBmYWN0b3J5LnJlZmVyZW5jZSh0aGlzKTtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlciA9IGZhY3RvcnkuZGlzcGF0Y2hlcih0aGlzKTtcbiAgICAgICAgdGhpcy5fbWFpbGJveCA9IGZhY3RvcnkubWFpbGJveCh0aGlzLl9kaXNwYXRjaGVyKTtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmV4ZWN1dGVPblN0YXJ0KCk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcmVmO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG5cbiAgICB9XG5cbiAgICBpc0NoaWxkKHJlZikge1xuXG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcblxuICAgICAgICAgICAgaWYgKGNoaWxkLnNlbGYoKSA9PT0gcmVmKVxuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcblxuICAgIH1cblxuICAgIGNoaWxkcmVuKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5zbGljZSgpO1xuXG4gICAgfVxuXG4gICAgbWFpbGJveCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbWFpbGJveDtcblxuICAgIH1cblxuICAgIGRpc3BhdGNoZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXI7XG5cbiAgICB9XG5cbiAgICBzeXN0ZW0oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5c3RlbTtcblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBuYW1lKSB7XG5cbiAgICAgICAgYmVvZih7IGZhY3RvcnkgfSkuaW50ZXJmYWNlKENvbmNlcm5GYWN0b3J5KTtcbiAgICAgICAgYmVvZih7IG5hbWUgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ2hpbGRDb250ZXh0KGAke3RoaXMuX3BhdGh9LyR7bmFtZX1gLCB0aGlzLCBmYWN0b3J5LCB0aGlzLl9zeXN0ZW0pO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gY29udGV4dC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIHZhciBhZGRyZXNzID0gQWRkcmVzcy5mcm9tU3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgY2hpbGRzID0gdGhpcy5jaGlsZHJlbigpO1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQoKTtcblxuICAgICAgICB2YXIgbmV4dCA9IGNoaWxkID0+IHtcblxuICAgICAgICAgICAgdmFyIHJlZjtcblxuICAgICAgICAgICAgaWYgKCFjaGlsZCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5zZWxlY3QoYWRkcmVzcy50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRyZXNzLmlzKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcy5pc0JlbG93KGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=
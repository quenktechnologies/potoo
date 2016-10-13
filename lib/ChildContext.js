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
        this._dispatcher = factory.dispatcher(this);
        this._mailbox = factory.mailbox(this._dispatcher);
        this._ref = factory.reference(this);
        this._system = system;
        this._children = [];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DaGlsZENvbnRleHQuanMiXSwibmFtZXMiOlsiQ2hpbGRDb250ZXh0IiwicGF0aCIsInBhcmVudCIsImZhY3RvcnkiLCJzeXN0ZW0iLCJzdHJpbmciLCJvcHRpb25hbCIsImludGVyZmFjZSIsIl9wYXRoIiwiX3BhcmVudCIsIl9kaXNwYXRjaGVyIiwiZGlzcGF0Y2hlciIsIl9tYWlsYm94IiwibWFpbGJveCIsIl9yZWYiLCJyZWZlcmVuY2UiLCJfc3lzdGVtIiwiX2NoaWxkcmVuIiwiZXhlY3V0ZU9uU3RhcnQiLCJyZWYiLCJyZXQiLCJmb3JFYWNoIiwiY2hpbGQiLCJzZWxmIiwic2xpY2UiLCJuYW1lIiwiY29udGV4dCIsInB1c2giLCJhZGRyZXNzIiwiZnJvbVN0cmluZyIsImNoaWxkcyIsImNoaWxkcmVuIiwibmV4dCIsInNlbGVjdCIsInRvU3RyaW5nIiwiaXMiLCJpc0JlbG93IiwicG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7Ozs7O0lBU01BLFk7QUFFRiwwQkFBWUMsSUFBWixFQUFrQkMsTUFBbEIsRUFBMEJDLE9BQTFCLEVBQW1DQyxNQUFuQyxFQUEyQztBQUFBOztBQUV2Qyw0QkFBSyxFQUFFSCxVQUFGLEVBQUwsRUFBZUksTUFBZjtBQUNBLDRCQUFLLEVBQUVILGNBQUYsRUFBTCxFQUFpQkksUUFBakIsR0FBNEJDLFNBQTVCO0FBQ0EsNEJBQUssRUFBRUosZ0JBQUYsRUFBTCxFQUFrQkksU0FBbEI7QUFDQSw0QkFBSyxFQUFFSCxjQUFGLEVBQUwsRUFBaUJHLFNBQWpCOztBQUVBLGFBQUtDLEtBQUwsR0FBYVAsSUFBYjtBQUNBLGFBQUtRLE9BQUwsR0FBZVAsTUFBZjtBQUNBLGFBQUtRLFdBQUwsR0FBbUJQLFFBQVFRLFVBQVIsQ0FBbUIsSUFBbkIsQ0FBbkI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCVCxRQUFRVSxPQUFSLENBQWdCLEtBQUtILFdBQXJCLENBQWhCO0FBQ0EsYUFBS0ksSUFBTCxHQUFZWCxRQUFRWSxTQUFSLENBQWtCLElBQWxCLENBQVo7QUFDQSxhQUFLQyxPQUFMLEdBQWVaLE1BQWY7QUFDQSxhQUFLYSxTQUFMLEdBQWlCLEVBQWpCOztBQUVBLGFBQUtQLFdBQUwsQ0FBaUJRLGNBQWpCO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS1YsS0FBWjtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS00sSUFBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0wsT0FBWjtBQUVIOzs7Z0NBRU9VLEcsRUFBSzs7QUFFVCxnQkFBSUMsTUFBTSxLQUFWOztBQUVBLGlCQUFLSCxTQUFMLENBQWVJLE9BQWYsQ0FBdUIsaUJBQVM7O0FBRTVCLG9CQUFJQyxNQUFNQyxJQUFOLE9BQWlCSixHQUFyQixFQUNJQyxNQUFNLElBQU47QUFFUCxhQUxEOztBQU9BLG1CQUFPQSxHQUFQO0FBRUg7OzttQ0FFVTs7QUFFUCxtQkFBTyxLQUFLSCxTQUFMLENBQWVPLEtBQWYsRUFBUDtBQUVIOzs7a0NBRVM7O0FBRU4sbUJBQU8sS0FBS1osUUFBWjtBQUVIOzs7cUNBRVk7O0FBRVQsbUJBQU8sS0FBS0YsV0FBWjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS00sT0FBWjtBQUVIOzs7a0NBRVNiLE8sRUFBU3NCLEksRUFBTTs7QUFFckIsZ0NBQUssRUFBRXRCLGdCQUFGLEVBQUwsRUFBa0JJLFNBQWxCO0FBQ0EsZ0NBQUssRUFBRWtCLFVBQUYsRUFBTCxFQUFlcEIsTUFBZjs7QUFFQSxnQkFBSXFCLFVBQVUsSUFBSTFCLFlBQUosQ0FBb0IsS0FBS1EsS0FBekIsU0FBa0NpQixJQUFsQyxFQUEwQyxJQUExQyxFQUFnRHRCLE9BQWhELEVBQXlELEtBQUthLE9BQTlELENBQWQ7QUFDQSxpQkFBS0MsU0FBTCxDQUFlVSxJQUFmLENBQW9CRCxPQUFwQjtBQUNBLG1CQUFPQSxRQUFRSCxJQUFSLEVBQVA7QUFFSDs7OytCQUVNdEIsSSxFQUFNOztBQUVULGdDQUFLLEVBQUVBLFVBQUYsRUFBTCxFQUFlSSxNQUFmOztBQUVBLGdCQUFJdUIsVUFBVSxrQkFBUUMsVUFBUixDQUFtQjVCLElBQW5CLENBQWQ7QUFDQSxnQkFBSTZCLFNBQVMsS0FBS0MsUUFBTCxFQUFiO0FBQ0EsZ0JBQUk3QixTQUFTLEtBQUtBLE1BQUwsRUFBYjs7QUFFQSxnQkFBSThCLE9BQU8sU0FBUEEsSUFBTyxRQUFTOztBQUVoQixvQkFBSWIsR0FBSjs7QUFFQSxvQkFBSSxDQUFDRyxLQUFMLEVBQVk7O0FBRVIsMkJBQU9wQixPQUFPK0IsTUFBUCxDQUFjTCxRQUFRTSxRQUFSLEVBQWQsQ0FBUDtBQUVILGlCQUpELE1BSU8sSUFBSU4sUUFBUU8sRUFBUixDQUFXYixNQUFNckIsSUFBTixFQUFYLENBQUosRUFBOEI7O0FBRWpDLDJCQUFPcUIsTUFBTUMsSUFBTixFQUFQO0FBRUgsaUJBSk0sTUFJQSxJQUFJSyxRQUFRUSxPQUFSLENBQWdCZCxNQUFNckIsSUFBTixFQUFoQixDQUFKLEVBQW1DOztBQUV0QywyQkFBT3FCLE1BQU1XLE1BQU4sQ0FBYWhDLElBQWIsQ0FBUDtBQUVIOztBQUVELHVCQUFPK0IsS0FBS0YsT0FBT08sR0FBUCxFQUFMLENBQVA7QUFDSCxhQW5CRDs7QUFxQkEsbUJBQU9MLEtBQUtGLE9BQU9PLEdBQVAsRUFBTCxDQUFQO0FBRUg7Ozs7OztrQkFJVXJDLFkiLCJmaWxlIjoiQ2hpbGRDb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgUmVmZXJlbmNlIGZyb20gJy4vUmVmZXJlbmNlJztcbmltcG9ydCBTeXN0ZW0gZnJvbSAnLi9TeXN0ZW0nO1xuaW1wb3J0IENvbnRleHQgZnJvbSAnLi9Db250ZXh0JztcbmltcG9ydCBTaW1wbGVEaXNwYXRjaGVyIGZyb20gJy4vZGlzcGF0Y2gvU2ltcGxlRGlzcGF0Y2hlcic7XG5pbXBvcnQgU2ltcGxlTWFpbGJveCBmcm9tICcuL2Rpc3BhdGNoL1NpbXBsZU1haWxib3gnO1xuaW1wb3J0IFJ1bm5pbmdTdGF0ZSBmcm9tICcuL3N0YXRlL1J1bm5pbmdTdGF0ZSc7XG5pbXBvcnQgQ29uY2VybkZhY3RvcnkgZnJvbSAnLi9Db25jZXJuRmFjdG9yeSc7XG5pbXBvcnQgQWRkcmVzcyBmcm9tICcuL0FkZHJlc3MnO1xuXG4vKipcbiAqIENoaWxkQ29udGV4dCBpcyB0aGUgQ29udGV4dCBvZiBlYWNoIHNlbGYgY3JlYXRlZCBpbiB0aGlzIGFkZHJlc3Mgc3BhY2UuXG4gKiBAaW1wbGVtZW50cyB7UmVmRmFjdG9yeX1cbiAqIEBpbXBsZW1lbnRzIHtDb250ZXh0fVxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7Q29udGV4dH0gW3BhcmVudF1cbiAqIEBwYXJhbSB7Q29uY2VybkZhY3Rvcnl9IGZhY3RvcnlcbiAqIEBwYXJhbSB7U3lzdGVtfSBzeXN0ZW1cbiAqL1xuY2xhc3MgQ2hpbGRDb250ZXh0IHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHBhcmVudCwgZmFjdG9yeSwgc3lzdGVtKSB7XG5cbiAgICAgICAgYmVvZih7IHBhdGggfSkuc3RyaW5nKCk7XG4gICAgICAgIGJlb2YoeyBwYXJlbnQgfSkub3B0aW9uYWwoKS5pbnRlcmZhY2UoQ29udGV4dCk7XG4gICAgICAgIGJlb2YoeyBmYWN0b3J5IH0pLmludGVyZmFjZShDb25jZXJuRmFjdG9yeSk7XG4gICAgICAgIGJlb2YoeyBzeXN0ZW0gfSkuaW50ZXJmYWNlKFN5c3RlbSk7XG5cbiAgICAgICAgdGhpcy5fcGF0aCA9IHBhdGg7XG4gICAgICAgIHRoaXMuX3BhcmVudCA9IHBhcmVudDtcbiAgICAgICAgdGhpcy5fZGlzcGF0Y2hlciA9IGZhY3RvcnkuZGlzcGF0Y2hlcih0aGlzKTtcbiAgICAgICAgdGhpcy5fbWFpbGJveCA9IGZhY3RvcnkubWFpbGJveCh0aGlzLl9kaXNwYXRjaGVyKTtcbiAgICAgICAgdGhpcy5fcmVmID0gZmFjdG9yeS5yZWZlcmVuY2UodGhpcyk7XG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcbiAgICAgICAgdGhpcy5fY2hpbGRyZW4gPSBbXTtcblxuICAgICAgICB0aGlzLl9kaXNwYXRjaGVyLmV4ZWN1dGVPblN0YXJ0KCk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXRoO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcmVmO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG5cbiAgICB9XG5cbiAgICBpc0NoaWxkKHJlZikge1xuXG4gICAgICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgICAgICB0aGlzLl9jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcblxuICAgICAgICAgICAgaWYgKGNoaWxkLnNlbGYoKSA9PT0gcmVmKVxuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XG5cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJldDtcblxuICAgIH1cblxuICAgIGNoaWxkcmVuKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jaGlsZHJlbi5zbGljZSgpO1xuXG4gICAgfVxuXG4gICAgbWFpbGJveCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fbWFpbGJveDtcblxuICAgIH1cblxuICAgIGRpc3BhdGNoZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc3BhdGNoZXI7XG5cbiAgICB9XG5cbiAgICBzeXN0ZW0oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3N5c3RlbTtcblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBuYW1lKSB7XG5cbiAgICAgICAgYmVvZih7IGZhY3RvcnkgfSkuaW50ZXJmYWNlKENvbmNlcm5GYWN0b3J5KTtcbiAgICAgICAgYmVvZih7IG5hbWUgfSkuc3RyaW5nKCk7XG5cbiAgICAgICAgdmFyIGNvbnRleHQgPSBuZXcgQ2hpbGRDb250ZXh0KGAke3RoaXMuX3BhdGh9LyR7bmFtZX1gLCB0aGlzLCBmYWN0b3J5LCB0aGlzLl9zeXN0ZW0pO1xuICAgICAgICB0aGlzLl9jaGlsZHJlbi5wdXNoKGNvbnRleHQpO1xuICAgICAgICByZXR1cm4gY29udGV4dC5zZWxmKCk7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIGJlb2YoeyBwYXRoIH0pLnN0cmluZygpO1xuXG4gICAgICAgIHZhciBhZGRyZXNzID0gQWRkcmVzcy5mcm9tU3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgY2hpbGRzID0gdGhpcy5jaGlsZHJlbigpO1xuICAgICAgICB2YXIgcGFyZW50ID0gdGhpcy5wYXJlbnQoKTtcblxuICAgICAgICB2YXIgbmV4dCA9IGNoaWxkID0+IHtcblxuICAgICAgICAgICAgdmFyIHJlZjtcblxuICAgICAgICAgICAgaWYgKCFjaGlsZCkge1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHBhcmVudC5zZWxlY3QoYWRkcmVzcy50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgfSBlbHNlIGlmIChhZGRyZXNzLmlzKGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxmKCk7XG5cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYWRkcmVzcy5pc0JlbG93KGNoaWxkLnBhdGgoKSkpIHtcblxuICAgICAgICAgICAgICAgIHJldHVybiBjaGlsZC5zZWxlY3QocGF0aCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIG5leHQoY2hpbGRzLnBvcCgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXh0KGNoaWxkcy5wb3AoKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRDb250ZXh0XG4iXX0=
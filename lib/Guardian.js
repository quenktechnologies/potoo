'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Address = require('./Address');

var _Address2 = _interopRequireDefault(_Address);

var _AppConcern = require('./AppConcern');

var _AppConcern2 = _interopRequireDefault(_AppConcern);

var _ConcernFactory = require('./ConcernFactory');

var _ConcernFactory2 = _interopRequireDefault(_ConcernFactory);

var _ChildContext = require('./ChildContext');

var _ChildContext2 = _interopRequireDefault(_ChildContext);

var _NullReference = require('./NullReference');

var _NullReference2 = _interopRequireDefault(_NullReference);

var _Defaults = require('./Defaults');

var _Defaults2 = _interopRequireDefault(_Defaults);

var _DeadLetters = require('./DeadLetters');

var _DeadLetters2 = _interopRequireDefault(_DeadLetters);

var _Monitor = require('./remote/Monitor');

var _Monitor2 = _interopRequireDefault(_Monitor);

var _Peer = require('./remote/Peer');

var _Peer2 = _interopRequireDefault(_Peer);

var _RemoteReference = require('./remote/RemoteReference');

var _RemoteReference2 = _interopRequireDefault(_RemoteReference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Guardian
 */
var Guardian = function () {
    function Guardian(system) {
        _classCallCheck(this, Guardian);

        this.deadLetters = new _DeadLetters2.default(system);
        this.app = new _ChildContext2.default('/app', this, new _Defaults2.default(function (context) {
            return new _AppConcern2.default(context);
        }), system);
        this.peers = [];
        this._system = system;
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

            return null;
        }
    }, {
        key: 'isChild',
        value: function isChild(ref) {

            return [this.app.self(), this.sys.self()].indexOf(ref) > -1;
        }
    }, {
        key: 'children',
        value: function children() {

            return [this.app.self(), this.sys.self()];
        }
    }, {
        key: 'mailbox',
        value: function mailbox() {

            return this;
        }
    }, {
        key: 'dispatcher',
        value: function dispatcher() {

            return this;
        }
    }, {
        key: 'watch',
        value: function watch(ref) {

            throw new ReferenceError('watch(): is not implemented!');
        }
    }, {
        key: 'unwatch',
        value: function unwatch(ref) {

            throw new ReferenceError('unwatch(): is not implemented!');
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            this.deadLetters.tell(message, from);
        }
    }, {
        key: 'select',
        value: function select(path) {

            var addr = _Address2.default.fromString(path);
            var peer = null;

            if (addr.isRemote()) {

                this.peers.forEach(function (p) {

                    if (p.handles(addr)) peer = p;
                });
            }

            if (peer !== null) return new _RemoteReference2.default(path, peer);

            return new _NullReference2.default(path, this.deadLetters);
        }
    }, {
        key: 'concernOf',
        value: function concernOf(factory, name) {

            throw new ReferenceError('concernOf(): is not implemented!');
        }
    }, {
        key: 'system',
        value: function system() {

            return this._system;
        }
    }, {
        key: 'enqueue',
        value: function enqueue(msg) {

            throw new TypeError('Cannot enqueue to \'/\'');
        }
    }, {
        key: 'dequeue',
        value: function dequeue() {

            throw new TypeError('Cannot dequeue \'/\'');
        }
    }, {
        key: 'executeChildError',
        value: function executeChildError(e, child) {

            throw e;
        }
    }, {
        key: 'peer',
        value: function peer(instance, config) {

            (0, _beof2.default)({ instance: instance }).interface(_Peer2.default);
            (0, _beof2.default)({ config: config }).optional().object();

            var monitor = new _Monitor2.default(instance, this._system, config);

            monitor.associate();
            this.peers.push(instance);
        }
    }]);

    return Guardian;
}();

exports.default = Guardian;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJHdWFyZGlhbiIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwiYXBwIiwiY29udGV4dCIsInBlZXJzIiwiX3N5c3RlbSIsInJlZiIsInNlbGYiLCJzeXMiLCJpbmRleE9mIiwiUmVmZXJlbmNlRXJyb3IiLCJtZXNzYWdlIiwiZnJvbSIsInRlbGwiLCJwYXRoIiwiYWRkciIsImZyb21TdHJpbmciLCJwZWVyIiwiaXNSZW1vdGUiLCJmb3JFYWNoIiwicCIsImhhbmRsZXMiLCJmYWN0b3J5IiwibmFtZSIsIm1zZyIsIlR5cGVFcnJvciIsImUiLCJjaGlsZCIsImluc3RhbmNlIiwiY29uZmlnIiwiaW50ZXJmYWNlIiwib3B0aW9uYWwiLCJvYmplY3QiLCJtb25pdG9yIiwiYXNzb2NpYXRlIiwicHVzaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7SUFHTUEsUTtBQUVGLHNCQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBRWhCLGFBQUtDLFdBQUwsR0FBbUIsMEJBQWdCRCxNQUFoQixDQUFuQjtBQUNBLGFBQUtFLEdBQUwsR0FBVywyQkFBaUIsTUFBakIsRUFBeUIsSUFBekIsRUFBK0IsdUJBQWE7QUFBQSxtQkFBVyx5QkFBZUMsT0FBZixDQUFYO0FBQUEsU0FBYixDQUEvQixFQUFpRkgsTUFBakYsQ0FBWDtBQUNBLGFBQUtJLEtBQUwsR0FBYSxFQUFiO0FBQ0EsYUFBS0MsT0FBTCxHQUFlTCxNQUFmO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sR0FBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7Z0NBRU9NLEcsRUFBSzs7QUFFVCxtQkFBUSxDQUFDLEtBQUtKLEdBQUwsQ0FBU0ssSUFBVCxFQUFELEVBQWtCLEtBQUtDLEdBQUwsQ0FBU0QsSUFBVCxFQUFsQixFQUFtQ0UsT0FBbkMsQ0FBMkNILEdBQTNDLElBQWtELENBQUMsQ0FBM0Q7QUFFSDs7O21DQUVVOztBQUVQLG1CQUFPLENBQUMsS0FBS0osR0FBTCxDQUFTSyxJQUFULEVBQUQsRUFBa0IsS0FBS0MsR0FBTCxDQUFTRCxJQUFULEVBQWxCLENBQVA7QUFFSDs7O2tDQUVTOztBQUVOLG1CQUFPLElBQVA7QUFFSDs7O3FDQUVZOztBQUVULG1CQUFPLElBQVA7QUFFSDs7OzhCQUVLRCxHLEVBQUs7O0FBRVAsa0JBQU0sSUFBSUksY0FBSixDQUFtQiw4QkFBbkIsQ0FBTjtBQUVIOzs7Z0NBRU9KLEcsRUFBSzs7QUFFVCxrQkFBTSxJQUFJSSxjQUFKLENBQW1CLGdDQUFuQixDQUFOO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLWCxXQUFMLENBQWlCWSxJQUFqQixDQUFzQkYsT0FBdEIsRUFBK0JDLElBQS9CO0FBRUg7OzsrQkFFTUUsSSxFQUFNOztBQUVULGdCQUFJQyxPQUFPLGtCQUFRQyxVQUFSLENBQW1CRixJQUFuQixDQUFYO0FBQ0EsZ0JBQUlHLE9BQU8sSUFBWDs7QUFFQSxnQkFBSUYsS0FBS0csUUFBTCxFQUFKLEVBQXFCOztBQUVqQixxQkFBS2QsS0FBTCxDQUFXZSxPQUFYLENBQW1CLGFBQUs7O0FBRXBCLHdCQUFJQyxFQUFFQyxPQUFGLENBQVVOLElBQVYsQ0FBSixFQUNJRSxPQUFPRyxDQUFQO0FBRVAsaUJBTEQ7QUFPSDs7QUFFRCxnQkFBSUgsU0FBUyxJQUFiLEVBQ0ksT0FBTyw4QkFBb0JILElBQXBCLEVBQTBCRyxJQUExQixDQUFQOztBQUVKLG1CQUFPLDRCQUFrQkgsSUFBbEIsRUFBd0IsS0FBS2IsV0FBN0IsQ0FBUDtBQUdIOzs7a0NBRVNxQixPLEVBQVNDLEksRUFBTTs7QUFFckIsa0JBQU0sSUFBSWIsY0FBSixDQUFtQixrQ0FBbkIsQ0FBTjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS0wsT0FBWjtBQUVIOzs7Z0NBRU9tQixHLEVBQUs7O0FBRVQsa0JBQU0sSUFBSUMsU0FBSixDQUFjLHlCQUFkLENBQU47QUFFSDs7O2tDQUVTOztBQUVOLGtCQUFNLElBQUlBLFNBQUosQ0FBYyxzQkFBZCxDQUFOO0FBRUg7OzswQ0FFaUJDLEMsRUFBR0MsSyxFQUFPOztBQUV4QixrQkFBTUQsQ0FBTjtBQUVIOzs7NkJBRUlFLFEsRUFBVUMsTSxFQUFROztBQUVuQixnQ0FBSyxFQUFFRCxrQkFBRixFQUFMLEVBQW1CRSxTQUFuQjtBQUNBLGdDQUFLLEVBQUVELGNBQUYsRUFBTCxFQUFpQkUsUUFBakIsR0FBNEJDLE1BQTVCOztBQUVBLGdCQUFJQyxVQUFVLHNCQUFZTCxRQUFaLEVBQXNCLEtBQUt2QixPQUEzQixFQUFvQ3dCLE1BQXBDLENBQWQ7O0FBRUFJLG9CQUFRQyxTQUFSO0FBQ0EsaUJBQUs5QixLQUFMLENBQVcrQixJQUFYLENBQWdCUCxRQUFoQjtBQUVIOzs7Ozs7a0JBS1U3QixRIiwiZmlsZSI6Ikd1YXJkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQWRkcmVzcyBmcm9tICcuL0FkZHJlc3MnO1xuaW1wb3J0IEFwcENvbmNlcm4gZnJvbSAnLi9BcHBDb25jZXJuJztcbmltcG9ydCBDb25jZXJuRmFjdG9yeSBmcm9tICcuL0NvbmNlcm5GYWN0b3J5JztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IE51bGxSZWZlcmVuY2UgZnJvbSAnLi9OdWxsUmVmZXJlbmNlJztcbmltcG9ydCBEZWZhdWx0cyBmcm9tICcuL0RlZmF1bHRzJztcbmltcG9ydCBEZWFkTGV0dGVycyBmcm9tICcuL0RlYWRMZXR0ZXJzJztcbmltcG9ydCBNb25pdG9yIGZyb20gJy4vcmVtb3RlL01vbml0b3InO1xuaW1wb3J0IFBlZXIgZnJvbSAnLi9yZW1vdGUvUGVlcic7XG5pbXBvcnQgUmVtb3RlUmVmZXJlbmNlIGZyb20gJy4vcmVtb3RlL1JlbW90ZVJlZmVyZW5jZSc7XG5cbi8qKlxuICogR3VhcmRpYW5cbiAqL1xuY2xhc3MgR3VhcmRpYW4ge1xuXG4gICAgY29uc3RydWN0b3Ioc3lzdGVtKSB7XG5cbiAgICAgICAgdGhpcy5kZWFkTGV0dGVycyA9IG5ldyBEZWFkTGV0dGVycyhzeXN0ZW0pO1xuICAgICAgICB0aGlzLmFwcCA9IG5ldyBDaGlsZENvbnRleHQoJy9hcHAnLCB0aGlzLCBuZXcgRGVmYXVsdHMoY29udGV4dCA9PiBuZXcgQXBwQ29uY2Vybihjb250ZXh0KSksIHN5c3RlbSk7XG4gICAgICAgIHRoaXMucGVlcnMgPSBbXTtcbiAgICAgICAgdGhpcy5fc3lzdGVtID0gc3lzdGVtO1xuXG4gICAgfVxuXG4gICAgcGF0aCgpIHtcblxuICAgICAgICByZXR1cm4gJy8nO1xuXG4gICAgfVxuXG4gICAgc2VsZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHBhcmVudCgpIHtcblxuICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgIH1cblxuICAgIGlzQ2hpbGQocmVmKSB7XG5cbiAgICAgICAgcmV0dXJuIChbdGhpcy5hcHAuc2VsZigpLCB0aGlzLnN5cy5zZWxmKCldLmluZGV4T2YocmVmKSA+IC0xKTtcblxuICAgIH1cblxuICAgIGNoaWxkcmVuKCkge1xuXG4gICAgICAgIHJldHVybiBbdGhpcy5hcHAuc2VsZigpLCB0aGlzLnN5cy5zZWxmKCldO1xuXG4gICAgfVxuXG4gICAgbWFpbGJveCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGRpc3BhdGNoZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICB3YXRjaChyZWYpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ3dhdGNoKCk6IGlzIG5vdCBpbXBsZW1lbnRlZCEnKTtcblxuICAgIH1cblxuICAgIHVud2F0Y2gocmVmKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCd1bndhdGNoKCk6IGlzIG5vdCBpbXBsZW1lbnRlZCEnKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgIHRoaXMuZGVhZExldHRlcnMudGVsbChtZXNzYWdlLCBmcm9tKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgdmFyIGFkZHIgPSBBZGRyZXNzLmZyb21TdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciBwZWVyID0gbnVsbDtcblxuICAgICAgICBpZiAoYWRkci5pc1JlbW90ZSgpKSB7XG5cbiAgICAgICAgICAgIHRoaXMucGVlcnMuZm9yRWFjaChwID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChwLmhhbmRsZXMoYWRkcikpXG4gICAgICAgICAgICAgICAgICAgIHBlZXIgPSBwO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBlZXIgIT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlbW90ZVJlZmVyZW5jZShwYXRoLCBwZWVyKTtcblxuICAgICAgICByZXR1cm4gbmV3IE51bGxSZWZlcmVuY2UocGF0aCwgdGhpcy5kZWFkTGV0dGVycyk7XG5cblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBuYW1lKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdjb25jZXJuT2YoKTogaXMgbm90IGltcGxlbWVudGVkIScpO1xuXG4gICAgfVxuXG4gICAgc3lzdGVtKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zeXN0ZW07XG5cbiAgICB9XG5cbiAgICBlbnF1ZXVlKG1zZykge1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBlbnF1ZXVlIHRvIFxcJy9cXCcnKTtcblxuICAgIH1cblxuICAgIGRlcXVldWUoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGRlcXVldWUgXFwnL1xcJycpO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZUNoaWxkRXJyb3IoZSwgY2hpbGQpIHtcblxuICAgICAgICB0aHJvdyBlO1xuXG4gICAgfVxuXG4gICAgcGVlcihpbnN0YW5jZSwgY29uZmlnKSB7XG5cbiAgICAgICAgYmVvZih7IGluc3RhbmNlIH0pLmludGVyZmFjZShQZWVyKTtcbiAgICAgICAgYmVvZih7IGNvbmZpZyB9KS5vcHRpb25hbCgpLm9iamVjdCgpO1xuXG4gICAgICAgIHZhciBtb25pdG9yID0gbmV3IE1vbml0b3IoaW5zdGFuY2UsIHRoaXMuX3N5c3RlbSwgY29uZmlnKTtcblxuICAgICAgICBtb25pdG9yLmFzc29jaWF0ZSgpO1xuICAgICAgICB0aGlzLnBlZXJzLnB1c2goaW5zdGFuY2UpO1xuXG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3VhcmRpYW5cbiJdfQ==
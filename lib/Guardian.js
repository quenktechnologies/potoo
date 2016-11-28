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
        var _this = this;

        _classCallCheck(this, Guardian);

        this.deadLetters = new _DeadLetters2.default(system);

        this.app = new _ChildContext2.default('/app', this, new _Defaults2.default(function (context) {
            return new _AppConcern2.default(context);
        }), system);

        this.peers = [];
        this._system = system;

        process.once('exit', function () {
            return _this.peers.forEach(function (p) {
                return p.disassociate();
            });
        });
        process.once('error', function () {
            return _this.peers.forEach(function (p) {
                return p.disassociate();
            });
        });
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

            this.deadLetters.tell({ message: message }, from);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9HdWFyZGlhbi5qcyJdLCJuYW1lcyI6WyJHdWFyZGlhbiIsInN5c3RlbSIsImRlYWRMZXR0ZXJzIiwiYXBwIiwiY29udGV4dCIsInBlZXJzIiwiX3N5c3RlbSIsInByb2Nlc3MiLCJvbmNlIiwiZm9yRWFjaCIsInAiLCJkaXNhc3NvY2lhdGUiLCJyZWYiLCJzZWxmIiwic3lzIiwiaW5kZXhPZiIsIlJlZmVyZW5jZUVycm9yIiwibWVzc2FnZSIsImZyb20iLCJ0ZWxsIiwicGF0aCIsImFkZHIiLCJmcm9tU3RyaW5nIiwicGVlciIsImlzUmVtb3RlIiwiaGFuZGxlcyIsImZhY3RvcnkiLCJuYW1lIiwibXNnIiwiVHlwZUVycm9yIiwiZSIsImNoaWxkIiwiaW5zdGFuY2UiLCJjb25maWciLCJpbnRlcmZhY2UiLCJvcHRpb25hbCIsIm9iamVjdCIsIm1vbml0b3IiLCJhc3NvY2lhdGUiLCJwdXNoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztJQUdNQSxRO0FBRUYsc0JBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFBQTs7QUFFaEIsYUFBS0MsV0FBTCxHQUFtQiwwQkFBZ0JELE1BQWhCLENBQW5COztBQUVBLGFBQUtFLEdBQUwsR0FBVywyQkFBaUIsTUFBakIsRUFDUCxJQURPLEVBRVAsdUJBQWE7QUFBQSxtQkFBVyx5QkFBZUMsT0FBZixDQUFYO0FBQUEsU0FBYixDQUZPLEVBR1BILE1BSE8sQ0FBWDs7QUFLQSxhQUFLSSxLQUFMLEdBQWEsRUFBYjtBQUNBLGFBQUtDLE9BQUwsR0FBZUwsTUFBZjs7QUFFQU0sZ0JBQVFDLElBQVIsQ0FBYSxNQUFiLEVBQXFCO0FBQUEsbUJBQU0sTUFBS0gsS0FBTCxDQUFXSSxPQUFYLENBQW1CO0FBQUEsdUJBQUtDLEVBQUVDLFlBQUYsRUFBTDtBQUFBLGFBQW5CLENBQU47QUFBQSxTQUFyQjtBQUNBSixnQkFBUUMsSUFBUixDQUFhLE9BQWIsRUFBc0I7QUFBQSxtQkFBTSxNQUFLSCxLQUFMLENBQVdJLE9BQVgsQ0FBbUI7QUFBQSx1QkFBS0MsRUFBRUMsWUFBRixFQUFMO0FBQUEsYUFBbkIsQ0FBTjtBQUFBLFNBQXRCO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sR0FBUDtBQUVIOzs7K0JBRU07O0FBRUgsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7Z0NBRU9DLEcsRUFBSzs7QUFFVCxtQkFBUSxDQUFDLEtBQUtULEdBQUwsQ0FBU1UsSUFBVCxFQUFELEVBQWtCLEtBQUtDLEdBQUwsQ0FBU0QsSUFBVCxFQUFsQixFQUFtQ0UsT0FBbkMsQ0FBMkNILEdBQTNDLElBQWtELENBQUMsQ0FBM0Q7QUFFSDs7O21DQUVVOztBQUVQLG1CQUFPLENBQUMsS0FBS1QsR0FBTCxDQUFTVSxJQUFULEVBQUQsRUFBa0IsS0FBS0MsR0FBTCxDQUFTRCxJQUFULEVBQWxCLENBQVA7QUFFSDs7O2tDQUVTOztBQUVOLG1CQUFPLElBQVA7QUFFSDs7O3FDQUVZOztBQUVULG1CQUFPLElBQVA7QUFFSDs7OzhCQUVLRCxHLEVBQUs7O0FBRVAsa0JBQU0sSUFBSUksY0FBSixDQUFtQiw4QkFBbkIsQ0FBTjtBQUVIOzs7Z0NBRU9KLEcsRUFBSzs7QUFFVCxrQkFBTSxJQUFJSSxjQUFKLENBQW1CLGdDQUFuQixDQUFOO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWhCLGlCQUFLaEIsV0FBTCxDQUFpQmlCLElBQWpCLENBQXNCLEVBQUVGLGdCQUFGLEVBQXRCLEVBQW1DQyxJQUFuQztBQUVIOzs7K0JBRU1FLEksRUFBTTs7QUFFVCxnQkFBSUMsT0FBTyxrQkFBUUMsVUFBUixDQUFtQkYsSUFBbkIsQ0FBWDtBQUNBLGdCQUFJRyxPQUFPLElBQVg7O0FBRUEsZ0JBQUlGLEtBQUtHLFFBQUwsRUFBSixFQUFxQjs7QUFFakIscUJBQUtuQixLQUFMLENBQVdJLE9BQVgsQ0FBbUIsYUFBSzs7QUFFcEIsd0JBQUlDLEVBQUVlLE9BQUYsQ0FBVUosSUFBVixDQUFKLEVBQ0lFLE9BQU9iLENBQVA7QUFFUCxpQkFMRDtBQU9IOztBQUVELGdCQUFJYSxTQUFTLElBQWIsRUFDSSxPQUFPLDhCQUFvQkgsSUFBcEIsRUFBMEJHLElBQTFCLENBQVA7O0FBRUosbUJBQU8sNEJBQWtCSCxJQUFsQixFQUF3QixLQUFLbEIsV0FBN0IsQ0FBUDtBQUdIOzs7a0NBRVN3QixPLEVBQVNDLEksRUFBTTs7QUFFckIsa0JBQU0sSUFBSVgsY0FBSixDQUFtQixrQ0FBbkIsQ0FBTjtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sS0FBS1YsT0FBWjtBQUVIOzs7Z0NBRU9zQixHLEVBQUs7O0FBRVQsa0JBQU0sSUFBSUMsU0FBSixDQUFjLHlCQUFkLENBQU47QUFFSDs7O2tDQUVTOztBQUVOLGtCQUFNLElBQUlBLFNBQUosQ0FBYyxzQkFBZCxDQUFOO0FBRUg7OzswQ0FFaUJDLEMsRUFBR0MsSyxFQUFPOztBQUV4QixrQkFBTUQsQ0FBTjtBQUVIOzs7NkJBRUlFLFEsRUFBVUMsTSxFQUFROztBQUVuQixnQ0FBSyxFQUFFRCxrQkFBRixFQUFMLEVBQW1CRSxTQUFuQjtBQUNBLGdDQUFLLEVBQUVELGNBQUYsRUFBTCxFQUFpQkUsUUFBakIsR0FBNEJDLE1BQTVCOztBQUVBLGdCQUFJQyxVQUFVLHNCQUFZTCxRQUFaLEVBQXNCLEtBQUsxQixPQUEzQixFQUFvQzJCLE1BQXBDLENBQWQ7O0FBRUFJLG9CQUFRQyxTQUFSO0FBQ0EsaUJBQUtqQyxLQUFMLENBQVdrQyxJQUFYLENBQWdCUCxRQUFoQjtBQUVIOzs7Ozs7a0JBS1VoQyxRIiwiZmlsZSI6Ikd1YXJkaWFuLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgQWRkcmVzcyBmcm9tICcuL0FkZHJlc3MnO1xuaW1wb3J0IEFwcENvbmNlcm4gZnJvbSAnLi9BcHBDb25jZXJuJztcbmltcG9ydCBDb25jZXJuRmFjdG9yeSBmcm9tICcuL0NvbmNlcm5GYWN0b3J5JztcbmltcG9ydCBDaGlsZENvbnRleHQgZnJvbSAnLi9DaGlsZENvbnRleHQnO1xuaW1wb3J0IE51bGxSZWZlcmVuY2UgZnJvbSAnLi9OdWxsUmVmZXJlbmNlJztcbmltcG9ydCBEZWZhdWx0cyBmcm9tICcuL0RlZmF1bHRzJztcbmltcG9ydCBEZWFkTGV0dGVycyBmcm9tICcuL0RlYWRMZXR0ZXJzJztcbmltcG9ydCBNb25pdG9yIGZyb20gJy4vcmVtb3RlL01vbml0b3InO1xuaW1wb3J0IFBlZXIgZnJvbSAnLi9yZW1vdGUvUGVlcic7XG5pbXBvcnQgUmVtb3RlUmVmZXJlbmNlIGZyb20gJy4vcmVtb3RlL1JlbW90ZVJlZmVyZW5jZSc7XG5cbi8qKlxuICogR3VhcmRpYW5cbiAqL1xuY2xhc3MgR3VhcmRpYW4ge1xuXG4gICAgY29uc3RydWN0b3Ioc3lzdGVtKSB7XG5cbiAgICAgICAgdGhpcy5kZWFkTGV0dGVycyA9IG5ldyBEZWFkTGV0dGVycyhzeXN0ZW0pO1xuXG4gICAgICAgIHRoaXMuYXBwID0gbmV3IENoaWxkQ29udGV4dCgnL2FwcCcsXG4gICAgICAgICAgICB0aGlzLFxuICAgICAgICAgICAgbmV3IERlZmF1bHRzKGNvbnRleHQgPT4gbmV3IEFwcENvbmNlcm4oY29udGV4dCkpLFxuICAgICAgICAgICAgc3lzdGVtKTtcblxuICAgICAgICB0aGlzLnBlZXJzID0gW107XG4gICAgICAgIHRoaXMuX3N5c3RlbSA9IHN5c3RlbTtcblxuICAgICAgICBwcm9jZXNzLm9uY2UoJ2V4aXQnLCAoKSA9PiB0aGlzLnBlZXJzLmZvckVhY2gocCA9PiBwLmRpc2Fzc29jaWF0ZSgpKSk7XG4gICAgICAgIHByb2Nlc3Mub25jZSgnZXJyb3InLCAoKSA9PiB0aGlzLnBlZXJzLmZvckVhY2gocCA9PiBwLmRpc2Fzc29jaWF0ZSgpKSk7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiAnLyc7XG5cbiAgICB9XG5cbiAgICBzZWxmKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgcGFyZW50KCkge1xuXG4gICAgICAgIHJldHVybiBudWxsO1xuXG4gICAgfVxuXG4gICAgaXNDaGlsZChyZWYpIHtcblxuICAgICAgICByZXR1cm4gKFt0aGlzLmFwcC5zZWxmKCksIHRoaXMuc3lzLnNlbGYoKV0uaW5kZXhPZihyZWYpID4gLTEpO1xuXG4gICAgfVxuXG4gICAgY2hpbGRyZW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIFt0aGlzLmFwcC5zZWxmKCksIHRoaXMuc3lzLnNlbGYoKV07XG5cbiAgICB9XG5cbiAgICBtYWlsYm94KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgZGlzcGF0Y2hlcigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIHdhdGNoKHJlZikge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignd2F0Y2goKTogaXMgbm90IGltcGxlbWVudGVkIScpO1xuXG4gICAgfVxuXG4gICAgdW53YXRjaChyZWYpIHtcblxuICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ3Vud2F0Y2goKTogaXMgbm90IGltcGxlbWVudGVkIScpO1xuXG4gICAgfVxuXG4gICAgdGVsbChtZXNzYWdlLCBmcm9tKSB7XG5cbiAgICAgICAgdGhpcy5kZWFkTGV0dGVycy50ZWxsKHsgbWVzc2FnZSB9LCBmcm9tKTtcblxuICAgIH1cblxuICAgIHNlbGVjdChwYXRoKSB7XG5cbiAgICAgICAgdmFyIGFkZHIgPSBBZGRyZXNzLmZyb21TdHJpbmcocGF0aCk7XG4gICAgICAgIHZhciBwZWVyID0gbnVsbDtcblxuICAgICAgICBpZiAoYWRkci5pc1JlbW90ZSgpKSB7XG5cbiAgICAgICAgICAgIHRoaXMucGVlcnMuZm9yRWFjaChwID0+IHtcblxuICAgICAgICAgICAgICAgIGlmIChwLmhhbmRsZXMoYWRkcikpXG4gICAgICAgICAgICAgICAgICAgIHBlZXIgPSBwO1xuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBlZXIgIT09IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gbmV3IFJlbW90ZVJlZmVyZW5jZShwYXRoLCBwZWVyKTtcblxuICAgICAgICByZXR1cm4gbmV3IE51bGxSZWZlcmVuY2UocGF0aCwgdGhpcy5kZWFkTGV0dGVycyk7XG5cblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBuYW1lKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKCdjb25jZXJuT2YoKTogaXMgbm90IGltcGxlbWVudGVkIScpO1xuXG4gICAgfVxuXG4gICAgc3lzdGVtKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9zeXN0ZW07XG5cbiAgICB9XG5cbiAgICBlbnF1ZXVlKG1zZykge1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBlbnF1ZXVlIHRvIFxcJy9cXCcnKTtcblxuICAgIH1cblxuICAgIGRlcXVldWUoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGRlcXVldWUgXFwnL1xcJycpO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZUNoaWxkRXJyb3IoZSwgY2hpbGQpIHtcblxuICAgICAgICB0aHJvdyBlO1xuXG4gICAgfVxuXG4gICAgcGVlcihpbnN0YW5jZSwgY29uZmlnKSB7XG5cbiAgICAgICAgYmVvZih7IGluc3RhbmNlIH0pLmludGVyZmFjZShQZWVyKTtcbiAgICAgICAgYmVvZih7IGNvbmZpZyB9KS5vcHRpb25hbCgpLm9iamVjdCgpO1xuXG4gICAgICAgIHZhciBtb25pdG9yID0gbmV3IE1vbml0b3IoaW5zdGFuY2UsIHRoaXMuX3N5c3RlbSwgY29uZmlnKTtcblxuICAgICAgICBtb25pdG9yLmFzc29jaWF0ZSgpO1xuICAgICAgICB0aGlzLnBlZXJzLnB1c2goaW5zdGFuY2UpO1xuXG4gICAgfVxuXG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgR3VhcmRpYW5cbiJdfQ==
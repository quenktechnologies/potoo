'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Address = require('../Address');

var _Address2 = _interopRequireDefault(_Address);

var _RefState = require('../RefState');

var _RefState2 = _interopRequireDefault(_RefState);

var _Concern = require('../Concern');

var _Concern2 = _interopRequireDefault(_Concern);

var _ChildStateProvider = require('./ChildStateProvider');

var _ChildStateProvider2 = _interopRequireDefault(_ChildStateProvider);

var _ChildReference = require('./ChildReference');

var _ChildReference2 = _interopRequireDefault(_ChildReference);

var _SpawnChildProcessError = require('./SpawnChildProcessError');

var _SpawnChildProcessError2 = _interopRequireDefault(_SpawnChildProcessError);

var _StateProvider = require('../StateProvider');

var _StateProvider2 = _interopRequireDefault(_StateProvider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ChildReferenceProvider provides a Reference for a Concern
 * running on a child process.
 * @implements {ReferenceProvider}
 */
var ChildReferenceProvider = function () {
    function ChildReferenceProvider() {
        _classCallCheck(this, ChildReferenceProvider);

        this._cache = {};
        this._list = {};
    }

    /**
     * getProcessList returns a map of child process
     * created by this provider.
     * @return {object}
     */


    _createClass(ChildReferenceProvider, [{
        key: 'getProcessList',
        value: function getProcessList() {

            return this._list;
        }
    }, {
        key: 'select',
        value: function select(path, context) {

            var addr = _Address2.default.fromString(path);
            var concern = new _Concern2.default();
            var child;
            var provider;

            if (this._cache.hasOwnProperty(path)) return this._cache[path];

            //@todo move to validator class
            if (typeof addr.uri.hash !== 'string') throw new ReferenceError('A child process uri must have a path and hash part!');

            if (this._list.hasOwnProperty(addr.uri.path)) {

                child = this._list[addr.uri.path];
            } else {

                try {

                    child = _child_process2.default.fork(addr.uri.path);
                    this._list[addr.uri.path] = child;
                } catch (e) {

                    context.publish(new _SpawnChildProcessError2.default(e));

                    return new Reference(new _RefState2.default.UnknownState(path, concern, context, new _StateProvider2.default()));
                }
            }

            provider = new _ChildStateProvider2.default(path, addr.uri.hash.substring(1), child);

            return this._cache[path] = new _ChildReference2.default(provider.provide(_RefState2.default.ACTIVE_STATE, concern, context), path, addr.uri.hash.substring(1), concern, context, provider, child);
        }
    }, {
        key: 'reselect',
        value: function reselect(path, context) {

            this._cache[path] = null;
            return this.select(path, context);
        }
    }]);

    return ChildReferenceProvider;
}();

exports.default = ChildReferenceProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL0NoaWxkUmVmZXJlbmNlUHJvdmlkZXIuanMiXSwibmFtZXMiOlsiQ2hpbGRSZWZlcmVuY2VQcm92aWRlciIsIl9jYWNoZSIsIl9saXN0IiwicGF0aCIsImNvbnRleHQiLCJhZGRyIiwiZnJvbVN0cmluZyIsImNvbmNlcm4iLCJjaGlsZCIsInByb3ZpZGVyIiwiaGFzT3duUHJvcGVydHkiLCJ1cmkiLCJoYXNoIiwiUmVmZXJlbmNlRXJyb3IiLCJmb3JrIiwiZSIsInB1Ymxpc2giLCJSZWZlcmVuY2UiLCJVbmtub3duU3RhdGUiLCJzdWJzdHJpbmciLCJwcm92aWRlIiwiQUNUSVZFX1NUQVRFIiwic2VsZWN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7SUFLTUEsc0I7QUFFRixzQ0FBYztBQUFBOztBQUVWLGFBQUtDLE1BQUwsR0FBYyxFQUFkO0FBQ0EsYUFBS0MsS0FBTCxHQUFhLEVBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs7O3lDQUtpQjs7QUFFYixtQkFBTyxLQUFLQSxLQUFaO0FBRUg7OzsrQkFFTUMsSSxFQUFNQyxPLEVBQVM7O0FBRWxCLGdCQUFJQyxPQUFPLGtCQUFRQyxVQUFSLENBQW1CSCxJQUFuQixDQUFYO0FBQ0EsZ0JBQUlJLFVBQVUsdUJBQWQ7QUFDQSxnQkFBSUMsS0FBSjtBQUNBLGdCQUFJQyxRQUFKOztBQUVBLGdCQUFJLEtBQUtSLE1BQUwsQ0FBWVMsY0FBWixDQUEyQlAsSUFBM0IsQ0FBSixFQUNJLE9BQU8sS0FBS0YsTUFBTCxDQUFZRSxJQUFaLENBQVA7O0FBRUo7QUFDQSxnQkFBSSxPQUFPRSxLQUFLTSxHQUFMLENBQVNDLElBQWhCLEtBQXlCLFFBQTdCLEVBQ0ksTUFBTSxJQUFJQyxjQUFKLENBQW1CLHFEQUFuQixDQUFOOztBQUVKLGdCQUFJLEtBQUtYLEtBQUwsQ0FBV1EsY0FBWCxDQUEwQkwsS0FBS00sR0FBTCxDQUFTUixJQUFuQyxDQUFKLEVBQThDOztBQUUxQ0ssd0JBQVEsS0FBS04sS0FBTCxDQUFXRyxLQUFLTSxHQUFMLENBQVNSLElBQXBCLENBQVI7QUFFSCxhQUpELE1BSU87O0FBRUgsb0JBQUk7O0FBRUFLLDRCQUFRLHdCQUFhTSxJQUFiLENBQWtCVCxLQUFLTSxHQUFMLENBQVNSLElBQTNCLENBQVI7QUFDQSx5QkFBS0QsS0FBTCxDQUFXRyxLQUFLTSxHQUFMLENBQVNSLElBQXBCLElBQTRCSyxLQUE1QjtBQUVILGlCQUxELENBS0UsT0FBT08sQ0FBUCxFQUFVOztBQUVSWCw0QkFBUVksT0FBUixDQUFnQixxQ0FBMkJELENBQTNCLENBQWhCOztBQUVBLDJCQUFPLElBQUlFLFNBQUosQ0FBYyxJQUFJLG1CQUFTQyxZQUFiLENBQ2pCZixJQURpQixFQUNYSSxPQURXLEVBQ0ZILE9BREUsRUFDTyw2QkFEUCxDQUFkLENBQVA7QUFHSDtBQUNKOztBQUVESyx1QkFBVyxpQ0FBdUJOLElBQXZCLEVBQTZCRSxLQUFLTSxHQUFMLENBQVNDLElBQVQsQ0FBY08sU0FBZCxDQUF3QixDQUF4QixDQUE3QixFQUF5RFgsS0FBekQsQ0FBWDs7QUFFQSxtQkFBTyxLQUFLUCxNQUFMLENBQVlFLElBQVosSUFBb0IsNkJBQ3ZCTSxTQUFTVyxPQUFULENBQWlCLG1CQUFTQyxZQUExQixFQUF3Q2QsT0FBeEMsRUFBaURILE9BQWpELENBRHVCLEVBRXZCRCxJQUZ1QixFQUVqQkUsS0FBS00sR0FBTCxDQUFTQyxJQUFULENBQWNPLFNBQWQsQ0FBd0IsQ0FBeEIsQ0FGaUIsRUFFV1osT0FGWCxFQUVvQkgsT0FGcEIsRUFFNkJLLFFBRjdCLEVBRXVDRCxLQUZ2QyxDQUEzQjtBQUlIOzs7aUNBRVFMLEksRUFBTUMsTyxFQUFTOztBQUVwQixpQkFBS0gsTUFBTCxDQUFZRSxJQUFaLElBQW9CLElBQXBCO0FBQ0EsbUJBQU8sS0FBS21CLE1BQUwsQ0FBWW5CLElBQVosRUFBa0JDLE9BQWxCLENBQVA7QUFFSDs7Ozs7O2tCQUlVSixzQiIsImZpbGUiOiJDaGlsZFJlZmVyZW5jZVByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENoaWxkUHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuaW1wb3J0IEFkZHJlc3MgZnJvbSAnLi4vQWRkcmVzcyc7XG5pbXBvcnQgUmVmU3RhdGUgZnJvbSAnLi4vUmVmU3RhdGUnO1xuaW1wb3J0IENvbmNlcm4gZnJvbSAnLi4vQ29uY2Vybic7XG5pbXBvcnQgQ2hpbGRTdGF0ZVByb3ZpZGVyIGZyb20gJy4vQ2hpbGRTdGF0ZVByb3ZpZGVyJztcbmltcG9ydCBDaGlsZFJlZmVyZW5jZSBmcm9tICcuL0NoaWxkUmVmZXJlbmNlJztcbmltcG9ydCBTcGF3bkNoaWxkUHJvY2Vzc0Vycm9yIGZyb20gJy4vU3Bhd25DaGlsZFByb2Nlc3NFcnJvcic7XG5pbXBvcnQgU3RhdGVQcm92aWRlciBmcm9tICcuLi9TdGF0ZVByb3ZpZGVyJztcblxuLyoqXG4gKiBDaGlsZFJlZmVyZW5jZVByb3ZpZGVyIHByb3ZpZGVzIGEgUmVmZXJlbmNlIGZvciBhIENvbmNlcm5cbiAqIHJ1bm5pbmcgb24gYSBjaGlsZCBwcm9jZXNzLlxuICogQGltcGxlbWVudHMge1JlZmVyZW5jZVByb3ZpZGVyfVxuICovXG5jbGFzcyBDaGlsZFJlZmVyZW5jZVByb3ZpZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMuX2NhY2hlID0ge307XG4gICAgICAgIHRoaXMuX2xpc3QgPSB7fTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldFByb2Nlc3NMaXN0IHJldHVybnMgYSBtYXAgb2YgY2hpbGQgcHJvY2Vzc1xuICAgICAqIGNyZWF0ZWQgYnkgdGhpcyBwcm92aWRlci5cbiAgICAgKiBAcmV0dXJuIHtvYmplY3R9XG4gICAgICovXG4gICAgZ2V0UHJvY2Vzc0xpc3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2xpc3Q7XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCwgY29udGV4dCkge1xuXG4gICAgICAgIHZhciBhZGRyID0gQWRkcmVzcy5mcm9tU3RyaW5nKHBhdGgpO1xuICAgICAgICB2YXIgY29uY2VybiA9IG5ldyBDb25jZXJuKCk7XG4gICAgICAgIHZhciBjaGlsZDtcbiAgICAgICAgdmFyIHByb3ZpZGVyO1xuXG4gICAgICAgIGlmICh0aGlzLl9jYWNoZS5oYXNPd25Qcm9wZXJ0eShwYXRoKSlcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtwYXRoXTtcblxuICAgICAgICAvL0B0b2RvIG1vdmUgdG8gdmFsaWRhdG9yIGNsYXNzXG4gICAgICAgIGlmICh0eXBlb2YgYWRkci51cmkuaGFzaCAhPT0gJ3N0cmluZycpXG4gICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoJ0EgY2hpbGQgcHJvY2VzcyB1cmkgbXVzdCBoYXZlIGEgcGF0aCBhbmQgaGFzaCBwYXJ0IScpO1xuXG4gICAgICAgIGlmICh0aGlzLl9saXN0Lmhhc093blByb3BlcnR5KGFkZHIudXJpLnBhdGgpKSB7XG5cbiAgICAgICAgICAgIGNoaWxkID0gdGhpcy5fbGlzdFthZGRyLnVyaS5wYXRoXTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0cnkge1xuXG4gICAgICAgICAgICAgICAgY2hpbGQgPSBDaGlsZFByb2Nlc3MuZm9yayhhZGRyLnVyaS5wYXRoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9saXN0W2FkZHIudXJpLnBhdGhdID0gY2hpbGQ7XG5cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcblxuICAgICAgICAgICAgICAgIGNvbnRleHQucHVibGlzaChuZXcgU3Bhd25DaGlsZFByb2Nlc3NFcnJvcihlKSk7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlZmVyZW5jZShuZXcgUmVmU3RhdGUuVW5rbm93blN0YXRlKFxuICAgICAgICAgICAgICAgICAgICBwYXRoLCBjb25jZXJuLCBjb250ZXh0LCBuZXcgU3RhdGVQcm92aWRlcigpKSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3ZpZGVyID0gbmV3IENoaWxkU3RhdGVQcm92aWRlcihwYXRoLCBhZGRyLnVyaS5oYXNoLnN1YnN0cmluZygxKSwgY2hpbGQpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLl9jYWNoZVtwYXRoXSA9IG5ldyBDaGlsZFJlZmVyZW5jZShcbiAgICAgICAgICAgIHByb3ZpZGVyLnByb3ZpZGUoUmVmU3RhdGUuQUNUSVZFX1NUQVRFLCBjb25jZXJuLCBjb250ZXh0KSxcbiAgICAgICAgICAgIHBhdGgsIGFkZHIudXJpLmhhc2guc3Vic3RyaW5nKDEpLCBjb25jZXJuLCBjb250ZXh0LCBwcm92aWRlciwgY2hpbGQpO1xuXG4gICAgfVxuXG4gICAgcmVzZWxlY3QocGF0aCwgY29udGV4dCkge1xuXG4gICAgICAgIHRoaXMuX2NhY2hlW3BhdGhdID0gbnVsbDtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0KHBhdGgsIGNvbnRleHQpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IENoaWxkUmVmZXJlbmNlUHJvdmlkZXJcbiJdfQ==
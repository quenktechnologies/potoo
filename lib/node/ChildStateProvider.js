'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _RefState = require('../RefState');

var _RefState2 = _interopRequireDefault(_RefState);

var _RemoteTerminatedError = require('../RemoteTerminatedError');

var _RemoteTerminatedError2 = _interopRequireDefault(_RemoteTerminatedError);

var _Signal = require('../Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * ChildStateProvider provides the states for a Concern in a child process.
 * @param {string} remotePath - The path the remote System will recognise.
 * @param {string} localPath  - The path we used locally to refer to the Concern.
 * @param {ChildProcess} child
 * @implements {StateProvider}
 */
var ChildStateProvider = function () {
    function ChildStateProvider(localPath, remotePath, child) {
        _classCallCheck(this, ChildStateProvider);

        this._child = child;
        this._localPath = localPath;
        this._remotePath = remotePath;
        this._ref = null;
    }

    _createClass(ChildStateProvider, [{
        key: 'provide',
        value: function provide(state, concern, context) {

            var SignalConstructor;

            switch (state) {

                case _RefState2.default.ACTIVE_STATE:
                    SignalConstructor = _Signal2.default.Start;
                    break;

                case _RefState2.default.PAUSED_STATE:
                    SignalConstructor = _Signal2.default.Pause;
                    break;

                case _RefState2.default.STOPPED_STATE:
                    SignalConstructor = _Signal2.default.Stop;
                    break;

                default:
                    throw new ReferenceError('Invalid state: \'' + state + '\'!');

            }

            try {

                this._child.send(new SignalConstructor(this._remotePath));
            } catch (e) {

                context.publish(new _RemoteTerminatedError2.default(e));
                return new _RefState2.default.Stopped(this._localPath, concern, context, this);
            }

            return SignalConstructor === _Signal2.default.Stop ? new _RefState2.default.Stopped(this._localPath, concern, context, this) : new _RefState2.default.Paused(this._localPath, concern, context, this);
        }
    }]);

    return ChildStateProvider;
}();

exports.default = ChildStateProvider;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9ub2RlL0NoaWxkU3RhdGVQcm92aWRlci5qcyJdLCJuYW1lcyI6WyJDaGlsZFN0YXRlUHJvdmlkZXIiLCJsb2NhbFBhdGgiLCJyZW1vdGVQYXRoIiwiY2hpbGQiLCJfY2hpbGQiLCJfbG9jYWxQYXRoIiwiX3JlbW90ZVBhdGgiLCJfcmVmIiwic3RhdGUiLCJjb25jZXJuIiwiY29udGV4dCIsIlNpZ25hbENvbnN0cnVjdG9yIiwiQUNUSVZFX1NUQVRFIiwiU3RhcnQiLCJQQVVTRURfU1RBVEUiLCJQYXVzZSIsIlNUT1BQRURfU1RBVEUiLCJTdG9wIiwiUmVmZXJlbmNlRXJyb3IiLCJzZW5kIiwiZSIsInB1Ymxpc2giLCJTdG9wcGVkIiwiUGF1c2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7OztBQUVBOzs7Ozs7O0lBT01BLGtCO0FBRUYsZ0NBQVlDLFNBQVosRUFBdUJDLFVBQXZCLEVBQW1DQyxLQUFuQyxFQUEwQztBQUFBOztBQUV0QyxhQUFLQyxNQUFMLEdBQWNELEtBQWQ7QUFDQSxhQUFLRSxVQUFMLEdBQWtCSixTQUFsQjtBQUNBLGFBQUtLLFdBQUwsR0FBbUJKLFVBQW5CO0FBQ0EsYUFBS0ssSUFBTCxHQUFZLElBQVo7QUFFSDs7OztnQ0FFT0MsSyxFQUFPQyxPLEVBQVNDLE8sRUFBUzs7QUFFN0IsZ0JBQUlDLGlCQUFKOztBQUVBLG9CQUFRSCxLQUFSOztBQUVJLHFCQUFLLG1CQUFTSSxZQUFkO0FBQ0lELHdDQUFvQixpQkFBT0UsS0FBM0I7QUFDQTs7QUFFSixxQkFBSyxtQkFBU0MsWUFBZDtBQUNJSCx3Q0FBb0IsaUJBQU9JLEtBQTNCO0FBQ0E7O0FBRUoscUJBQUssbUJBQVNDLGFBQWQ7QUFDSUwsd0NBQW9CLGlCQUFPTSxJQUEzQjtBQUNBOztBQUVKO0FBQ0ksMEJBQU0sSUFBSUMsY0FBSix1QkFBc0NWLEtBQXRDLFNBQU47O0FBZlI7O0FBbUJBLGdCQUFJOztBQUVBLHFCQUFLSixNQUFMLENBQVllLElBQVosQ0FBaUIsSUFBSVIsaUJBQUosQ0FBc0IsS0FBS0wsV0FBM0IsQ0FBakI7QUFFSCxhQUpELENBSUUsT0FBT2MsQ0FBUCxFQUFVOztBQUVSVix3QkFBUVcsT0FBUixDQUFnQixvQ0FBMEJELENBQTFCLENBQWhCO0FBQ0EsdUJBQU8sSUFBSSxtQkFBU0UsT0FBYixDQUFxQixLQUFLakIsVUFBMUIsRUFBc0NJLE9BQXRDLEVBQStDQyxPQUEvQyxFQUF3RCxJQUF4RCxDQUFQO0FBRUg7O0FBRUQsbUJBQVFDLHNCQUFzQixpQkFBT00sSUFBOUIsR0FDSCxJQUFJLG1CQUFTSyxPQUFiLENBQXFCLEtBQUtqQixVQUExQixFQUFzQ0ksT0FBdEMsRUFBK0NDLE9BQS9DLEVBQXdELElBQXhELENBREcsR0FFSCxJQUFJLG1CQUFTYSxNQUFiLENBQW9CLEtBQUtsQixVQUF6QixFQUFxQ0ksT0FBckMsRUFBOENDLE9BQTlDLEVBQXVELElBQXZELENBRko7QUFJSDs7Ozs7O2tCQUlVVixrQiIsImZpbGUiOiJDaGlsZFN0YXRlUHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcbmltcG9ydCBSZWZTdGF0ZSBmcm9tICcuLi9SZWZTdGF0ZSc7XG5pbXBvcnQgUmVtb3RlVGVybWluYXRlZEVycm9yIGZyb20gJy4uL1JlbW90ZVRlcm1pbmF0ZWRFcnJvcic7XG5pbXBvcnQgU2lnbmFsIGZyb20gJy4uL1NpZ25hbCc7XG5cbi8qKlxuICogQ2hpbGRTdGF0ZVByb3ZpZGVyIHByb3ZpZGVzIHRoZSBzdGF0ZXMgZm9yIGEgQ29uY2VybiBpbiBhIGNoaWxkIHByb2Nlc3MuXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVtb3RlUGF0aCAtIFRoZSBwYXRoIHRoZSByZW1vdGUgU3lzdGVtIHdpbGwgcmVjb2duaXNlLlxuICogQHBhcmFtIHtzdHJpbmd9IGxvY2FsUGF0aCAgLSBUaGUgcGF0aCB3ZSB1c2VkIGxvY2FsbHkgdG8gcmVmZXIgdG8gdGhlIENvbmNlcm4uXG4gKiBAcGFyYW0ge0NoaWxkUHJvY2Vzc30gY2hpbGRcbiAqIEBpbXBsZW1lbnRzIHtTdGF0ZVByb3ZpZGVyfVxuICovXG5jbGFzcyBDaGlsZFN0YXRlUHJvdmlkZXIge1xuXG4gICAgY29uc3RydWN0b3IobG9jYWxQYXRoLCByZW1vdGVQYXRoLCBjaGlsZCkge1xuXG4gICAgICAgIHRoaXMuX2NoaWxkID0gY2hpbGQ7XG4gICAgICAgIHRoaXMuX2xvY2FsUGF0aCA9IGxvY2FsUGF0aDtcbiAgICAgICAgdGhpcy5fcmVtb3RlUGF0aCA9IHJlbW90ZVBhdGg7XG4gICAgICAgIHRoaXMuX3JlZiA9IG51bGw7XG5cbiAgICB9XG5cbiAgICBwcm92aWRlKHN0YXRlLCBjb25jZXJuLCBjb250ZXh0KSB7XG5cbiAgICAgICAgdmFyIFNpZ25hbENvbnN0cnVjdG9yO1xuXG4gICAgICAgIHN3aXRjaCAoc3RhdGUpIHtcblxuICAgICAgICAgICAgY2FzZSBSZWZTdGF0ZS5BQ1RJVkVfU1RBVEU6XG4gICAgICAgICAgICAgICAgU2lnbmFsQ29uc3RydWN0b3IgPSBTaWduYWwuU3RhcnQ7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgUmVmU3RhdGUuUEFVU0VEX1NUQVRFOlxuICAgICAgICAgICAgICAgIFNpZ25hbENvbnN0cnVjdG9yID0gU2lnbmFsLlBhdXNlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIFJlZlN0YXRlLlNUT1BQRURfU1RBVEU6XG4gICAgICAgICAgICAgICAgU2lnbmFsQ29uc3RydWN0b3IgPSBTaWduYWwuU3RvcDtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoYEludmFsaWQgc3RhdGU6ICcke3N0YXRlfSchYCk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG5cbiAgICAgICAgICAgIHRoaXMuX2NoaWxkLnNlbmQobmV3IFNpZ25hbENvbnN0cnVjdG9yKHRoaXMuX3JlbW90ZVBhdGgpKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICAgIGNvbnRleHQucHVibGlzaChuZXcgUmVtb3RlVGVybWluYXRlZEVycm9yKGUpKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVmU3RhdGUuU3RvcHBlZCh0aGlzLl9sb2NhbFBhdGgsIGNvbmNlcm4sIGNvbnRleHQsIHRoaXMpO1xuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKFNpZ25hbENvbnN0cnVjdG9yID09PSBTaWduYWwuU3RvcCkgP1xuICAgICAgICAgICAgbmV3IFJlZlN0YXRlLlN0b3BwZWQodGhpcy5fbG9jYWxQYXRoLCBjb25jZXJuLCBjb250ZXh0LCB0aGlzKSA6XG4gICAgICAgICAgICBuZXcgUmVmU3RhdGUuUGF1c2VkKHRoaXMuX2xvY2FsUGF0aCwgY29uY2VybiwgY29udGV4dCwgdGhpcyk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgQ2hpbGRTdGF0ZVByb3ZpZGVyXG4iXX0=
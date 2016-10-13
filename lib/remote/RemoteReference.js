'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Signal = require('../state/Signal');

var _Signal2 = _interopRequireDefault(_Signal);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * RemoteReference is a handle to a remote Concern that we communicate
 * with via some transport mechanisim.
 * @param {string} path
 * @param {Transport} transport
 */
var RemoteReference = function () {
    function RemoteReference(path, transport) {
        _classCallCheck(this, RemoteReference);

        this._path = path;
        this._transport = transport;
    }

    _createClass(RemoteReference, [{
        key: 'path',
        value: function path() {

            return this._transport.resolve(this._path);
        }
    }, {
        key: 'watch',
        value: function watch() {

            throw new ReferenceError('RemoteReference#watch is not implemented yet!');
        }
    }, {
        key: 'unwatch',
        value: function unwatch() {

            throw new ReferenceError('RemoteReference#unwatch is not implemented yet!');
        }
    }, {
        key: 'tell',
        value: function tell(message, from) {

            var namespace = message instanceof _Signal2.default ? 'system' : 'user';

            this._transport.send({
                namespace: namespace,
                to: this._transport.unresolve(this._path),
                from: from,
                body: message
            });
        }
    }, {
        key: 'toJSON',
        value: function toJSON() {

            return this.toString();
        }
    }, {
        key: 'toString',
        value: function toString() {

            return this.path();
        }
    }]);

    return RemoteReference;
}();

exports.default = RemoteReference;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9yZW1vdGUvUmVtb3RlUmVmZXJlbmNlLmpzIl0sIm5hbWVzIjpbIlJlbW90ZVJlZmVyZW5jZSIsInBhdGgiLCJ0cmFuc3BvcnQiLCJfcGF0aCIsIl90cmFuc3BvcnQiLCJyZXNvbHZlIiwiUmVmZXJlbmNlRXJyb3IiLCJtZXNzYWdlIiwiZnJvbSIsIm5hbWVzcGFjZSIsInNlbmQiLCJ0byIsInVucmVzb2x2ZSIsImJvZHkiLCJ0b1N0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7QUFDQTs7Ozs7O0lBTU1BLGU7QUFFRiw2QkFBWUMsSUFBWixFQUFrQkMsU0FBbEIsRUFBNkI7QUFBQTs7QUFFekIsYUFBS0MsS0FBTCxHQUFhRixJQUFiO0FBQ0EsYUFBS0csVUFBTCxHQUFrQkYsU0FBbEI7QUFFSDs7OzsrQkFFTTs7QUFFSCxtQkFBTyxLQUFLRSxVQUFMLENBQWdCQyxPQUFoQixDQUF3QixLQUFLRixLQUE3QixDQUFQO0FBRUg7OztnQ0FFTzs7QUFFSixrQkFBTSxJQUFJRyxjQUFKLENBQW1CLCtDQUFuQixDQUFOO0FBRUg7OztrQ0FFUzs7QUFFTixrQkFBTSxJQUFJQSxjQUFKLENBQW1CLGlEQUFuQixDQUFOO0FBRUg7Ozs2QkFFSUMsTyxFQUFTQyxJLEVBQU07O0FBRWpCLGdCQUFJQyxZQUFhRixtQ0FBRCxHQUE4QixRQUE5QixHQUF5QyxNQUF6RDs7QUFFQyxpQkFBS0gsVUFBTCxDQUFnQk0sSUFBaEIsQ0FBcUI7QUFDakJELG9DQURpQjtBQUVqQkUsb0JBQUksS0FBS1AsVUFBTCxDQUFnQlEsU0FBaEIsQ0FBMEIsS0FBS1QsS0FBL0IsQ0FGYTtBQUdqQkssc0JBQU1BLElBSFc7QUFJakJLLHNCQUFNTjtBQUpXLGFBQXJCO0FBT0g7OztpQ0FFUTs7QUFFTCxtQkFBTyxLQUFLTyxRQUFMLEVBQVA7QUFFSDs7O21DQUVVOztBQUVQLG1CQUFPLEtBQUtiLElBQUwsRUFBUDtBQUVIOzs7Ozs7a0JBSVVELGUiLCJmaWxlIjoiUmVtb3RlUmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFNpZ25hbCBmcm9tICcuLi9zdGF0ZS9TaWduYWwnO1xuLyoqXG4gKiBSZW1vdGVSZWZlcmVuY2UgaXMgYSBoYW5kbGUgdG8gYSByZW1vdGUgQ29uY2VybiB0aGF0IHdlIGNvbW11bmljYXRlXG4gKiB3aXRoIHZpYSBzb21lIHRyYW5zcG9ydCBtZWNoYW5pc2ltLlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGhcbiAqIEBwYXJhbSB7VHJhbnNwb3J0fSB0cmFuc3BvcnRcbiAqL1xuY2xhc3MgUmVtb3RlUmVmZXJlbmNlIHtcblxuICAgIGNvbnN0cnVjdG9yKHBhdGgsIHRyYW5zcG9ydCkge1xuXG4gICAgICAgIHRoaXMuX3BhdGggPSBwYXRoO1xuICAgICAgICB0aGlzLl90cmFuc3BvcnQgPSB0cmFuc3BvcnQ7XG5cbiAgICB9XG5cbiAgICBwYXRoKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl90cmFuc3BvcnQucmVzb2x2ZSh0aGlzLl9wYXRoKTtcblxuICAgIH1cblxuICAgIHdhdGNoKCkge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignUmVtb3RlUmVmZXJlbmNlI3dhdGNoIGlzIG5vdCBpbXBsZW1lbnRlZCB5ZXQhJyk7XG5cbiAgICB9XG5cbiAgICB1bndhdGNoKCkge1xuXG4gICAgICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcignUmVtb3RlUmVmZXJlbmNlI3Vud2F0Y2ggaXMgbm90IGltcGxlbWVudGVkIHlldCEnKTtcblxuICAgIH1cblxuICAgIHRlbGwobWVzc2FnZSwgZnJvbSkge1xuXG4gICAgICAgdmFyIG5hbWVzcGFjZSA9IChtZXNzYWdlIGluc3RhbmNlb2YgU2lnbmFsKSA/ICdzeXN0ZW0nIDogJ3VzZXInO1xuXG4gICAgICAgIHRoaXMuX3RyYW5zcG9ydC5zZW5kKHtcbiAgICAgICAgICAgIG5hbWVzcGFjZSxcbiAgICAgICAgICAgIHRvOiB0aGlzLl90cmFuc3BvcnQudW5yZXNvbHZlKHRoaXMuX3BhdGgpLFxuICAgICAgICAgICAgZnJvbTogZnJvbSxcbiAgICAgICAgICAgIGJvZHk6IG1lc3NhZ2VcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICB0b0pTT04oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnBhdGgoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBSZW1vdGVSZWZlcmVuY2VcbiJdfQ==
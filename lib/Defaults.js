'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

var _Dispatcher = require('./dispatch/Dispatcher');

var _Dispatcher2 = _interopRequireDefault(_Dispatcher);

var _SimpleMailbox = require('./dispatch/SimpleMailbox');

var _SimpleMailbox2 = _interopRequireDefault(_SimpleMailbox);

var _SimpleDispatcher = require('./dispatch/SimpleDispatcher');

var _SimpleDispatcher2 = _interopRequireDefault(_SimpleDispatcher);

var _OneForOneStrategy = require('./OneForOneStrategy');

var _OneForOneStrategy2 = _interopRequireDefault(_OneForOneStrategy);

var _LocalReference = require('./LocalReference');

var _LocalReference2 = _interopRequireDefault(_LocalReference);

var _Context = require('./Context');

var _Context2 = _interopRequireDefault(_Context);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Defaults provides the defaults for creating a Concern.
 * You must pass a function to the constructor to actually create your Concern.
 * @implements {ConcernFactory}
 * @param {function} Constructor
 */
var Defaults = function () {
    function Defaults(provider) {
        _classCallCheck(this, Defaults);

        (0, _beof2.default)({ provider: provider }).function();

        this._provider = provider;
    }

    _createClass(Defaults, [{
        key: 'dispatcher',
        value: function dispatcher(context) {

            (0, _beof2.default)({ context: context }).interface(_Context2.default);

            return new _SimpleDispatcher2.default(this, context);
        }
    }, {
        key: 'mailbox',
        value: function mailbox(dispatcher) {

            (0, _beof2.default)({ dispatcher: dispatcher }).interface(_Dispatcher2.default);

            return new _SimpleMailbox2.default(dispatcher);
        }
    }, {
        key: 'errorHandlingStrategy',
        value: function errorHandlingStrategy() {

            return new _OneForOneStrategy2.default(function () {});
        }
    }, {
        key: 'reference',
        value: function reference(context) {

            (0, _beof2.default)({ context: context }).interface(_Context2.default);

            return new _LocalReference2.default(context);
        }
    }, {
        key: 'create',
        value: function create(context) {

            (0, _beof2.default)({ context: context }).interface(_Context2.default);

            return this._provider(context);
        }
    }]);

    return Defaults;
}();

exports.default = Defaults;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EZWZhdWx0cy5qcyJdLCJuYW1lcyI6WyJEZWZhdWx0cyIsInByb3ZpZGVyIiwiZnVuY3Rpb24iLCJfcHJvdmlkZXIiLCJjb250ZXh0IiwiaW50ZXJmYWNlIiwiZGlzcGF0Y2hlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7Ozs7QUFFQTs7Ozs7O0lBTU1BLFE7QUFFRixzQkFBWUMsUUFBWixFQUFzQjtBQUFBOztBQUVsQiw0QkFBSyxFQUFFQSxrQkFBRixFQUFMLEVBQW1CQyxRQUFuQjs7QUFFQSxhQUFLQyxTQUFMLEdBQWlCRixRQUFqQjtBQUVIOzs7O21DQUVVRyxPLEVBQVM7O0FBRWhCLGdDQUFLLEVBQUVBLGdCQUFGLEVBQUwsRUFBa0JDLFNBQWxCOztBQUVBLG1CQUFPLCtCQUFxQixJQUFyQixFQUEyQkQsT0FBM0IsQ0FBUDtBQUVIOzs7Z0NBRU9FLFUsRUFBWTs7QUFFaEIsZ0NBQUssRUFBRUEsc0JBQUYsRUFBTCxFQUFxQkQsU0FBckI7O0FBRUEsbUJBQU8sNEJBQWtCQyxVQUFsQixDQUFQO0FBRUg7OztnREFFdUI7O0FBRXBCLG1CQUFPLGdDQUFzQixZQUFXLENBRXZDLENBRk0sQ0FBUDtBQUlIOzs7a0NBRVNGLE8sRUFBUzs7QUFFZixnQ0FBSyxFQUFFQSxnQkFBRixFQUFMLEVBQWtCQyxTQUFsQjs7QUFFQSxtQkFBTyw2QkFBbUJELE9BQW5CLENBQVA7QUFFSDs7OytCQUVNQSxPLEVBQVM7O0FBRVosZ0NBQUssRUFBRUEsZ0JBQUYsRUFBTCxFQUFrQkMsU0FBbEI7O0FBRUEsbUJBQU8sS0FBS0YsU0FBTCxDQUFlQyxPQUFmLENBQVA7QUFFSDs7Ozs7O2tCQUlVSixRIiwiZmlsZSI6IkRlZmF1bHRzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5pbXBvcnQgRGlzcGF0Y2hlciBmcm9tICcuL2Rpc3BhdGNoL0Rpc3BhdGNoZXInO1xuaW1wb3J0IFNpbXBsZU1haWxib3ggZnJvbSAnLi9kaXNwYXRjaC9TaW1wbGVNYWlsYm94JztcbmltcG9ydCBTaW1wbGVEaXNwYXRjaGVyIGZyb20gJy4vZGlzcGF0Y2gvU2ltcGxlRGlzcGF0Y2hlcic7XG5pbXBvcnQgT25lRm9yT25lU3RyYXRlZ3kgZnJvbSAnLi9PbmVGb3JPbmVTdHJhdGVneSc7XG5pbXBvcnQgTG9jYWxSZWZlcmVuY2UgZnJvbSAnLi9Mb2NhbFJlZmVyZW5jZSc7XG5pbXBvcnQgQ29udGV4dCBmcm9tICcuL0NvbnRleHQnO1xuXG4vKipcbiAqIERlZmF1bHRzIHByb3ZpZGVzIHRoZSBkZWZhdWx0cyBmb3IgY3JlYXRpbmcgYSBDb25jZXJuLlxuICogWW91IG11c3QgcGFzcyBhIGZ1bmN0aW9uIHRvIHRoZSBjb25zdHJ1Y3RvciB0byBhY3R1YWxseSBjcmVhdGUgeW91ciBDb25jZXJuLlxuICogQGltcGxlbWVudHMge0NvbmNlcm5GYWN0b3J5fVxuICogQHBhcmFtIHtmdW5jdGlvbn0gQ29uc3RydWN0b3JcbiAqL1xuY2xhc3MgRGVmYXVsdHMge1xuXG4gICAgY29uc3RydWN0b3IocHJvdmlkZXIpIHtcblxuICAgICAgICBiZW9mKHsgcHJvdmlkZXIgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICB0aGlzLl9wcm92aWRlciA9IHByb3ZpZGVyO1xuXG4gICAgfVxuXG4gICAgZGlzcGF0Y2hlcihjb250ZXh0KSB7XG5cbiAgICAgICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgU2ltcGxlRGlzcGF0Y2hlcih0aGlzLCBjb250ZXh0KTtcblxuICAgIH1cblxuICAgIG1haWxib3goZGlzcGF0Y2hlcikge1xuXG4gICAgICAgIGJlb2YoeyBkaXNwYXRjaGVyIH0pLmludGVyZmFjZShEaXNwYXRjaGVyKTtcblxuICAgICAgICByZXR1cm4gbmV3IFNpbXBsZU1haWxib3goZGlzcGF0Y2hlcik7XG5cbiAgICB9XG5cbiAgICBlcnJvckhhbmRsaW5nU3RyYXRlZ3koKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBPbmVGb3JPbmVTdHJhdGVneShmdW5jdGlvbigpIHtcblxuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIHJlZmVyZW5jZShjb250ZXh0KSB7XG5cbiAgICAgICAgYmVvZih7IGNvbnRleHQgfSkuaW50ZXJmYWNlKENvbnRleHQpO1xuXG4gICAgICAgIHJldHVybiBuZXcgTG9jYWxSZWZlcmVuY2UoY29udGV4dCk7XG5cbiAgICB9XG5cbiAgICBjcmVhdGUoY29udGV4dCkge1xuXG4gICAgICAgIGJlb2YoeyBjb250ZXh0IH0pLmludGVyZmFjZShDb250ZXh0KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXIoY29udGV4dCk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgRGVmYXVsdHNcbiJdfQ==
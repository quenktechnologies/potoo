'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _MockConcern = require('./MockConcern');

var _MockConcern2 = _interopRequireDefault(_MockConcern);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockDispatcher
 */
var MockDispatcher = function () {
    function MockDispatcher() {
        _classCallCheck(this, MockDispatcher);

        this.calls = {
            execute: 0,
            executeOnStart: 0,
            executeOnRestart: 0,
            executeOnStop: 0,
            executeOnPause: 0,
            executeOnResume: 0
        };

        this.Concern = new _MockConcern2.default();
    }

    _createClass(MockDispatcher, [{
        key: 'onEnqueue',
        value: function onEnqueue(mailbox) {}
    }, {
        key: 'execute',
        value: function execute(cb, success) {
            var _this = this;

            return _bluebird2.default.try(function () {
                return cb(_this.Concern);
            }).then(success);
        }
    }, {
        key: 'executeChildError',
        value: function executeChildError(e, child) {}
    }, {
        key: 'executeRegeneration',
        value: function executeRegeneration() {}
    }, {
        key: 'executeOnStart',
        value: function executeOnStart() {

            this.calls.executeOnStart = this.calls.executeOnStart + 1;
        }
    }, {
        key: 'executeOnPause',
        value: function executeOnPause() {

            this.calls.executeOnPause = this.calls.executeOnPause + 1;
        }
    }, {
        key: 'executeOnResume',
        value: function executeOnResume() {

            this.calls.executeOnResume = this.calls.executeOnResume + 1;
        }
    }, {
        key: 'executeOnRestart',
        value: function executeOnRestart() {

            this.calls.executeOnRestart = this.calls.executeOnRestart + 1;
        }
    }, {
        key: 'executeOnStop',
        value: function executeOnStop() {

            this.calls.executeOnStop = this.calls.executeOnStop + 1;
        }
    }]);

    return MockDispatcher;
}();

exports.default = MockDispatcher;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tEaXNwYXRjaGVyLmpzIl0sIm5hbWVzIjpbIk1vY2tEaXNwYXRjaGVyIiwiY2FsbHMiLCJleGVjdXRlIiwiZXhlY3V0ZU9uU3RhcnQiLCJleGVjdXRlT25SZXN0YXJ0IiwiZXhlY3V0ZU9uU3RvcCIsImV4ZWN1dGVPblBhdXNlIiwiZXhlY3V0ZU9uUmVzdW1lIiwiQ29uY2VybiIsIm1haWxib3giLCJjYiIsInN1Y2Nlc3MiLCJ0cnkiLCJ0aGVuIiwiZSIsImNoaWxkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7Ozs7O0FBRUE7OztJQUdNQSxjO0FBRUYsOEJBQWM7QUFBQTs7QUFFVixhQUFLQyxLQUFMLEdBQWE7QUFDVEMscUJBQVMsQ0FEQTtBQUVUQyw0QkFBZ0IsQ0FGUDtBQUdUQyw4QkFBa0IsQ0FIVDtBQUlUQywyQkFBZSxDQUpOO0FBS1RDLDRCQUFnQixDQUxQO0FBTVRDLDZCQUFpQjtBQU5SLFNBQWI7O0FBU0EsYUFBS0MsT0FBTCxHQUFlLDJCQUFmO0FBRUg7Ozs7a0NBRVNDLE8sRUFBUyxDQUdsQjs7O2dDQUVPQyxFLEVBQUlDLE8sRUFBUztBQUFBOztBQUVqQixtQkFBTyxtQkFBUUMsR0FBUixDQUFZO0FBQUEsdUJBQUlGLEdBQUcsTUFBS0YsT0FBUixDQUFKO0FBQUEsYUFBWixFQUNQSyxJQURPLENBQ0ZGLE9BREUsQ0FBUDtBQUdIOzs7MENBRWlCRyxDLEVBQUdDLEssRUFBTyxDQUkzQjs7OzhDQUVxQixDQUVyQjs7O3lDQUVnQjs7QUFFYixpQkFBS2QsS0FBTCxDQUFXRSxjQUFYLEdBQTRCLEtBQUtGLEtBQUwsQ0FBV0UsY0FBWCxHQUE0QixDQUF4RDtBQUVIOzs7eUNBRWdCOztBQUViLGlCQUFLRixLQUFMLENBQVdLLGNBQVgsR0FBNEIsS0FBS0wsS0FBTCxDQUFXSyxjQUFYLEdBQTRCLENBQXhEO0FBRUg7OzswQ0FFaUI7O0FBRWQsaUJBQUtMLEtBQUwsQ0FBV00sZUFBWCxHQUE2QixLQUFLTixLQUFMLENBQVdNLGVBQVgsR0FBNkIsQ0FBMUQ7QUFFSDs7OzJDQUVrQjs7QUFFZixpQkFBS04sS0FBTCxDQUFXRyxnQkFBWCxHQUE4QixLQUFLSCxLQUFMLENBQVdHLGdCQUFYLEdBQThCLENBQTVEO0FBRUg7Ozt3Q0FFZTs7QUFFWixpQkFBS0gsS0FBTCxDQUFXSSxhQUFYLEdBQTJCLEtBQUtKLEtBQUwsQ0FBV0ksYUFBWCxHQUEyQixDQUF0RDtBQUVIOzs7Ozs7a0JBSVVMLGMiLCJmaWxlIjoiTW9ja0Rpc3BhdGNoZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUHJvbWlzZSBmcm9tICdibHVlYmlyZCc7XG5pbXBvcnQgTW9ja0NvbmNlcm4gZnJvbSAnLi9Nb2NrQ29uY2Vybic7XG5cbi8qKlxuICogTW9ja0Rpc3BhdGNoZXJcbiAqL1xuY2xhc3MgTW9ja0Rpc3BhdGNoZXIge1xuXG4gICAgY29uc3RydWN0b3IoKSB7XG5cbiAgICAgICAgdGhpcy5jYWxscyA9IHtcbiAgICAgICAgICAgIGV4ZWN1dGU6IDAsXG4gICAgICAgICAgICBleGVjdXRlT25TdGFydDogMCxcbiAgICAgICAgICAgIGV4ZWN1dGVPblJlc3RhcnQ6IDAsXG4gICAgICAgICAgICBleGVjdXRlT25TdG9wOiAwLFxuICAgICAgICAgICAgZXhlY3V0ZU9uUGF1c2U6IDAsXG4gICAgICAgICAgICBleGVjdXRlT25SZXN1bWU6IDBcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLkNvbmNlcm4gPSBuZXcgTW9ja0NvbmNlcm4oKTtcblxuICAgIH1cblxuICAgIG9uRW5xdWV1ZShtYWlsYm94KSB7XG5cblxuICAgIH1cblxuICAgIGV4ZWN1dGUoY2IsIHN1Y2Nlc3MpIHtcblxuICAgICAgICByZXR1cm4gUHJvbWlzZS50cnkoKCk9PmNiKHRoaXMuQ29uY2VybikpLlxuICAgICAgICB0aGVuKHN1Y2Nlc3MpO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZUNoaWxkRXJyb3IoZSwgY2hpbGQpIHtcblxuXG5cbiAgICB9XG5cbiAgICBleGVjdXRlUmVnZW5lcmF0aW9uKCkge1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uU3RhcnQoKSB7XG5cbiAgICAgICAgdGhpcy5jYWxscy5leGVjdXRlT25TdGFydCA9IHRoaXMuY2FsbHMuZXhlY3V0ZU9uU3RhcnQgKyAxO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uUGF1c2UoKSB7XG5cbiAgICAgICAgdGhpcy5jYWxscy5leGVjdXRlT25QYXVzZSA9IHRoaXMuY2FsbHMuZXhlY3V0ZU9uUGF1c2UgKyAxO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uUmVzdW1lKCkge1xuXG4gICAgICAgIHRoaXMuY2FsbHMuZXhlY3V0ZU9uUmVzdW1lID0gdGhpcy5jYWxscy5leGVjdXRlT25SZXN1bWUgKyAxO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uUmVzdGFydCgpIHtcblxuICAgICAgICB0aGlzLmNhbGxzLmV4ZWN1dGVPblJlc3RhcnQgPSB0aGlzLmNhbGxzLmV4ZWN1dGVPblJlc3RhcnQgKyAxO1xuXG4gICAgfVxuXG4gICAgZXhlY3V0ZU9uU3RvcCgpIHtcblxuICAgICAgICB0aGlzLmNhbGxzLmV4ZWN1dGVPblN0b3AgPSB0aGlzLmNhbGxzLmV4ZWN1dGVPblN0b3AgKyAxO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IE1vY2tEaXNwYXRjaGVyXG4iXX0=
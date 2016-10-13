'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _MockReference = require('./MockReference');

var _MockReference2 = _interopRequireDefault(_MockReference);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * MockSystem comment
 */
var MockSystem = function () {
    function MockSystem() {
        var _this = this;

        _classCallCheck(this, MockSystem);

        this.deadLetterCount = [];
        this.Guardian = new _MockReference2.default();
        this.DeadLetters = {
            tell: function tell(message, from) {
                _this.deadLetterCount.push({ message: message, from: from });
            }
        };
    }

    _createClass(MockSystem, [{
        key: 'select',
        value: function select(path) {

            return this.Guardian.select(path);
        }
    }, {
        key: 'concernOf',
        value: function concernOf(factory, path) {

            return this.Guardian.concernOf(factory, path);
        }
    }, {
        key: 'deadLetters',
        value: function deadLetters() {

            return this.DeadLetters;
        }
    }, {
        key: 'on',
        value: function on() {}
    }, {
        key: 'emit',
        value: function emit() {}
    }]);

    return MockSystem;
}();

exports.default = MockSystem;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy90ZXN0aW5nL01vY2tTeXN0ZW0uanMiXSwibmFtZXMiOlsiTW9ja1N5c3RlbSIsImRlYWRMZXR0ZXJDb3VudCIsIkd1YXJkaWFuIiwiRGVhZExldHRlcnMiLCJ0ZWxsIiwibWVzc2FnZSIsImZyb20iLCJwdXNoIiwicGF0aCIsInNlbGVjdCIsImZhY3RvcnkiLCJjb25jZXJuT2YiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7Ozs7O0FBQ0E7OztJQUdNQSxVO0FBRUYsMEJBQWM7QUFBQTs7QUFBQTs7QUFFVixhQUFLQyxlQUFMLEdBQXVCLEVBQXZCO0FBQ0EsYUFBS0MsUUFBTCxHQUFnQiw2QkFBaEI7QUFDQSxhQUFLQyxXQUFMLEdBQW1CO0FBQ2ZDLGtCQUFNLGNBQUNDLE9BQUQsRUFBVUMsSUFBVixFQUFtQjtBQUNyQixzQkFBS0wsZUFBTCxDQUFxQk0sSUFBckIsQ0FBMEIsRUFBRUYsZ0JBQUYsRUFBV0MsVUFBWCxFQUExQjtBQUNIO0FBSGMsU0FBbkI7QUFNSDs7OzsrQkFFTUUsSSxFQUFNOztBQUVULG1CQUFPLEtBQUtOLFFBQUwsQ0FBY08sTUFBZCxDQUFxQkQsSUFBckIsQ0FBUDtBQUVIOzs7a0NBRVNFLE8sRUFBU0YsSSxFQUFNOztBQUVyQixtQkFBTyxLQUFLTixRQUFMLENBQWNTLFNBQWQsQ0FBd0JELE9BQXhCLEVBQWlDRixJQUFqQyxDQUFQO0FBRUg7OztzQ0FFYTs7QUFFVixtQkFBTyxLQUFLTCxXQUFaO0FBRUg7Ozs2QkFFSSxDQUFFOzs7K0JBRUEsQ0FBRTs7Ozs7O2tCQUdFSCxVIiwiZmlsZSI6Ik1vY2tTeXN0ZW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgTW9ja1JlZmVyZW5jZSBmcm9tICcuL01vY2tSZWZlcmVuY2UnO1xuLyoqXG4gKiBNb2NrU3lzdGVtIGNvbW1lbnRcbiAqL1xuY2xhc3MgTW9ja1N5c3RlbSB7XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcblxuICAgICAgICB0aGlzLmRlYWRMZXR0ZXJDb3VudCA9IFtdO1xuICAgICAgICB0aGlzLkd1YXJkaWFuID0gbmV3IE1vY2tSZWZlcmVuY2UoKTtcbiAgICAgICAgdGhpcy5EZWFkTGV0dGVycyA9IHtcbiAgICAgICAgICAgIHRlbGw6IChtZXNzYWdlLCBmcm9tKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5kZWFkTGV0dGVyQ291bnQucHVzaCh7IG1lc3NhZ2UsIGZyb20gfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICB9XG5cbiAgICBzZWxlY3QocGF0aCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLkd1YXJkaWFuLnNlbGVjdChwYXRoKTtcblxuICAgIH1cblxuICAgIGNvbmNlcm5PZihmYWN0b3J5LCBwYXRoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuR3VhcmRpYW4uY29uY2Vybk9mKGZhY3RvcnksIHBhdGgpO1xuXG4gICAgfVxuXG4gICAgZGVhZExldHRlcnMoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuRGVhZExldHRlcnM7XG5cbiAgICB9XG5cbiAgICBvbigpIHt9XG5cbiAgICBlbWl0KCkge31cbn1cblxuZXhwb3J0IGRlZmF1bHQgTW9ja1N5c3RlbVxuIl19
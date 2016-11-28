'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Signal
 */
var Signal = function () {
    function Signal() {
        _classCallCheck(this, Signal);
    }

    _createClass(Signal, [{
        key: 'toJSON',
        value: function toJSON() {

            return {
                name: this.constructor.name
            };
        }
    }, {
        key: 'toString',
        value: function toString() {

            return JSON.stringify(this);
        }
    }]);

    return Signal;
}();

/**
 * Start
 */


var Start = function (_Signal) {
    _inherits(Start, _Signal);

    function Start() {
        _classCallCheck(this, Start);

        return _possibleConstructorReturn(this, (Start.__proto__ || Object.getPrototypeOf(Start)).apply(this, arguments));
    }

    return Start;
}(Signal);

var Running = function (_Signal2) {
    _inherits(Running, _Signal2);

    function Running() {
        _classCallCheck(this, Running);

        return _possibleConstructorReturn(this, (Running.__proto__ || Object.getPrototypeOf(Running)).apply(this, arguments));
    }

    return Running;
}(Signal);

var Restart = function (_Signal3) {
    _inherits(Restart, _Signal3);

    function Restart() {
        _classCallCheck(this, Restart);

        return _possibleConstructorReturn(this, (Restart.__proto__ || Object.getPrototypeOf(Restart)).apply(this, arguments));
    }

    return Restart;
}(Signal);

var Restarted = function (_Signal4) {
    _inherits(Restarted, _Signal4);

    function Restarted() {
        _classCallCheck(this, Restarted);

        return _possibleConstructorReturn(this, (Restarted.__proto__ || Object.getPrototypeOf(Restarted)).apply(this, arguments));
    }

    return Restarted;
}(Signal);

var Pause = function (_Signal5) {
    _inherits(Pause, _Signal5);

    function Pause() {
        _classCallCheck(this, Pause);

        return _possibleConstructorReturn(this, (Pause.__proto__ || Object.getPrototypeOf(Pause)).apply(this, arguments));
    }

    return Pause;
}(Signal);

var Paused = function (_Signal6) {
    _inherits(Paused, _Signal6);

    function Paused() {
        _classCallCheck(this, Paused);

        return _possibleConstructorReturn(this, (Paused.__proto__ || Object.getPrototypeOf(Paused)).apply(this, arguments));
    }

    return Paused;
}(Signal);

var Resume = function (_Signal7) {
    _inherits(Resume, _Signal7);

    function Resume() {
        _classCallCheck(this, Resume);

        return _possibleConstructorReturn(this, (Resume.__proto__ || Object.getPrototypeOf(Resume)).apply(this, arguments));
    }

    return Resume;
}(Signal);

var Resumed = function (_Signal8) {
    _inherits(Resumed, _Signal8);

    function Resumed() {
        _classCallCheck(this, Resumed);

        return _possibleConstructorReturn(this, (Resumed.__proto__ || Object.getPrototypeOf(Resumed)).apply(this, arguments));
    }

    return Resumed;
}(Signal);

var Stop = function (_Signal9) {
    _inherits(Stop, _Signal9);

    function Stop() {
        _classCallCheck(this, Stop);

        return _possibleConstructorReturn(this, (Stop.__proto__ || Object.getPrototypeOf(Stop)).apply(this, arguments));
    }

    return Stop;
}(Signal);

var Stopped = function (_Signal10) {
    _inherits(Stopped, _Signal10);

    function Stopped() {
        _classCallCheck(this, Stopped);

        return _possibleConstructorReturn(this, (Stopped.__proto__ || Object.getPrototypeOf(Stopped)).apply(this, arguments));
    }

    return Stopped;
}(Signal);

var Closed = function (_Signal11) {
    _inherits(Closed, _Signal11);

    function Closed(ref) {
        _classCallCheck(this, Closed);

        var _this11 = _possibleConstructorReturn(this, (Closed.__proto__ || Object.getPrototypeOf(Closed)).call(this));

        _this11.ref = ref;

        return _this11;
    }

    return Closed;
}(Signal);

Signal.Start = new Start();
Signal.Running = new Running();
Signal.Pause = new Pause();
Signal.Resume = new Resume();
Signal.Resumed = new Resumed();
Signal.Restart = new Restart();
Signal.Restarted = new Restarted();
Signal.Stop = new Stop();
Signal.Stopped = new Stopped();
Signal.Closed = new Closed();

exports.default = Signal;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9TaWduYWwuanMiXSwibmFtZXMiOlsiU2lnbmFsIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiSlNPTiIsInN0cmluZ2lmeSIsIlN0YXJ0IiwiUnVubmluZyIsIlJlc3RhcnQiLCJSZXN0YXJ0ZWQiLCJQYXVzZSIsIlBhdXNlZCIsIlJlc3VtZSIsIlJlc3VtZWQiLCJTdG9wIiwiU3RvcHBlZCIsIkNsb3NlZCIsInJlZiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdNQSxNOzs7Ozs7O2lDQUVPOztBQUVMLG1CQUFPO0FBQ0hDLHNCQUFNLEtBQUtDLFdBQUwsQ0FBaUJEO0FBRHBCLGFBQVA7QUFJSDs7O21DQUVVOztBQUVQLG1CQUFPRSxLQUFLQyxTQUFMLENBQWUsSUFBZixDQUFQO0FBRUg7Ozs7OztBQUlMOzs7OztJQUdNQyxLOzs7Ozs7Ozs7O0VBQWNMLE07O0lBRWRNLE87Ozs7Ozs7Ozs7RUFBZ0JOLE07O0lBRWhCTyxPOzs7Ozs7Ozs7O0VBQWdCUCxNOztJQUVoQlEsUzs7Ozs7Ozs7OztFQUFrQlIsTTs7SUFFbEJTLEs7Ozs7Ozs7Ozs7RUFBY1QsTTs7SUFFZFUsTTs7Ozs7Ozs7OztFQUFlVixNOztJQUVmVyxNOzs7Ozs7Ozs7O0VBQWVYLE07O0lBRWZZLE87Ozs7Ozs7Ozs7RUFBZ0JaLE07O0lBRWhCYSxJOzs7Ozs7Ozs7O0VBQWFiLE07O0lBRWJjLE87Ozs7Ozs7Ozs7RUFBZ0JkLE07O0lBRWhCZSxNOzs7QUFFRixvQkFBWUMsR0FBWixFQUFpQjtBQUFBOztBQUFBOztBQUdiLGdCQUFLQSxHQUFMLEdBQVdBLEdBQVg7O0FBSGE7QUFLaEI7OztFQVBnQmhCLE07O0FBV3JCQSxPQUFPSyxLQUFQLEdBQWUsSUFBSUEsS0FBSixFQUFmO0FBQ0FMLE9BQU9NLE9BQVAsR0FBaUIsSUFBSUEsT0FBSixFQUFqQjtBQUNBTixPQUFPUyxLQUFQLEdBQWUsSUFBSUEsS0FBSixFQUFmO0FBQ0FULE9BQU9XLE1BQVAsR0FBZ0IsSUFBSUEsTUFBSixFQUFoQjtBQUNBWCxPQUFPWSxPQUFQLEdBQWlCLElBQUlBLE9BQUosRUFBakI7QUFDQVosT0FBT08sT0FBUCxHQUFpQixJQUFJQSxPQUFKLEVBQWpCO0FBQ0FQLE9BQU9RLFNBQVAsR0FBbUIsSUFBSUEsU0FBSixFQUFuQjtBQUNBUixPQUFPYSxJQUFQLEdBQWMsSUFBSUEsSUFBSixFQUFkO0FBQ0FiLE9BQU9jLE9BQVAsR0FBaUIsSUFBSUEsT0FBSixFQUFqQjtBQUNBZCxPQUFPZSxNQUFQLEdBQWdCLElBQUlBLE1BQUosRUFBaEI7O2tCQUVlZixNIiwiZmlsZSI6IlNpZ25hbC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBiZW9mIGZyb20gJ2Jlb2YnO1xuXG4vKipcbiAqIFNpZ25hbFxuICovXG5jbGFzcyBTaWduYWwge1xuXG4gICAgdG9KU09OKCkge1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBuYW1lOiB0aGlzLmNvbnN0cnVjdG9yLm5hbWVcbiAgICAgICAgfTtcblxuICAgIH1cblxuICAgIHRvU3RyaW5nKCkge1xuXG4gICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN0YXJ0XG4gKi9cbmNsYXNzIFN0YXJ0IGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFJ1bm5pbmcgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgUmVzdGFydCBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBSZXN0YXJ0ZWQgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgUGF1c2UgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgUGF1c2VkIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFJlc3VtZSBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBSZXN1bWVkIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFN0b3AgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgU3RvcHBlZCBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBDbG9zZWQgZXh0ZW5kcyBTaWduYWwge1xuXG4gICAgY29uc3RydWN0b3IocmVmKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5yZWYgPSByZWY7XG5cbiAgICB9XG5cbn1cblxuU2lnbmFsLlN0YXJ0ID0gbmV3IFN0YXJ0KCk7XG5TaWduYWwuUnVubmluZyA9IG5ldyBSdW5uaW5nKCk7XG5TaWduYWwuUGF1c2UgPSBuZXcgUGF1c2UoKTtcblNpZ25hbC5SZXN1bWUgPSBuZXcgUmVzdW1lKCk7XG5TaWduYWwuUmVzdW1lZCA9IG5ldyBSZXN1bWVkKCk7XG5TaWduYWwuUmVzdGFydCA9IG5ldyBSZXN0YXJ0KCk7XG5TaWduYWwuUmVzdGFydGVkID0gbmV3IFJlc3RhcnRlZCgpO1xuU2lnbmFsLlN0b3AgPSBuZXcgU3RvcCgpO1xuU2lnbmFsLlN0b3BwZWQgPSBuZXcgU3RvcHBlZCgpO1xuU2lnbmFsLkNsb3NlZCA9IG5ldyBDbG9zZWQoKTtcblxuZXhwb3J0IGRlZmF1bHQgU2lnbmFsXG4iXX0=
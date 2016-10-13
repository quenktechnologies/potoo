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

    function Closed() {
        _classCallCheck(this, Closed);

        return _possibleConstructorReturn(this, (Closed.__proto__ || Object.getPrototypeOf(Closed)).apply(this, arguments));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdGF0ZS9TaWduYWwuanMiXSwibmFtZXMiOlsiU2lnbmFsIiwibmFtZSIsImNvbnN0cnVjdG9yIiwiU3RhcnQiLCJSdW5uaW5nIiwiUmVzdGFydCIsIlJlc3RhcnRlZCIsIlBhdXNlIiwiUGF1c2VkIiwiUmVzdW1lIiwiUmVzdW1lZCIsIlN0b3AiLCJTdG9wcGVkIiwiQ2xvc2VkIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7QUFFQTs7O0lBR01BLE07Ozs7Ozs7aUNBRU87O0FBRUwsbUJBQU87QUFDSEMsc0JBQU0sS0FBS0MsV0FBTCxDQUFpQkQ7QUFEcEIsYUFBUDtBQUlIOzs7Ozs7QUFJTDs7Ozs7SUFHTUUsSzs7Ozs7Ozs7OztFQUFjSCxNOztJQUVkSSxPOzs7Ozs7Ozs7O0VBQWdCSixNOztJQUVoQkssTzs7Ozs7Ozs7OztFQUFnQkwsTTs7SUFFaEJNLFM7Ozs7Ozs7Ozs7RUFBa0JOLE07O0lBRWxCTyxLOzs7Ozs7Ozs7O0VBQWNQLE07O0lBRWRRLE07Ozs7Ozs7Ozs7RUFBZVIsTTs7SUFFZlMsTTs7Ozs7Ozs7OztFQUFlVCxNOztJQUVmVSxPOzs7Ozs7Ozs7O0VBQWdCVixNOztJQUVoQlcsSTs7Ozs7Ozs7OztFQUFhWCxNOztJQUViWSxPOzs7Ozs7Ozs7O0VBQWdCWixNOztJQUVoQmEsTTs7Ozs7Ozs7OztFQUFlYixNOztBQUVyQkEsT0FBT0csS0FBUCxHQUFlLElBQUlBLEtBQUosRUFBZjtBQUNBSCxPQUFPSSxPQUFQLEdBQWlCLElBQUlBLE9BQUosRUFBakI7QUFDQUosT0FBT08sS0FBUCxHQUFlLElBQUlBLEtBQUosRUFBZjtBQUNBUCxPQUFPUyxNQUFQLEdBQWdCLElBQUlBLE1BQUosRUFBaEI7QUFDQVQsT0FBT1UsT0FBUCxHQUFpQixJQUFJQSxPQUFKLEVBQWpCO0FBQ0FWLE9BQU9LLE9BQVAsR0FBaUIsSUFBSUEsT0FBSixFQUFqQjtBQUNBTCxPQUFPTSxTQUFQLEdBQW1CLElBQUlBLFNBQUosRUFBbkI7QUFDQU4sT0FBT1csSUFBUCxHQUFjLElBQUlBLElBQUosRUFBZDtBQUNBWCxPQUFPWSxPQUFQLEdBQWlCLElBQUlBLE9BQUosRUFBakI7QUFDQVosT0FBT2EsTUFBUCxHQUFnQixJQUFJQSxNQUFKLEVBQWhCOztrQkFFZWIsTSIsImZpbGUiOiJTaWduYWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgYmVvZiBmcm9tICdiZW9mJztcblxuLyoqXG4gKiBTaWduYWxcbiAqL1xuY2xhc3MgU2lnbmFsIHtcblxuICAgIHRvSlNPTigpIHtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbmFtZTogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lXG4gICAgICAgIH07XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBTdGFydFxuICovXG5jbGFzcyBTdGFydCBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBSdW5uaW5nIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFJlc3RhcnQgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgUmVzdGFydGVkIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFBhdXNlIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFBhdXNlZCBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBSZXN1bWUgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgUmVzdW1lZCBleHRlbmRzIFNpZ25hbCB7fVxuXG5jbGFzcyBTdG9wIGV4dGVuZHMgU2lnbmFsIHt9XG5cbmNsYXNzIFN0b3BwZWQgZXh0ZW5kcyBTaWduYWwge31cblxuY2xhc3MgQ2xvc2VkIGV4dGVuZHMgU2lnbmFsIHt9XG5cblNpZ25hbC5TdGFydCA9IG5ldyBTdGFydCgpO1xuU2lnbmFsLlJ1bm5pbmcgPSBuZXcgUnVubmluZygpO1xuU2lnbmFsLlBhdXNlID0gbmV3IFBhdXNlKCk7XG5TaWduYWwuUmVzdW1lID0gbmV3IFJlc3VtZSgpO1xuU2lnbmFsLlJlc3VtZWQgPSBuZXcgUmVzdW1lZCgpO1xuU2lnbmFsLlJlc3RhcnQgPSBuZXcgUmVzdGFydCgpO1xuU2lnbmFsLlJlc3RhcnRlZCA9IG5ldyBSZXN0YXJ0ZWQoKTtcblNpZ25hbC5TdG9wID0gbmV3IFN0b3AoKTtcblNpZ25hbC5TdG9wcGVkID0gbmV3IFN0b3BwZWQoKTtcblNpZ25hbC5DbG9zZWQgPSBuZXcgQ2xvc2VkKCk7XG5cbmV4cG9ydCBkZWZhdWx0IFNpZ25hbFxuIl19
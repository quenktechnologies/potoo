'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.error = exports.warn = exports.info = exports.debug = exports.map = exports.Log = exports.ERROR = exports.WARN = exports.INFO = exports.DEBUG = undefined;

var _be = require('./be');

var _util = require('./util');

var _Type2 = require('./fpl/data/Type');

var _Free = require('./fpl/monad/Free');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DEBUG = exports.DEBUG = 7;
var INFO = exports.INFO = 5;
var WARN = exports.WARN = 2;
var ERROR = exports.ERROR = 1;

/**
 * Log
 */

var Log = exports.Log = function (_Type) {
  _inherits(Log, _Type);

  function Log(props, checks) {
    _classCallCheck(this, Log);

    var _this = _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, props, (0, _util.merge)(checks, { level: (0, _be.type)(Number), message: (0, _be.type)(String), next: _be.any })));

    _this.map = map(_this);

    return _this;
  }

  return Log;
}(_Type2.Type);

/**
 * map
 * @summary map :: Log<A> →  (A→ B) →  Log<B>
 */


var map = exports.map = function map(l) {
  return function (f) {
    return l.copy({ next: f(l.next) });
  };
};

/**
 * debug logs a message at the debug level
 * @summary debug :: string →  Free<Log, null>
 */
var debug = exports.debug = function debug(message) {
  return (0, _Free.liftF)(new Log({ level: DEBUG, message: message }));
};

/**
 * info logs a message at the info level to the system log.
 * @summary info :: string →  Free<Log, null>
 */
var info = exports.info = function info(message) {
  return (0, _Free.liftF)(new Log({ level: INFO, message: message }));
};

/**
 * warn logs a message at the warn level
 * @summary warn :: string →  Free<Log, null>
 */
var warn = exports.warn = function warn(message) {
  return (0, _Free.liftF)(new Log({ level: WARN, message: message }));
};

/**
 * error logs a message at the error level
 * @summary error :: string →  Free<Log, null>
 */
var error = exports.error = function error(message) {
  return (0, _Free.liftF)(new Log({ level: ERROR, message: message }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Mb2cuanMiXSwibmFtZXMiOlsiREVCVUciLCJJTkZPIiwiV0FSTiIsIkVSUk9SIiwiTG9nIiwicHJvcHMiLCJjaGVja3MiLCJsZXZlbCIsIk51bWJlciIsIm1lc3NhZ2UiLCJTdHJpbmciLCJuZXh0IiwibWFwIiwibCIsImNvcHkiLCJmIiwiZGVidWciLCJpbmZvIiwid2FybiIsImVycm9yIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRU8sSUFBTUEsd0JBQVEsQ0FBZDtBQUNBLElBQU1DLHNCQUFPLENBQWI7QUFDQSxJQUFNQyxzQkFBTyxDQUFiO0FBQ0EsSUFBTUMsd0JBQVEsQ0FBZDs7QUFFUDs7OztJQUdhQyxHLFdBQUFBLEc7OztBQUVULGVBQVlDLEtBQVosRUFBbUJDLE1BQW5CLEVBQTJCO0FBQUE7O0FBQUEsMEdBRWpCRCxLQUZpQixFQUVWLGlCQUFNQyxNQUFOLEVBQWMsRUFBRUMsT0FBTyxjQUFLQyxNQUFMLENBQVQsRUFBdUJDLFNBQVMsY0FBS0MsTUFBTCxDQUFoQyxFQUE4Q0MsYUFBOUMsRUFBZCxDQUZVOztBQUl2QixVQUFLQyxHQUFMLEdBQVdBLFVBQVg7O0FBSnVCO0FBTTFCOzs7OztBQUlMOzs7Ozs7QUFJTyxJQUFNQSxvQkFBTSxTQUFOQSxHQUFNO0FBQUEsU0FBSztBQUFBLFdBQUtDLEVBQUVDLElBQUYsQ0FBTyxFQUFFSCxNQUFNSSxFQUFFRixFQUFFRixJQUFKLENBQVIsRUFBUCxDQUFMO0FBQUEsR0FBTDtBQUFBLENBQVo7O0FBRVA7Ozs7QUFJTyxJQUFNSyx3QkFBUSxTQUFSQSxLQUFRO0FBQUEsU0FBVyxpQkFBTSxJQUFJWixHQUFKLENBQVEsRUFBRUcsT0FBT1AsS0FBVCxFQUFnQlMsZ0JBQWhCLEVBQVIsQ0FBTixDQUFYO0FBQUEsQ0FBZDs7QUFFUDs7OztBQUlPLElBQU1RLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFXLGlCQUFNLElBQUliLEdBQUosQ0FBUSxFQUFFRyxPQUFPTixJQUFULEVBQWVRLGdCQUFmLEVBQVIsQ0FBTixDQUFYO0FBQUEsQ0FBYjs7QUFFUDs7OztBQUlPLElBQU1TLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFXLGlCQUFNLElBQUlkLEdBQUosQ0FBUSxFQUFFRyxPQUFPTCxJQUFULEVBQWVPLGdCQUFmLEVBQVIsQ0FBTixDQUFYO0FBQUEsQ0FBYjs7QUFFUDs7OztBQUlPLElBQU1VLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxTQUFXLGlCQUFNLElBQUlmLEdBQUosQ0FBUSxFQUFFRyxPQUFPSixLQUFULEVBQWdCTSxnQkFBaEIsRUFBUixDQUFOLENBQVg7QUFBQSxDQUFkIiwiZmlsZSI6IkxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHR5cGUsIGFueSB9IGZyb20gJy4vYmUnO1xuaW1wb3J0IHsgbWVyZ2UgfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHsgVHlwZSB9IGZyb20gJy4vZnBsL2RhdGEvVHlwZSc7XG5pbXBvcnQgeyBsaWZ0RiB9IGZyb20gJy4vZnBsL21vbmFkL0ZyZWUnO1xuXG5leHBvcnQgY29uc3QgREVCVUcgPSA3O1xuZXhwb3J0IGNvbnN0IElORk8gPSA1O1xuZXhwb3J0IGNvbnN0IFdBUk4gPSAyO1xuZXhwb3J0IGNvbnN0IEVSUk9SID0gMTtcblxuLyoqXG4gKiBMb2dcbiAqL1xuZXhwb3J0IGNsYXNzIExvZyBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMsIGNoZWNrcykge1xuXG4gICAgICAgIHN1cGVyKHByb3BzLCBtZXJnZShjaGVja3MsIHsgbGV2ZWw6IHR5cGUoTnVtYmVyKSwgbWVzc2FnZTogdHlwZShTdHJpbmcpLCBuZXh0OiBhbnkgfSkpO1xuXG4gICAgICAgIHRoaXMubWFwID0gbWFwKHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbWFwXG4gKiBAc3VtbWFyeSBtYXAgOjogTG9nPEE+IOKGkiAgKEHihpIgQikg4oaSICBMb2c8Qj5cbiAqL1xuZXhwb3J0IGNvbnN0IG1hcCA9IGwgPT4gZiA9PiBsLmNvcHkoeyBuZXh0OiBmKGwubmV4dCkgfSk7XG5cbi8qKlxuICogZGVidWcgbG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGRlYnVnIGxldmVsXG4gKiBAc3VtbWFyeSBkZWJ1ZyA6OiBzdHJpbmcg4oaSICBGcmVlPExvZywgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGRlYnVnID0gbWVzc2FnZSA9PiBsaWZ0RihuZXcgTG9nKHsgbGV2ZWw6IERFQlVHLCBtZXNzYWdlIH0pKTtcblxuLyoqXG4gKiBpbmZvIGxvZ3MgYSBtZXNzYWdlIGF0IHRoZSBpbmZvIGxldmVsIHRvIHRoZSBzeXN0ZW0gbG9nLlxuICogQHN1bW1hcnkgaW5mbyA6OiBzdHJpbmcg4oaSICBGcmVlPExvZywgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGluZm8gPSBtZXNzYWdlID0+IGxpZnRGKG5ldyBMb2coeyBsZXZlbDogSU5GTywgbWVzc2FnZSB9KSk7XG5cbi8qKlxuICogd2FybiBsb2dzIGEgbWVzc2FnZSBhdCB0aGUgd2FybiBsZXZlbFxuICogQHN1bW1hcnkgd2FybiA6OiBzdHJpbmcg4oaSICBGcmVlPExvZywgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IHdhcm4gPSBtZXNzYWdlID0+IGxpZnRGKG5ldyBMb2coeyBsZXZlbDogV0FSTiwgbWVzc2FnZSB9KSk7XG5cbi8qKlxuICogZXJyb3IgbG9ncyBhIG1lc3NhZ2UgYXQgdGhlIGVycm9yIGxldmVsXG4gKiBAc3VtbWFyeSBlcnJvciA6OiBzdHJpbmcg4oaSICBGcmVlPExvZywgbnVsbD5cbiAqL1xuZXhwb3J0IGNvbnN0IGVycm9yID0gbWVzc2FnZSA9PiBsaWZ0RihuZXcgTG9nKHsgbGV2ZWw6IEVSUk9SLCBtZXNzYWdlIH0pKTtcbiJdfQ==
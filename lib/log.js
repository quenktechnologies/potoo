'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logOp = exports.Log = exports.toString = exports.expandString = undefined;

var _Match = require('./Match');

var _be = require('./be');

var _Type2 = require('./Type');

var _Type3 = _interopRequireDefault(_Type2);

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

var _Ops = require('./Ops');

var Ops = _interopRequireWildcard(_Ops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * expandString takes a string and converts variables between {} into
 * the context value.
 * @summary (string, Object) →  string
 */
var expandString = exports.expandString = function expandString(s, c) {
    return (0, _Match.match)(s).caseOf('', function () {
        return '';
    }).caseOf(String, function (s) {
        return s.replace(/\{([\w\.\-]*)\}/g, function (s, k) {
            return (0, _propertySeek2.default)(c, k);
        });
    }).end();
};

/**
 * toString turns objects into string in a useful way.
 * @summary :: string →  string
 */
var toString = exports.toString = function toString(str) {
    return '' + str;
};

var MESSAGES = {
    SPAWN: 'Spawn child \'{op.id}\'',
    TELL: 'Tell actor \'{op.to}\' \'{op.message}',
    RECEIVE: 'Started receiving.'
};

var LEVELS = {

    SPAWN: 'info',
    TELL: 'info',
    RECEIVE: 'info'

};

var Log = exports.Log = function (_Type) {
    _inherits(Log, _Type);

    function Log(props) {
        _classCallCheck(this, Log);

        return _possibleConstructorReturn(this, (Log.__proto__ || Object.getPrototypeOf(Log)).call(this, props, { level: (0, _be.type)(Number), message: _be.type }));
    }

    return Log;
}(_Type3.default);

/**
 * logOp logs an op before it executes.
 * @summary logOp :: Op →  Free<Log, null>
 */


var logOp = exports.logOp = function logOp(op) {
    return (0, _Match.match)(op).caseOf(Spawn, function (_ref) {
        var template = _ref.template;
        return new Log({ level: INFO, message: 'Spawn child \'' + template.id + '\'' });
    }).caseOf(Tell, function (_ref2) {
        var to = _ref2.to,
            message = _ref2.message;
        return new Log({ level: INFO, message: 'Tell \'' + to + '\' message ' + toString(message) });
    }).caseOf(Receive, function () {
        return new Log({ level: INFO, message: 'Started receiving.' });
    }).end();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2cuanMiXSwibmFtZXMiOlsiT3BzIiwiZXhwYW5kU3RyaW5nIiwicyIsImMiLCJjYXNlT2YiLCJTdHJpbmciLCJyZXBsYWNlIiwiayIsImVuZCIsInRvU3RyaW5nIiwic3RyIiwiTUVTU0FHRVMiLCJTUEFXTiIsIlRFTEwiLCJSRUNFSVZFIiwiTEVWRUxTIiwiTG9nIiwicHJvcHMiLCJsZXZlbCIsIk51bWJlciIsIm1lc3NhZ2UiLCJsb2dPcCIsIm9wIiwiU3Bhd24iLCJ0ZW1wbGF0ZSIsIklORk8iLCJpZCIsIlRlbGwiLCJ0byIsIlJlY2VpdmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7O0lBQVlBLEc7Ozs7Ozs7Ozs7OztBQUVaOzs7OztBQUtPLElBQU1DLHNDQUFlLFNBQWZBLFlBQWUsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVSxrQkFBTUQsQ0FBTixFQUNqQ0UsTUFEaUMsQ0FDMUIsRUFEMEIsRUFDdEI7QUFBQSxlQUFNLEVBQU47QUFBQSxLQURzQixFQUVqQ0EsTUFGaUMsQ0FFMUJDLE1BRjBCLEVBRWxCO0FBQUEsZUFBS0gsRUFBRUksT0FBRixDQUFVLGtCQUFWLEVBQThCLFVBQUNKLENBQUQsRUFBSUssQ0FBSjtBQUFBLG1CQUFVLDRCQUFTSixDQUFULEVBQVlJLENBQVosQ0FBVjtBQUFBLFNBQTlCLENBQUw7QUFBQSxLQUZrQixFQUdqQ0MsR0FIaUMsRUFBVjtBQUFBLENBQXJCOztBQUtQOzs7O0FBSU8sSUFBTUMsOEJBQVcsU0FBWEEsUUFBVztBQUFBLFdBQU8sS0FBS0MsR0FBWjtBQUFBLENBQWpCOztBQUVQLElBQU1DLFdBQVc7QUFDYkMsb0NBRGE7QUFFYkMsaURBRmE7QUFHYkM7QUFIYSxDQUFqQjs7QUFNQSxJQUFNQyxTQUFTOztBQUVYSCxXQUFPLE1BRkk7QUFHWEMsVUFBTSxNQUhLO0FBSVhDLGFBQVM7O0FBSkUsQ0FBZjs7SUFRYUUsRyxXQUFBQSxHOzs7QUFFVCxpQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUFBLHlHQUVUQSxLQUZTLEVBRUYsRUFBRUMsT0FBTyxjQUFLQyxNQUFMLENBQVQsRUFBdUJDLGlCQUF2QixFQUZFO0FBSWxCOzs7OztBQUlMOzs7Ozs7QUFJTyxJQUFNQyx3QkFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBTSxrQkFBTUMsRUFBTixFQUN0QmxCLE1BRHNCLENBQ2ZtQixLQURlLEVBQ1I7QUFBQSxZQUFHQyxRQUFILFFBQUdBLFFBQUg7QUFBQSxlQUNYLElBQUlSLEdBQUosQ0FBUSxFQUFFRSxPQUFPTyxJQUFULEVBQWVMLDRCQUF5QkksU0FBU0UsRUFBbEMsT0FBZixFQUFSLENBRFc7QUFBQSxLQURRLEVBR3RCdEIsTUFIc0IsQ0FHZnVCLElBSGUsRUFHVDtBQUFBLFlBQUdDLEVBQUgsU0FBR0EsRUFBSDtBQUFBLFlBQU9SLE9BQVAsU0FBT0EsT0FBUDtBQUFBLGVBQ1YsSUFBSUosR0FBSixDQUFRLEVBQUVFLE9BQU9PLElBQVQsRUFBZUwscUJBQWtCUSxFQUFsQixtQkFBaUNuQixTQUFTVyxPQUFULENBQWhELEVBQVIsQ0FEVTtBQUFBLEtBSFMsRUFLdEJoQixNQUxzQixDQUtmeUIsT0FMZSxFQUtOO0FBQUEsZUFDYixJQUFJYixHQUFKLENBQVEsRUFBRUUsT0FBT08sSUFBVCxFQUFlTCw2QkFBZixFQUFSLENBRGE7QUFBQSxLQUxNLEVBT3RCWixHQVBzQixFQUFOO0FBQUEsQ0FBZCIsImZpbGUiOiJsb2cuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4vTWF0Y2gnO1xuaW1wb3J0IHt0eXBlfSBmcm9tICcuL2JlJztcbmltcG9ydCBUeXBlIGZyb20gJy4vVHlwZSc7XG5pbXBvcnQgcHJvcGVydHkgZnJvbSAncHJvcGVydHktc2Vlayc7XG5pbXBvcnQgKiBhcyBPcHMgZnJvbSAnLi9PcHMnO1xuXG4vKipcbiAqIGV4cGFuZFN0cmluZyB0YWtlcyBhIHN0cmluZyBhbmQgY29udmVydHMgdmFyaWFibGVzIGJldHdlZW4ge30gaW50b1xuICogdGhlIGNvbnRleHQgdmFsdWUuXG4gKiBAc3VtbWFyeSAoc3RyaW5nLCBPYmplY3QpIOKGkiAgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBleHBhbmRTdHJpbmcgPSAocywgYykgPT4gbWF0Y2gocylcbiAgICAuY2FzZU9mKCcnLCAoKSA9PiAnJylcbiAgICAuY2FzZU9mKFN0cmluZywgcyA9PiBzLnJlcGxhY2UoL1xceyhbXFx3XFwuXFwtXSopXFx9L2csIChzLCBrKSA9PiBwcm9wZXJ0eShjLCBrKSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHRvU3RyaW5nIHR1cm5zIG9iamVjdHMgaW50byBzdHJpbmcgaW4gYSB1c2VmdWwgd2F5LlxuICogQHN1bW1hcnkgOjogc3RyaW5nIOKGkiAgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCB0b1N0cmluZyA9IHN0ciA9PiAnJyArIHN0cjtcblxuY29uc3QgTUVTU0FHRVMgPSB7XG4gICAgU1BBV046IGBTcGF3biBjaGlsZCAne29wLmlkfSdgLFxuICAgIFRFTEw6IGBUZWxsIGFjdG9yICd7b3AudG99JyAne29wLm1lc3NhZ2V9YCxcbiAgICBSRUNFSVZFOiBgU3RhcnRlZCByZWNlaXZpbmcuYFxufTtcblxuY29uc3QgTEVWRUxTID0ge1xuXG4gICAgU1BBV046ICdpbmZvJyxcbiAgICBURUxMOiAnaW5mbycsXG4gICAgUkVDRUlWRTogJ2luZm8nXG5cbn1cblxuZXhwb3J0IGNsYXNzIExvZyBleHRlbmRzIFR5cGUge1xuXG4gICAgY29uc3RydWN0b3IocHJvcHMpIHtcblxuICAgICAgICBzdXBlcihwcm9wcywgeyBsZXZlbDogdHlwZShOdW1iZXIpLCBtZXNzYWdlOiB0eXBlIH0pO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbG9nT3AgbG9ncyBhbiBvcCBiZWZvcmUgaXQgZXhlY3V0ZXMuXG4gKiBAc3VtbWFyeSBsb2dPcCA6OiBPcCDihpIgIEZyZWU8TG9nLCBudWxsPlxuICovXG5leHBvcnQgY29uc3QgbG9nT3AgPSBvcCA9PiBtYXRjaChvcClcbiAgICAuY2FzZU9mKFNwYXduLCAoeyB0ZW1wbGF0ZSB9KSA9PlxuICAgICAgICBuZXcgTG9nKHsgbGV2ZWw6IElORk8sIG1lc3NhZ2U6IGBTcGF3biBjaGlsZCAnJHt0ZW1wbGF0ZS5pZH0nYCB9KSlcbiAgICAuY2FzZU9mKFRlbGwsICh7IHRvLCBtZXNzYWdlIH0pID0+XG4gICAgICAgIG5ldyBMb2coeyBsZXZlbDogSU5GTywgbWVzc2FnZTogYFRlbGwgJyR7dG99JyBtZXNzYWdlICR7dG9TdHJpbmcobWVzc2FnZSl9YCB9KSlcbiAgICAuY2FzZU9mKFJlY2VpdmUsICgpID0+XG4gICAgICAgIG5ldyBMb2coeyBsZXZlbDogSU5GTywgbWVzc2FnZTogYFN0YXJ0ZWQgcmVjZWl2aW5nLmAgfSkpXG4gICAgLmVuZCgpO1xuIl19
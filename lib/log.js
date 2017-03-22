'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.log = exports.expandString = undefined;

var _Match = require('./Match');

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

var _Ops = require('./Ops');

var Ops = _interopRequireWildcard(_Ops);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var MESSAGES = {
  SPAWN: 'Spawn child \'{op.id}\'',
  TELL: 'Tell actor \'{op.to}\' \'{op.message}',
  RECEIVE: 'Started receiving.'
};

/**
 * log
 */
var log = exports.log = function log(op, actor) {};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sb2cuanMiXSwibmFtZXMiOlsiT3BzIiwiZXhwYW5kU3RyaW5nIiwicyIsImMiLCJjYXNlT2YiLCJTdHJpbmciLCJyZXBsYWNlIiwiayIsImVuZCIsIk1FU1NBR0VTIiwiU1BBV04iLCJURUxMIiwiUkVDRUlWRSIsImxvZyIsIm9wIiwiYWN0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUNBOztJQUFZQSxHOzs7Ozs7QUFFWjs7Ozs7QUFLTyxJQUFNQyxzQ0FBZSxTQUFmQSxZQUFlLENBQUNDLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFNBQVUsa0JBQU1ELENBQU4sRUFDakNFLE1BRGlDLENBQzFCLEVBRDBCLEVBQ3RCO0FBQUEsV0FBTSxFQUFOO0FBQUEsR0FEc0IsRUFFakNBLE1BRmlDLENBRTFCQyxNQUYwQixFQUVsQjtBQUFBLFdBQUtILEVBQUVJLE9BQUYsQ0FBVSxrQkFBVixFQUE4QixVQUFDSixDQUFELEVBQUlLLENBQUo7QUFBQSxhQUFVLDRCQUFTSixDQUFULEVBQVlJLENBQVosQ0FBVjtBQUFBLEtBQTlCLENBQUw7QUFBQSxHQUZrQixFQUdqQ0MsR0FIaUMsRUFBVjtBQUFBLENBQXJCOztBQU1QLElBQU1DLFdBQVc7QUFDYkMsa0NBRGE7QUFFYkMsK0NBRmE7QUFHYkM7QUFIYSxDQUFqQjs7QUFNQTs7O0FBR08sSUFBTUMsb0JBQU0sU0FBTkEsR0FBTSxDQUFDQyxFQUFELEVBQUtDLEtBQUwsRUFBZSxDQUFFLENBQTdCIiwiZmlsZSI6ImxvZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi9NYXRjaCc7XG5pbXBvcnQgcHJvcGVydHkgZnJvbSAncHJvcGVydHktc2Vlayc7XG5pbXBvcnQgKiBhcyBPcHMgZnJvbSAnLi9PcHMnO1xuXG4vKipcbiAqIGV4cGFuZFN0cmluZyB0YWtlcyBhIHN0cmluZyBhbmQgY29udmVydHMgdmFyaWFibGVzIGJldHdlZW4ge30gaW50b1xuICogdGhlIGNvbnRleHQgdmFsdWUuXG4gKiBAc3VtbWFyeSAoc3RyaW5nLCBPYmplY3QpIOKGkiAgc3RyaW5nXG4gKi9cbmV4cG9ydCBjb25zdCBleHBhbmRTdHJpbmcgPSAocywgYykgPT4gbWF0Y2gocylcbiAgICAuY2FzZU9mKCcnLCAoKSA9PiAnJylcbiAgICAuY2FzZU9mKFN0cmluZywgcyA9PiBzLnJlcGxhY2UoL1xceyhbXFx3XFwuXFwtXSopXFx9L2csIChzLCBrKSA9PiBwcm9wZXJ0eShjLCBrKSkpXG4gICAgLmVuZCgpO1xuXG5cbmNvbnN0IE1FU1NBR0VTID0ge1xuICAgIFNQQVdOOiBgU3Bhd24gY2hpbGQgJ3tvcC5pZH0nYCxcbiAgICBURUxMOiBgVGVsbCBhY3RvciAne29wLnRvfScgJ3tvcC5tZXNzYWdlfWAsXG4gICAgUkVDRUlWRTogYFN0YXJ0ZWQgcmVjZWl2aW5nLmBcbn07XG5cbi8qKlxuICogbG9nXG4gKi9cbmV4cG9ydCBjb25zdCBsb2cgPSAob3AsIGFjdG9yKSA9PiB7fVxuIl19
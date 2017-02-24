'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.over = exports.set = exports.view = exports.path = undefined;
var _arguments = arguments;

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * path provides a lens for keys on and Object
 * @summary string →  Lens
 */
var path = exports.path = function path(s) {
  return function () {
    return _arguments.length === 1 ? (0, _propertySeek2.default)(s, _arguments[0]) : _propertySeek2.default.set(s, _arguments[0], _arguments[1]);
  };
};

/**
 * view
 * @summary (Lens, Object) →  *
 */
var view = exports.view = function view(l, o) {
  return l(o);
};

/**
 * set
 * @summary (Lens, *, Object) →  *
 */
var set = exports.set = function set(l, v, o) {
  return l(v, o);
};

/**
 * over
 * @summary (Lens, Functor, Object) →  Object
 */
var over = exports.over = function over(l, f, o) {
  return l(f(l(o)), o);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZW5zLmpzIl0sIm5hbWVzIjpbInBhdGgiLCJsZW5ndGgiLCJzIiwic2V0IiwidmlldyIsImwiLCJvIiwidiIsIm92ZXIiLCJmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztBQUFBOzs7Ozs7QUFFQTs7OztBQUlPLElBQU1BLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFLO0FBQUEsV0FBTyxXQUFVQyxNQUFWLEtBQXFCLENBQXRCLEdBQzNCLDRCQUFTQyxDQUFULEVBQVksV0FBVSxDQUFWLENBQVosQ0FEMkIsR0FDQyx1QkFBU0MsR0FBVCxDQUFhRCxDQUFiLEVBQWdCLFdBQVUsQ0FBVixDQUFoQixFQUE4QixXQUFVLENBQVYsQ0FBOUIsQ0FEUDtBQUFBLEdBQUw7QUFBQSxDQUFiOztBQUdQOzs7O0FBSU8sSUFBTUUsc0JBQU8sU0FBUEEsSUFBTyxDQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxTQUFVRCxFQUFFQyxDQUFGLENBQVY7QUFBQSxDQUFiOztBQUVQOzs7O0FBSU8sSUFBTUgsb0JBQU0sU0FBTkEsR0FBTSxDQUFDRSxDQUFELEVBQUlFLENBQUosRUFBT0QsQ0FBUDtBQUFBLFNBQWFELEVBQUVFLENBQUYsRUFBS0QsQ0FBTCxDQUFiO0FBQUEsQ0FBWjs7QUFFUDs7OztBQUlPLElBQU1FLHNCQUFPLFNBQVBBLElBQU8sQ0FBQ0gsQ0FBRCxFQUFJSSxDQUFKLEVBQU9ILENBQVA7QUFBQSxTQUFhRCxFQUFFSSxFQUFFSixFQUFFQyxDQUFGLENBQUYsQ0FBRixFQUFXQSxDQUFYLENBQWI7QUFBQSxDQUFiIiwiZmlsZSI6ImxlbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcHJvcGVydHkgZnJvbSAncHJvcGVydHktc2Vlayc7XG5cbi8qKlxuICogcGF0aCBwcm92aWRlcyBhIGxlbnMgZm9yIGtleXMgb24gYW5kIE9iamVjdFxuICogQHN1bW1hcnkgc3RyaW5nIOKGkiAgTGVuc1xuICovXG5leHBvcnQgY29uc3QgcGF0aCA9IHMgPT4gKCkgPT4gKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpID9cbiAgICBwcm9wZXJ0eShzLCBhcmd1bWVudHNbMF0pIDogcHJvcGVydHkuc2V0KHMsIGFyZ3VtZW50c1swXSwgYXJndW1lbnRzWzFdKTtcblxuLyoqXG4gKiB2aWV3XG4gKiBAc3VtbWFyeSAoTGVucywgT2JqZWN0KSDihpIgICpcbiAqL1xuZXhwb3J0IGNvbnN0IHZpZXcgPSAobCwgbykgPT4gbChvKTtcblxuLyoqXG4gKiBzZXRcbiAqIEBzdW1tYXJ5IChMZW5zLCAqLCBPYmplY3QpIOKGkiAgKlxuICovXG5leHBvcnQgY29uc3Qgc2V0ID0gKGwsIHYsIG8pID0+IGwodiwgbyk7XG5cbi8qKlxuICogb3ZlclxuICogQHN1bW1hcnkgKExlbnMsIEZ1bmN0b3IsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG92ZXIgPSAobCwgZiwgbykgPT4gbChmKGwobykpLCBvKTtcbiJdfQ==
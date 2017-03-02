'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.mapOver = exports.over = exports.set = exports.view = exports.path = exports.index = exports.TAIL = exports.HEAD = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _propertySeek = require('property-seek');

var _propertySeek2 = _interopRequireDefault(_propertySeek);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HEAD = exports.HEAD = 'haifha;kf';
var TAIL = exports.TAIL = 'agfshshs';

/**
 * index
 */
var index = exports.index = function index(i) {
    return function (value, list) {
        return list === undefined ? value[i === HEAD ? 0 : i === TAIL ? value.length - 1 : i] : replaceIndex(i, list, value);
    };
};

var replaceIndex = function replaceIndex(i, l, v) {

    if (!Array.isArray(l)) throw new TypeError('replaceIndex(): ' + 'Second argument must be an array! ' + ('Got \'' + ((typeof l === 'undefined' ? 'undefined' : _typeof(l)) === 'object' ? l.constructor.name : typeof l === 'undefined' ? 'undefined' : _typeof(l)) + '\''));

    var x = l.slice();

    if (i === TAIL) return l.concat(v);

    if (i === HEAD) return l.slice().reverse().concat(v).reverse();

    if (i > x.length) throw new RangeError('Index ' + i + ' is more than array length ' + l.length);

    x[i] = v;

    return x;
};

/**
 * path
 */
var path = exports.path = function path(p) {
    return function (v, o) {
        return (0, _propertySeek2.default)(p, v, o);
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

var omap = function omap(o, f) {
    return Object.keys(o).map(function (k) {
        return f(o[k], k, o);
    });
};

/**
 * mapOver
 * @summary { (Lens, Functor, Object) →  Object }
 */
var mapOver = exports.mapOver = function mapOver(l, f, o) {

    var list = l(o);

    if (typeof f !== 'function') throw new TypeError('mapOver(): f must be a function!');

    if (!Array.isArray(l(o)) && (typeof list === 'undefined' ? 'undefined' : _typeof(list)) !== 'object' && list !== null) throw new TypeError('mapOver(): Cannot map over \'' + list + '\'!');

    return l(!Array.isArray(list) ? omap(list, f) : list.map(f), o);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9sZW5zLmpzIl0sIm5hbWVzIjpbIkhFQUQiLCJUQUlMIiwiaW5kZXgiLCJ2YWx1ZSIsImxpc3QiLCJ1bmRlZmluZWQiLCJpIiwibGVuZ3RoIiwicmVwbGFjZUluZGV4IiwibCIsInYiLCJBcnJheSIsImlzQXJyYXkiLCJUeXBlRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJ4Iiwic2xpY2UiLCJjb25jYXQiLCJyZXZlcnNlIiwiUmFuZ2VFcnJvciIsInBhdGgiLCJvIiwicCIsInZpZXciLCJzZXQiLCJvdmVyIiwiZiIsIm9tYXAiLCJPYmplY3QiLCJrZXlzIiwibWFwIiwiayIsIm1hcE92ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBOzs7Ozs7QUFFTyxJQUFNQSxzQkFBTyxXQUFiO0FBQ0EsSUFBTUMsc0JBQU8sVUFBYjs7QUFFUDs7O0FBR08sSUFBTUMsd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQUssVUFBQ0MsS0FBRCxFQUFRQyxJQUFSO0FBQUEsZUFBa0JBLFNBQVNDLFNBQVYsR0FDdkNGLE1BQU1HLE1BQU1OLElBQU4sR0FBYSxDQUFiLEdBQWlCTSxNQUFNTCxJQUFOLEdBQWFFLE1BQU1JLE1BQU4sR0FBZSxDQUE1QixHQUFnQ0QsQ0FBdkQsQ0FEdUMsR0FFdkNFLGFBQWFGLENBQWIsRUFBZ0JGLElBQWhCLEVBQXNCRCxLQUF0QixDQUZzQjtBQUFBLEtBQUw7QUFBQSxDQUFkOztBQUlQLElBQU1LLGVBQWUsU0FBZkEsWUFBZSxDQUFDRixDQUFELEVBQUlHLENBQUosRUFBT0MsQ0FBUCxFQUFhOztBQUU5QixRQUFJLENBQUNDLE1BQU1DLE9BQU4sQ0FBY0gsQ0FBZCxDQUFMLEVBQ0ksTUFBTSxJQUFJSSxTQUFKLENBQWMseUVBRVAsUUFBT0osQ0FBUCx5Q0FBT0EsQ0FBUCxPQUFhLFFBQWQsR0FBd0JBLEVBQUVLLFdBQUYsQ0FBY0MsSUFBdEMsVUFBb0ROLENBQXBELHlDQUFvREEsQ0FBcEQsQ0FGUSxTQUFkLENBQU47O0FBSUosUUFBSU8sSUFBSVAsRUFBRVEsS0FBRixFQUFSOztBQUVBLFFBQUlYLE1BQU1MLElBQVYsRUFDSSxPQUFPUSxFQUFFUyxNQUFGLENBQVNSLENBQVQsQ0FBUDs7QUFFSixRQUFJSixNQUFNTixJQUFWLEVBQ0ksT0FBT1MsRUFBRVEsS0FBRixHQUFVRSxPQUFWLEdBQW9CRCxNQUFwQixDQUEyQlIsQ0FBM0IsRUFBOEJTLE9BQTlCLEVBQVA7O0FBRUosUUFBSWIsSUFBSVUsRUFBRVQsTUFBVixFQUNJLE1BQU0sSUFBSWEsVUFBSixZQUF3QmQsQ0FBeEIsbUNBQXVERyxFQUFFRixNQUF6RCxDQUFOOztBQUVKUyxNQUFFVixDQUFGLElBQU9JLENBQVA7O0FBRUEsV0FBT00sQ0FBUDtBQUNILENBckJEOztBQXVCQTs7O0FBR08sSUFBTUssc0JBQU8sU0FBUEEsSUFBTztBQUFBLFdBQUssVUFBQ1gsQ0FBRCxFQUFJWSxDQUFKO0FBQUEsZUFBVSw0QkFBU0MsQ0FBVCxFQUFZYixDQUFaLEVBQWVZLENBQWYsQ0FBVjtBQUFBLEtBQUw7QUFBQSxDQUFiOztBQUVQOzs7O0FBSU8sSUFBTUUsc0JBQU8sU0FBUEEsSUFBTyxDQUFDZixDQUFELEVBQUlhLENBQUo7QUFBQSxXQUFVYixFQUFFYSxDQUFGLENBQVY7QUFBQSxDQUFiOztBQUVQOzs7O0FBSU8sSUFBTUcsb0JBQU0sU0FBTkEsR0FBTSxDQUFDaEIsQ0FBRCxFQUFJQyxDQUFKLEVBQU9ZLENBQVA7QUFBQSxXQUFhYixFQUFFQyxDQUFGLEVBQUtZLENBQUwsQ0FBYjtBQUFBLENBQVo7O0FBRVA7Ozs7QUFJTyxJQUFNSSxzQkFBTyxTQUFQQSxJQUFPLENBQUNqQixDQUFELEVBQUlrQixDQUFKLEVBQU9MLENBQVA7QUFBQSxXQUFhYixFQUFFa0IsRUFBRWxCLEVBQUVhLENBQUYsQ0FBRixDQUFGLEVBQVdBLENBQVgsQ0FBYjtBQUFBLENBQWI7O0FBRVAsSUFBTU0sT0FBTyxTQUFQQSxJQUFPLENBQUNOLENBQUQsRUFBSUssQ0FBSjtBQUFBLFdBQVVFLE9BQU9DLElBQVAsQ0FBWVIsQ0FBWixFQUFlUyxHQUFmLENBQW1CO0FBQUEsZUFBS0osRUFBRUwsRUFBRVUsQ0FBRixDQUFGLEVBQVFBLENBQVIsRUFBV1YsQ0FBWCxDQUFMO0FBQUEsS0FBbkIsQ0FBVjtBQUFBLENBQWI7O0FBRUE7Ozs7QUFJTyxJQUFNVyw0QkFBVSxTQUFWQSxPQUFVLENBQUN4QixDQUFELEVBQUlrQixDQUFKLEVBQU9MLENBQVAsRUFBYTs7QUFFaEMsUUFBSWxCLE9BQU9LLEVBQUVhLENBQUYsQ0FBWDs7QUFFQSxRQUFJLE9BQU9LLENBQVAsS0FBYSxVQUFqQixFQUNJLE1BQU0sSUFBSWQsU0FBSixDQUFjLGtDQUFkLENBQU47O0FBRUosUUFBSyxDQUFDRixNQUFNQyxPQUFOLENBQWNILEVBQUVhLENBQUYsQ0FBZCxDQUFGLElBQTJCLFFBQU9sQixJQUFQLHlDQUFPQSxJQUFQLE9BQWdCLFFBQTNDLElBQXlEQSxTQUFTLElBQXRFLEVBQ0ksTUFBTSxJQUFJUyxTQUFKLG1DQUE2Q1QsSUFBN0MsU0FBTjs7QUFFSixXQUFPSyxFQUFFLENBQUNFLE1BQU1DLE9BQU4sQ0FBY1IsSUFBZCxDQUFELEdBQXVCd0IsS0FBS3hCLElBQUwsRUFBV3VCLENBQVgsQ0FBdkIsR0FBdUN2QixLQUFLMkIsR0FBTCxDQUFTSixDQUFULENBQXpDLEVBQXNETCxDQUF0RCxDQUFQO0FBRUgsQ0FaTSIsImZpbGUiOiJsZW5zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHByb3BlcnR5IGZyb20gJ3Byb3BlcnR5LXNlZWsnO1xuXG5leHBvcnQgY29uc3QgSEVBRCA9ICdoYWlmaGE7a2YnO1xuZXhwb3J0IGNvbnN0IFRBSUwgPSAnYWdmc2hzaHMnO1xuXG4vKipcbiAqIGluZGV4XG4gKi9cbmV4cG9ydCBjb25zdCBpbmRleCA9IGkgPT4gKHZhbHVlLCBsaXN0KSA9PiAobGlzdCA9PT0gdW5kZWZpbmVkKSA/XG4gICAgdmFsdWVbaSA9PT0gSEVBRCA/IDAgOiBpID09PSBUQUlMID8gdmFsdWUubGVuZ3RoIC0gMSA6IGldIDpcbiAgICByZXBsYWNlSW5kZXgoaSwgbGlzdCwgdmFsdWUpO1xuXG5jb25zdCByZXBsYWNlSW5kZXggPSAoaSwgbCwgdikgPT4ge1xuXG4gICAgaWYgKCFBcnJheS5pc0FycmF5KGwpKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGByZXBsYWNlSW5kZXgoKTogYCArXG4gICAgICAgICAgICBgU2Vjb25kIGFyZ3VtZW50IG11c3QgYmUgYW4gYXJyYXkhIGAgK1xuICAgICAgICAgICAgYEdvdCAnJHsodHlwZW9mIGwgPT09ICdvYmplY3QnKT9sLmNvbnN0cnVjdG9yLm5hbWUgOiB0eXBlb2YgbH0nYCk7XG5cbiAgICBsZXQgeCA9IGwuc2xpY2UoKTtcblxuICAgIGlmIChpID09PSBUQUlMKVxuICAgICAgICByZXR1cm4gbC5jb25jYXQodik7XG5cbiAgICBpZiAoaSA9PT0gSEVBRClcbiAgICAgICAgcmV0dXJuIGwuc2xpY2UoKS5yZXZlcnNlKCkuY29uY2F0KHYpLnJldmVyc2UoKTtcblxuICAgIGlmIChpID4geC5sZW5ndGgpXG4gICAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKGBJbmRleCAke2l9IGlzIG1vcmUgdGhhbiBhcnJheSBsZW5ndGggJHtsLmxlbmd0aH1gKTtcblxuICAgIHhbaV0gPSB2O1xuXG4gICAgcmV0dXJuIHg7XG59XG5cbi8qKlxuICogcGF0aFxuICovXG5leHBvcnQgY29uc3QgcGF0aCA9IHAgPT4gKHYsIG8pID0+IHByb3BlcnR5KHAsIHYsIG8pO1xuXG4vKipcbiAqIHZpZXdcbiAqIEBzdW1tYXJ5IChMZW5zLCBPYmplY3QpIOKGkiAgKlxuICovXG5leHBvcnQgY29uc3QgdmlldyA9IChsLCBvKSA9PiBsKG8pO1xuXG4vKipcbiAqIHNldFxuICogQHN1bW1hcnkgKExlbnMsICosIE9iamVjdCkg4oaSICAqXG4gKi9cbmV4cG9ydCBjb25zdCBzZXQgPSAobCwgdiwgbykgPT4gbCh2LCBvKTtcblxuLyoqXG4gKiBvdmVyXG4gKiBAc3VtbWFyeSAoTGVucywgRnVuY3RvciwgT2JqZWN0KSDihpIgIE9iamVjdFxuICovXG5leHBvcnQgY29uc3Qgb3ZlciA9IChsLCBmLCBvKSA9PiBsKGYobChvKSksIG8pO1xuXG5jb25zdCBvbWFwID0gKG8sIGYpID0+IE9iamVjdC5rZXlzKG8pLm1hcChrID0+IGYob1trXSwgaywgbykpO1xuXG4vKipcbiAqIG1hcE92ZXJcbiAqIEBzdW1tYXJ5IHsgKExlbnMsIEZ1bmN0b3IsIE9iamVjdCkg4oaSICBPYmplY3QgfVxuICovXG5leHBvcnQgY29uc3QgbWFwT3ZlciA9IChsLCBmLCBvKSA9PiB7XG5cbiAgICBsZXQgbGlzdCA9IGwobyk7XG5cbiAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ21hcE92ZXIoKTogZiBtdXN0IGJlIGEgZnVuY3Rpb24hJyk7XG5cbiAgICBpZiAoKCFBcnJheS5pc0FycmF5KGwobykpKSAmJiAodHlwZW9mIGxpc3QgIT09ICdvYmplY3QnKSAmJiAobGlzdCAhPT0gbnVsbCkpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYG1hcE92ZXIoKTogQ2Fubm90IG1hcCBvdmVyICcke2xpc3R9JyFgKTtcblxuICAgIHJldHVybiBsKCFBcnJheS5pc0FycmF5KGxpc3QpID8gb21hcChsaXN0LCBmKSA6IGxpc3QubWFwKGYpLCBvKTtcblxufTtcbiJdfQ==
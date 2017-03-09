'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * merge two objects easily
 * @summary (Object, Object) →  Object
 */
var merge = exports.merge = function merge(o1, o2) {
  return Object.assign({}, o1, o2);
};

/**
 * oreduce
 * @summary { (Object, (*,string,Object)→ *, * ) →  *}
 */
var oreduce = exports.oreduce = function oreduce(o, f, i) {
  return Object.keys(o).reduce(function (p, k) {
    return f(p, o[k], o);
  }, i);
};

/**
 * pipe the results of one function into the following.
 * @summary { (... * →  *) →  * →  *}
 */
var pipe = exports.pipe = function pipe() {

  var i = arguments.length;
  var args = [];

  while (i--) {
    args[i] = arguments[i];
  }return function (x) {
    return args.reduce(function (v, n) {
      return n(v);
    }, x);
  };
};

/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
var fling = exports.fling = function fling(s, o) {

  if (o == null || o.constructor !== Object) throw new TypeError('fling(): only works with object literals!');

  return Object.keys(o).reduce(function (o2, k) {
    return k === s ? o2 : merge(o2, _defineProperty({}, k, o[k]));
  }, {});
};

/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
var head = exports.head = function head(list) {
  return list[0];
};

/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
var tail = exports.tail = function tail(list) {
  return list[list.length - 1];
};

/**
 * partial is a poor man's way of turning a function of arity 1-4 into
 * a function that accepts one argumment. Recognizes a Function.length of 4 max
 * @summary {(Function, *) →  (* →  *)}
 */
var partial = exports.partial = function partial(f, a) {
  return f.length === 2 ? function (b) {
    return f(a, b);
  } : f.length === 3 ? function (b) {
    return function (c) {
      return f(a, b, c);
    };
  } : f.length === 4 ? function (b) {
    return function (c) {
      return function (d) {
        return f(a, b, c, d);
      };
    };
  } : f;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbIm1lcmdlIiwibzEiLCJvMiIsIk9iamVjdCIsImFzc2lnbiIsIm9yZWR1Y2UiLCJvIiwiZiIsImkiLCJrZXlzIiwicmVkdWNlIiwicCIsImsiLCJwaXBlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiYXJncyIsInYiLCJuIiwieCIsImZsaW5nIiwicyIsImNvbnN0cnVjdG9yIiwiVHlwZUVycm9yIiwiaGVhZCIsImxpc3QiLCJ0YWlsIiwicGFydGlhbCIsImEiLCJiIiwiYyIsImQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFJTyxJQUFNQSx3QkFBUSxTQUFSQSxLQUFRLENBQUNDLEVBQUQsRUFBS0MsRUFBTDtBQUFBLFNBQVlDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxFQUFsQixFQUFzQkMsRUFBdEIsQ0FBWjtBQUFBLENBQWQ7O0FBRVA7Ozs7QUFJTyxJQUFNRyw0QkFBVSxTQUFWQSxPQUFVLENBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQUEsU0FBYUwsT0FBT00sSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQWYsQ0FBc0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUwsRUFBRUksQ0FBRixFQUFLTCxFQUFFTSxDQUFGLENBQUwsRUFBV04sQ0FBWCxDQUFWO0FBQUEsR0FBdEIsRUFBK0NFLENBQS9DLENBQWI7QUFBQSxDQUFoQjs7QUFFUDs7OztBQUlPLElBQU1LLHNCQUFPLFNBQVBBLElBQU8sR0FBVzs7QUFFM0IsTUFBSUwsSUFBSU0sVUFBVUMsTUFBbEI7QUFDQSxNQUFJQyxPQUFPLEVBQVg7O0FBRUEsU0FBT1IsR0FBUDtBQUFZUSxTQUFLUixDQUFMLElBQVVNLFVBQVVOLENBQVYsQ0FBVjtBQUFaLEdBQ0EsT0FBTztBQUFBLFdBQUtRLEtBQUtOLE1BQUwsQ0FBWSxVQUFDTyxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFVQSxFQUFFRCxDQUFGLENBQVY7QUFBQSxLQUFaLEVBQTRCRSxDQUE1QixDQUFMO0FBQUEsR0FBUDtBQUVILENBUk07O0FBVVA7Ozs7Ozs7QUFPTyxJQUFNQyx3QkFBUSxTQUFSQSxLQUFRLENBQUNDLENBQUQsRUFBSWYsQ0FBSixFQUFVOztBQUUzQixNQUFLQSxLQUFLLElBQU4sSUFBZ0JBLEVBQUVnQixXQUFGLEtBQWtCbkIsTUFBdEMsRUFDSSxNQUFNLElBQUlvQixTQUFKLENBQWMsMkNBQWQsQ0FBTjs7QUFFSixTQUFPcEIsT0FBT00sSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQWYsQ0FBc0IsVUFBQ1IsRUFBRCxFQUFLVSxDQUFMO0FBQUEsV0FBV0EsTUFBTVMsQ0FBTixHQUFVbkIsRUFBVixHQUFlRixNQUFNRSxFQUFOLHNCQUNsRFUsQ0FEa0QsRUFDOUNOLEVBQUVNLENBQUYsQ0FEOEMsRUFBMUI7QUFBQSxHQUF0QixFQUVILEVBRkcsQ0FBUDtBQUlILENBVE07O0FBV1A7Ozs7OztBQU1PLElBQU1ZLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFRQyxLQUFLLENBQUwsQ0FBUjtBQUFBLENBQWI7O0FBRVA7Ozs7OztBQU1PLElBQU1DLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFRRCxLQUFLQSxLQUFLVixNQUFMLEdBQWMsQ0FBbkIsQ0FBUjtBQUFBLENBQWI7O0FBRVA7Ozs7O0FBS08sSUFBTVksNEJBQVUsU0FBVkEsT0FBVSxDQUFDcEIsQ0FBRCxFQUFJcUIsQ0FBSjtBQUFBLFNBQ25CckIsRUFBRVEsTUFBRixLQUFhLENBQWIsR0FBaUI7QUFBQSxXQUFLUixFQUFFcUIsQ0FBRixFQUFLQyxDQUFMLENBQUw7QUFBQSxHQUFqQixHQUNBdEIsRUFBRVEsTUFBRixLQUFhLENBQWIsR0FBaUI7QUFBQSxXQUFLO0FBQUEsYUFBS1IsRUFBRXFCLENBQUYsRUFBS0MsQ0FBTCxFQUFRQyxDQUFSLENBQUw7QUFBQSxLQUFMO0FBQUEsR0FBakIsR0FDQXZCLEVBQUVRLE1BQUYsS0FBYSxDQUFiLEdBQWlCO0FBQUEsV0FBSztBQUFBLGFBQUs7QUFBQSxlQUFLUixFQUFFcUIsQ0FBRixFQUFLQyxDQUFMLEVBQVFDLENBQVIsRUFBV0MsQ0FBWCxDQUFMO0FBQUEsT0FBTDtBQUFBLEtBQUw7QUFBQSxHQUFqQixHQUNBeEIsQ0FKbUI7QUFBQSxDQUFoQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBtZXJnZSB0d28gb2JqZWN0cyBlYXNpbHlcbiAqIEBzdW1tYXJ5IChPYmplY3QsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gKG8xLCBvMikgPT4gT2JqZWN0LmFzc2lnbih7fSwgbzEsIG8yKTtcblxuLyoqXG4gKiBvcmVkdWNlXG4gKiBAc3VtbWFyeSB7IChPYmplY3QsICgqLHN0cmluZyxPYmplY3Qp4oaSICosICogKSDihpIgICp9XG4gKi9cbmV4cG9ydCBjb25zdCBvcmVkdWNlID0gKG8sIGYsIGkpID0+IE9iamVjdC5rZXlzKG8pLnJlZHVjZSgocCwgaykgPT4gZihwLCBvW2tdLCBvKSwgaSk7XG5cbi8qKlxuICogcGlwZSB0aGUgcmVzdWx0cyBvZiBvbmUgZnVuY3Rpb24gaW50byB0aGUgZm9sbG93aW5nLlxuICogQHN1bW1hcnkgeyAoLi4uICog4oaSICAqKSDihpIgICog4oaSICAqfVxuICovXG5leHBvcnQgY29uc3QgcGlwZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGkgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGxldCBhcmdzID0gW107XG5cbiAgICB3aGlsZSAoaS0tKSBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIHJldHVybiB4ID0+IGFyZ3MucmVkdWNlKCh2LCBuKSA9PiBuKHYpLCB4KTtcblxufVxuXG4vKipcbiAqIGZsaW5nIHJlbW92ZXMgYSBrZXkgZnJvbSBhbiBvYmplY3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXlcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqIEBzdW1tYXJ5IHsoc3RyaW5nLE9iamVjdCkg4oaSICBPYmplY3R9XG4gKi9cbmV4cG9ydCBjb25zdCBmbGluZyA9IChzLCBvKSA9PiB7XG5cbiAgICBpZiAoKG8gPT0gbnVsbCkgfHwgKG8uY29uc3RydWN0b3IgIT09IE9iamVjdCkpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2ZsaW5nKCk6IG9ubHkgd29ya3Mgd2l0aCBvYmplY3QgbGl0ZXJhbHMhJyk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmtleXMobykucmVkdWNlKChvMiwgaykgPT4gayA9PT0gcyA/IG8yIDogbWVyZ2UobzIsIHtcbiAgICAgICAgW2tdOiBvW2tdXG4gICAgfSksIHt9KTtcblxufVxuXG4vKipcbiAqIGhlYWQgcmV0dXJucyB0aGUgaXRlbSBhdCBpbmRleCAwIG9mIGFuIGFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQHN1bW1hcnkgeyBBcnJheSDihpIgICogfVxuICovXG5leHBvcnQgY29uc3QgaGVhZCA9IGxpc3QgPT4gbGlzdFswXTtcblxuLyoqXG4gKiB0YWlsIHJldHVybnMgdGhlIGxhc3QgaXRlbSBpbiBhbiBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gbGlzdFxuICogQHJldHVybiB7Kn1cbiAqIEBzdW1tYXJ5IHtBcnJheSDihpIgICp9XG4gKi9cbmV4cG9ydCBjb25zdCB0YWlsID0gbGlzdCA9PiBsaXN0W2xpc3QubGVuZ3RoIC0gMV07XG5cbi8qKlxuICogcGFydGlhbCBpcyBhIHBvb3IgbWFuJ3Mgd2F5IG9mIHR1cm5pbmcgYSBmdW5jdGlvbiBvZiBhcml0eSAxLTQgaW50b1xuICogYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgb25lIGFyZ3VtbWVudC4gUmVjb2duaXplcyBhIEZ1bmN0aW9uLmxlbmd0aCBvZiA0IG1heFxuICogQHN1bW1hcnkgeyhGdW5jdGlvbiwgKikg4oaSICAoKiDihpIgICopfVxuICovXG5leHBvcnQgY29uc3QgcGFydGlhbCA9IChmLCBhKSA9PlxuICAgIGYubGVuZ3RoID09PSAyID8gYiA9PiBmKGEsIGIpIDpcbiAgICBmLmxlbmd0aCA9PT0gMyA/IGIgPT4gYyA9PiBmKGEsIGIsIGMpIDpcbiAgICBmLmxlbmd0aCA9PT0gNCA/IGIgPT4gYyA9PiBkID0+IGYoYSwgYiwgYywgZCkgOlxuICAgIGY7XG4iXX0=
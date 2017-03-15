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
 * compose two functions into one.
 * @summary compose :: (* →  *, * →  *) →  *
 */
var compose = exports.compose = function compose(f, g) {
  return function (x) {
    return f(g(x));
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
 * partial is a poor man's way of turning a function of arity 1-3 into
 * a function that accepts one argumment. Recognizes a Function.length of 3 max
 * @summary {(Function, *) →  (* →  *)}
 */
var partial = exports.partial = function partial(f, a) {
  return f.length === 2 ? function (b) {
    return f(a, b);
  } : f.length === 3 ? function (b, c) {
    return f(a, b, c);
  } : f.length === 4 ? function (b, c, d) {
    return f(a, b, c, d);
  } : function () {
    throw new RangeError('Arity ' + f.length + ' > 4');
  }();
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbIm1lcmdlIiwibzEiLCJvMiIsIk9iamVjdCIsImFzc2lnbiIsIm9yZWR1Y2UiLCJvIiwiZiIsImkiLCJrZXlzIiwicmVkdWNlIiwicCIsImsiLCJwaXBlIiwiYXJndW1lbnRzIiwibGVuZ3RoIiwiYXJncyIsInYiLCJuIiwieCIsImNvbXBvc2UiLCJnIiwiZmxpbmciLCJzIiwiY29uc3RydWN0b3IiLCJUeXBlRXJyb3IiLCJoZWFkIiwibGlzdCIsInRhaWwiLCJwYXJ0aWFsIiwiYSIsImIiLCJjIiwiZCIsIlJhbmdlRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7Ozs7QUFJTyxJQUFNQSx3QkFBUSxTQUFSQSxLQUFRLENBQUNDLEVBQUQsRUFBS0MsRUFBTDtBQUFBLFNBQVlDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxFQUFsQixFQUFzQkMsRUFBdEIsQ0FBWjtBQUFBLENBQWQ7O0FBRVA7Ozs7QUFJTyxJQUFNRyw0QkFBVSxTQUFWQSxPQUFVLENBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQUEsU0FBYUwsT0FBT00sSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQWYsQ0FBc0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUwsRUFBRUksQ0FBRixFQUFLTCxFQUFFTSxDQUFGLENBQUwsRUFBV04sQ0FBWCxDQUFWO0FBQUEsR0FBdEIsRUFBK0NFLENBQS9DLENBQWI7QUFBQSxDQUFoQjs7QUFFUDs7OztBQUlPLElBQU1LLHNCQUFPLFNBQVBBLElBQU8sR0FBVzs7QUFFM0IsTUFBSUwsSUFBSU0sVUFBVUMsTUFBbEI7QUFDQSxNQUFJQyxPQUFPLEVBQVg7O0FBRUEsU0FBT1IsR0FBUDtBQUFZUSxTQUFLUixDQUFMLElBQVVNLFVBQVVOLENBQVYsQ0FBVjtBQUFaLEdBQ0EsT0FBTztBQUFBLFdBQUtRLEtBQUtOLE1BQUwsQ0FBWSxVQUFDTyxDQUFELEVBQUlDLENBQUo7QUFBQSxhQUFVQSxFQUFFRCxDQUFGLENBQVY7QUFBQSxLQUFaLEVBQTRCRSxDQUE1QixDQUFMO0FBQUEsR0FBUDtBQUVILENBUk07O0FBVVA7Ozs7QUFJTyxJQUFNQyw0QkFBVSxTQUFWQSxPQUFVLENBQUNiLENBQUQsRUFBSWMsQ0FBSjtBQUFBLFNBQVU7QUFBQSxXQUFLZCxFQUFFYyxFQUFFRixDQUFGLENBQUYsQ0FBTDtBQUFBLEdBQVY7QUFBQSxDQUFoQjs7QUFFUDs7Ozs7OztBQU9PLElBQU1HLHdCQUFRLFNBQVJBLEtBQVEsQ0FBQ0MsQ0FBRCxFQUFJakIsQ0FBSixFQUFVOztBQUUzQixNQUFLQSxLQUFLLElBQU4sSUFBZ0JBLEVBQUVrQixXQUFGLEtBQWtCckIsTUFBdEMsRUFDSSxNQUFNLElBQUlzQixTQUFKLENBQWMsMkNBQWQsQ0FBTjs7QUFFSixTQUFPdEIsT0FBT00sSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQWYsQ0FBc0IsVUFBQ1IsRUFBRCxFQUFLVSxDQUFMO0FBQUEsV0FBV0EsTUFBTVcsQ0FBTixHQUFVckIsRUFBVixHQUFlRixNQUFNRSxFQUFOLHNCQUNsRFUsQ0FEa0QsRUFDOUNOLEVBQUVNLENBQUYsQ0FEOEMsRUFBMUI7QUFBQSxHQUF0QixFQUVILEVBRkcsQ0FBUDtBQUlILENBVE07O0FBV1A7Ozs7OztBQU1PLElBQU1jLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFRQyxLQUFLLENBQUwsQ0FBUjtBQUFBLENBQWI7O0FBRVA7Ozs7OztBQU1PLElBQU1DLHNCQUFPLFNBQVBBLElBQU87QUFBQSxTQUFRRCxLQUFLQSxLQUFLWixNQUFMLEdBQWMsQ0FBbkIsQ0FBUjtBQUFBLENBQWI7O0FBRVA7Ozs7O0FBS08sSUFBTWMsNEJBQVUsU0FBVkEsT0FBVSxDQUFDdEIsQ0FBRCxFQUFJdUIsQ0FBSjtBQUFBLFNBQ25CdkIsRUFBRVEsTUFBRixLQUFhLENBQWIsR0FBaUI7QUFBQSxXQUFLUixFQUFFdUIsQ0FBRixFQUFLQyxDQUFMLENBQUw7QUFBQSxHQUFqQixHQUNBeEIsRUFBRVEsTUFBRixLQUFhLENBQWIsR0FBaUIsVUFBQ2dCLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVV6QixFQUFFdUIsQ0FBRixFQUFLQyxDQUFMLEVBQVFDLENBQVIsQ0FBVjtBQUFBLEdBQWpCLEdBQ0F6QixFQUFFUSxNQUFGLEtBQWEsQ0FBYixHQUFpQixVQUFDZ0IsQ0FBRCxFQUFJQyxDQUFKLEVBQU9DLENBQVA7QUFBQSxXQUFhMUIsRUFBRXVCLENBQUYsRUFBS0MsQ0FBTCxFQUFRQyxDQUFSLEVBQVdDLENBQVgsQ0FBYjtBQUFBLEdBQWpCLEdBQ0MsWUFBTTtBQUFFLFVBQU0sSUFBSUMsVUFBSixZQUF3QjNCLEVBQUVRLE1BQTFCLFVBQU47QUFBK0MsR0FBeEQsRUFKbUI7QUFBQSxDQUFoQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBtZXJnZSB0d28gb2JqZWN0cyBlYXNpbHlcbiAqIEBzdW1tYXJ5IChPYmplY3QsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gKG8xLCBvMikgPT4gT2JqZWN0LmFzc2lnbih7fSwgbzEsIG8yKTtcblxuLyoqXG4gKiBvcmVkdWNlXG4gKiBAc3VtbWFyeSB7IChPYmplY3QsICgqLHN0cmluZyxPYmplY3Qp4oaSICosICogKSDihpIgICp9XG4gKi9cbmV4cG9ydCBjb25zdCBvcmVkdWNlID0gKG8sIGYsIGkpID0+IE9iamVjdC5rZXlzKG8pLnJlZHVjZSgocCwgaykgPT4gZihwLCBvW2tdLCBvKSwgaSk7XG5cbi8qKlxuICogcGlwZSB0aGUgcmVzdWx0cyBvZiBvbmUgZnVuY3Rpb24gaW50byB0aGUgZm9sbG93aW5nLlxuICogQHN1bW1hcnkgeyAoLi4uICog4oaSICAqKSDihpIgICog4oaSICAqfVxuICovXG5leHBvcnQgY29uc3QgcGlwZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGkgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGxldCBhcmdzID0gW107XG5cbiAgICB3aGlsZSAoaS0tKSBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIHJldHVybiB4ID0+IGFyZ3MucmVkdWNlKCh2LCBuKSA9PiBuKHYpLCB4KTtcblxufVxuXG4vKipcbiAqIGNvbXBvc2UgdHdvIGZ1bmN0aW9ucyBpbnRvIG9uZS5cbiAqIEBzdW1tYXJ5IGNvbXBvc2UgOjogKCog4oaSICAqLCAqIOKGkiAgKikg4oaSICAqXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKGYsIGcpID0+IHggPT4gZihnKHgpKTtcblxuLyoqXG4gKiBmbGluZyByZW1vdmVzIGEga2V5IGZyb20gYW4gb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAc3VtbWFyeSB7KHN0cmluZyxPYmplY3QpIOKGkiAgT2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZmxpbmcgPSAocywgbykgPT4ge1xuXG4gICAgaWYgKChvID09IG51bGwpIHx8IChvLmNvbnN0cnVjdG9yICE9PSBPYmplY3QpKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmbGluZygpOiBvbmx5IHdvcmtzIHdpdGggb2JqZWN0IGxpdGVyYWxzIScpO1xuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLnJlZHVjZSgobzIsIGspID0+IGsgPT09IHMgPyBvMiA6IG1lcmdlKG8yLCB7XG4gICAgICAgIFtrXTogb1trXVxuICAgIH0pLCB7fSk7XG5cbn1cblxuLyoqXG4gKiBoZWFkIHJldHVybnMgdGhlIGl0ZW0gYXQgaW5kZXggMCBvZiBhbiBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gbGlzdFxuICogQHJldHVybiB7Kn1cbiAqIEBzdW1tYXJ5IHsgQXJyYXkg4oaSICAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IGhlYWQgPSBsaXN0ID0+IGxpc3RbMF07XG5cbi8qKlxuICogdGFpbCByZXR1cm5zIHRoZSBsYXN0IGl0ZW0gaW4gYW4gYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAc3VtbWFyeSB7QXJyYXkg4oaSICAqfVxuICovXG5leHBvcnQgY29uc3QgdGFpbCA9IGxpc3QgPT4gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuXG4vKipcbiAqIHBhcnRpYWwgaXMgYSBwb29yIG1hbidzIHdheSBvZiB0dXJuaW5nIGEgZnVuY3Rpb24gb2YgYXJpdHkgMS0zIGludG9cbiAqIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIG9uZSBhcmd1bW1lbnQuIFJlY29nbml6ZXMgYSBGdW5jdGlvbi5sZW5ndGggb2YgMyBtYXhcbiAqIEBzdW1tYXJ5IHsoRnVuY3Rpb24sICopIOKGkiAgKCog4oaSICAqKX1cbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnRpYWwgPSAoZiwgYSkgPT5cbiAgICBmLmxlbmd0aCA9PT0gMiA/IGIgPT4gZihhLCBiKSA6XG4gICAgZi5sZW5ndGggPT09IDMgPyAoYiwgYykgPT4gZihhLCBiLCBjKSA6XG4gICAgZi5sZW5ndGggPT09IDQgPyAoYiwgYywgZCkgPT4gZihhLCBiLCBjLCBkKSA6XG4gICAgKCgpID0+IHsgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYEFyaXR5ICR7Zi5sZW5ndGh9ID4gNGApIH0pKCk7XG4iXX0=
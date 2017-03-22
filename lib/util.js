'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var isFunction = exports.isFunction = function isFunction(f) {

  if (typeof f !== 'function') throw new TypeError('Expected function got ' + ('(' + (typeof f === 'undefined' ? 'undefined' : _typeof(f)) + ') \'' + (f ? f.constructor ? f.constructor.name : f : f) + '\''));

  return f;
};

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
  return f.length === 1 ? function () {
    return f(a);
  } : f.length === 2 ? function (b) {
    return f(a, b);
  } : f.length === 3 ? function (b, c) {
    return f(a, b, c);
  } : f.length === 4 ? function (b, c, d) {
    return f(a, b, c, d);
  } : function () {
    throw new RangeError('Function ' + f + ' has an arity of ' + f.length + ' (> 4)');
  }();
};

/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
var constant = exports.constant = function constant(x) {
  return function () {
    return x;
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbImlzRnVuY3Rpb24iLCJmIiwiVHlwZUVycm9yIiwiY29uc3RydWN0b3IiLCJuYW1lIiwibWVyZ2UiLCJvMSIsIm8yIiwiT2JqZWN0IiwiYXNzaWduIiwib3JlZHVjZSIsIm8iLCJpIiwia2V5cyIsInJlZHVjZSIsInAiLCJrIiwicGlwZSIsImFyZ3VtZW50cyIsImxlbmd0aCIsImFyZ3MiLCJ2IiwibiIsIngiLCJjb21wb3NlIiwiZyIsImZsaW5nIiwicyIsImhlYWQiLCJsaXN0IiwidGFpbCIsInBhcnRpYWwiLCJhIiwiYiIsImMiLCJkIiwiUmFuZ2VFcnJvciIsImNvbnN0YW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQU8sSUFBTUEsa0NBQWEsU0FBYkEsVUFBYSxJQUFLOztBQUUzQixNQUFJLE9BQU9DLENBQVAsS0FBYSxVQUFqQixFQUNJLE1BQU0sSUFBSUMsU0FBSixDQUFjLDBDQUNMRCxDQURLLHlDQUNMQSxDQURLLGVBQ0VBLElBQUVBLEVBQUVFLFdBQUYsR0FBY0YsRUFBRUUsV0FBRixDQUFjQyxJQUE1QixHQUFpQ0gsQ0FBbkMsR0FBcUNBLENBRHZDLFNBQWQsQ0FBTjs7QUFJSixTQUFPQSxDQUFQO0FBRUgsQ0FUTTs7QUFXUDs7OztBQUlPLElBQU1JLHdCQUFRLFNBQVJBLEtBQVEsQ0FBQ0MsRUFBRCxFQUFLQyxFQUFMO0FBQUEsU0FBWUMsT0FBT0MsTUFBUCxDQUFjLEVBQWQsRUFBa0JILEVBQWxCLEVBQXNCQyxFQUF0QixDQUFaO0FBQUEsQ0FBZDs7QUFFUDs7OztBQUlPLElBQU1HLDRCQUFVLFNBQVZBLE9BQVUsQ0FBQ0MsQ0FBRCxFQUFJVixDQUFKLEVBQU9XLENBQVA7QUFBQSxTQUFhSixPQUFPSyxJQUFQLENBQVlGLENBQVosRUFBZUcsTUFBZixDQUFzQixVQUFDQyxDQUFELEVBQUlDLENBQUo7QUFBQSxXQUFVZixFQUFFYyxDQUFGLEVBQUtKLEVBQUVLLENBQUYsQ0FBTCxFQUFXTCxDQUFYLENBQVY7QUFBQSxHQUF0QixFQUErQ0MsQ0FBL0MsQ0FBYjtBQUFBLENBQWhCOztBQUVQOzs7O0FBSU8sSUFBTUssc0JBQU8sU0FBUEEsSUFBTyxHQUFXOztBQUUzQixNQUFJTCxJQUFJTSxVQUFVQyxNQUFsQjtBQUNBLE1BQUlDLE9BQU8sRUFBWDs7QUFFQSxTQUFPUixHQUFQO0FBQVlRLFNBQUtSLENBQUwsSUFBVU0sVUFBVU4sQ0FBVixDQUFWO0FBQVosR0FDQSxPQUFPO0FBQUEsV0FBS1EsS0FBS04sTUFBTCxDQUFZLFVBQUNPLENBQUQsRUFBSUMsQ0FBSjtBQUFBLGFBQVVBLEVBQUVELENBQUYsQ0FBVjtBQUFBLEtBQVosRUFBNEJFLENBQTVCLENBQUw7QUFBQSxHQUFQO0FBRUgsQ0FSTTs7QUFVUDs7OztBQUlPLElBQU1DLDRCQUFVLFNBQVZBLE9BQVUsQ0FBQ3ZCLENBQUQsRUFBSXdCLENBQUo7QUFBQSxTQUFVO0FBQUEsV0FBS3hCLEVBQUV3QixFQUFFRixDQUFGLENBQUYsQ0FBTDtBQUFBLEdBQVY7QUFBQSxDQUFoQjs7QUFFUDs7Ozs7OztBQU9PLElBQU1HLHdCQUFRLFNBQVJBLEtBQVEsQ0FBQ0MsQ0FBRCxFQUFJaEIsQ0FBSixFQUFVOztBQUUzQixNQUFLQSxLQUFLLElBQU4sSUFBZ0JBLEVBQUVSLFdBQUYsS0FBa0JLLE1BQXRDLEVBQ0ksTUFBTSxJQUFJTixTQUFKLENBQWMsMkNBQWQsQ0FBTjs7QUFFSixTQUFPTSxPQUFPSyxJQUFQLENBQVlGLENBQVosRUFBZUcsTUFBZixDQUFzQixVQUFDUCxFQUFELEVBQUtTLENBQUw7QUFBQSxXQUFXQSxNQUFNVyxDQUFOLEdBQVVwQixFQUFWLEdBQWVGLE1BQU1FLEVBQU4sc0JBQ2xEUyxDQURrRCxFQUM5Q0wsRUFBRUssQ0FBRixDQUQ4QyxFQUExQjtBQUFBLEdBQXRCLEVBRUgsRUFGRyxDQUFQO0FBSUgsQ0FUTTs7QUFXUDs7Ozs7O0FBTU8sSUFBTVksc0JBQU8sU0FBUEEsSUFBTztBQUFBLFNBQVFDLEtBQUssQ0FBTCxDQUFSO0FBQUEsQ0FBYjs7QUFFUDs7Ozs7O0FBTU8sSUFBTUMsc0JBQU8sU0FBUEEsSUFBTztBQUFBLFNBQVFELEtBQUtBLEtBQUtWLE1BQUwsR0FBYyxDQUFuQixDQUFSO0FBQUEsQ0FBYjs7QUFFUDs7Ozs7QUFLTyxJQUFNWSw0QkFBVSxTQUFWQSxPQUFVLENBQUM5QixDQUFELEVBQUkrQixDQUFKO0FBQUEsU0FDbkIvQixFQUFFa0IsTUFBRixLQUFhLENBQWIsR0FBaUI7QUFBQSxXQUFNbEIsRUFBRStCLENBQUYsQ0FBTjtBQUFBLEdBQWpCLEdBQ0EvQixFQUFFa0IsTUFBRixLQUFhLENBQWIsR0FBaUI7QUFBQSxXQUFLbEIsRUFBRStCLENBQUYsRUFBS0MsQ0FBTCxDQUFMO0FBQUEsR0FBakIsR0FDQWhDLEVBQUVrQixNQUFGLEtBQWEsQ0FBYixHQUFpQixVQUFDYyxDQUFELEVBQUlDLENBQUo7QUFBQSxXQUFVakMsRUFBRStCLENBQUYsRUFBS0MsQ0FBTCxFQUFRQyxDQUFSLENBQVY7QUFBQSxHQUFqQixHQUNBakMsRUFBRWtCLE1BQUYsS0FBYSxDQUFiLEdBQWlCLFVBQUNjLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQUEsV0FBYWxDLEVBQUUrQixDQUFGLEVBQUtDLENBQUwsRUFBUUMsQ0FBUixFQUFXQyxDQUFYLENBQWI7QUFBQSxHQUFqQixHQUNDLFlBQU07QUFBRSxVQUFNLElBQUlDLFVBQUosZUFBMkJuQyxDQUEzQix5QkFBZ0RBLEVBQUVrQixNQUFsRCxZQUFOO0FBQXlFLEdBQWxGLEVBTG1CO0FBQUEsQ0FBaEI7O0FBT1A7Ozs7O0FBS08sSUFBTWtCLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFLO0FBQUEsV0FBSWQsQ0FBSjtBQUFBLEdBQUw7QUFBQSxDQUFqQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGlzRnVuY3Rpb24gPSBmID0+IHtcblxuICAgIGlmICh0eXBlb2YgZiAhPT0gJ2Z1bmN0aW9uJylcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRXhwZWN0ZWQgZnVuY3Rpb24gZ290IGAgK1xuICAgICAgICAgICAgYCgke3R5cGVvZiBmfSkgJyR7Zj9mLmNvbnN0cnVjdG9yP2YuY29uc3RydWN0b3IubmFtZTpmOmZ9J2ApO1xuXG5cbiAgICByZXR1cm4gZjtcblxufTtcblxuLyoqXG4gKiBtZXJnZSB0d28gb2JqZWN0cyBlYXNpbHlcbiAqIEBzdW1tYXJ5IChPYmplY3QsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gKG8xLCBvMikgPT4gT2JqZWN0LmFzc2lnbih7fSwgbzEsIG8yKTtcblxuLyoqXG4gKiBvcmVkdWNlXG4gKiBAc3VtbWFyeSB7IChPYmplY3QsICgqLHN0cmluZyxPYmplY3Qp4oaSICosICogKSDihpIgICp9XG4gKi9cbmV4cG9ydCBjb25zdCBvcmVkdWNlID0gKG8sIGYsIGkpID0+IE9iamVjdC5rZXlzKG8pLnJlZHVjZSgocCwgaykgPT4gZihwLCBvW2tdLCBvKSwgaSk7XG5cbi8qKlxuICogcGlwZSB0aGUgcmVzdWx0cyBvZiBvbmUgZnVuY3Rpb24gaW50byB0aGUgZm9sbG93aW5nLlxuICogQHN1bW1hcnkgeyAoLi4uICog4oaSICAqKSDihpIgICog4oaSICAqfVxuICovXG5leHBvcnQgY29uc3QgcGlwZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgbGV0IGkgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGxldCBhcmdzID0gW107XG5cbiAgICB3aGlsZSAoaS0tKSBhcmdzW2ldID0gYXJndW1lbnRzW2ldO1xuICAgIHJldHVybiB4ID0+IGFyZ3MucmVkdWNlKCh2LCBuKSA9PiBuKHYpLCB4KTtcblxufVxuXG4vKipcbiAqIGNvbXBvc2UgdHdvIGZ1bmN0aW9ucyBpbnRvIG9uZS5cbiAqIEBzdW1tYXJ5IGNvbXBvc2UgOjogKCog4oaSICAqLCAqIOKGkiAgKikg4oaSICAqXG4gKi9cbmV4cG9ydCBjb25zdCBjb21wb3NlID0gKGYsIGcpID0+IHggPT4gZihnKHgpKTtcblxuLyoqXG4gKiBmbGluZyByZW1vdmVzIGEga2V5IGZyb20gYW4gb2JqZWN0XG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5XG4gKiBAcGFyYW0ge29iamVjdH0gb2JqZWN0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAc3VtbWFyeSB7KHN0cmluZyxPYmplY3QpIOKGkiAgT2JqZWN0fVxuICovXG5leHBvcnQgY29uc3QgZmxpbmcgPSAocywgbykgPT4ge1xuXG4gICAgaWYgKChvID09IG51bGwpIHx8IChvLmNvbnN0cnVjdG9yICE9PSBPYmplY3QpKVxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdmbGluZygpOiBvbmx5IHdvcmtzIHdpdGggb2JqZWN0IGxpdGVyYWxzIScpO1xuXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG8pLnJlZHVjZSgobzIsIGspID0+IGsgPT09IHMgPyBvMiA6IG1lcmdlKG8yLCB7XG4gICAgICAgIFtrXTogb1trXVxuICAgIH0pLCB7fSk7XG5cbn1cblxuLyoqXG4gKiBoZWFkIHJldHVybnMgdGhlIGl0ZW0gYXQgaW5kZXggMCBvZiBhbiBhcnJheVxuICogQHBhcmFtIHtBcnJheX0gbGlzdFxuICogQHJldHVybiB7Kn1cbiAqIEBzdW1tYXJ5IHsgQXJyYXkg4oaSICAqIH1cbiAqL1xuZXhwb3J0IGNvbnN0IGhlYWQgPSBsaXN0ID0+IGxpc3RbMF07XG5cbi8qKlxuICogdGFpbCByZXR1cm5zIHRoZSBsYXN0IGl0ZW0gaW4gYW4gYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAc3VtbWFyeSB7QXJyYXkg4oaSICAqfVxuICovXG5leHBvcnQgY29uc3QgdGFpbCA9IGxpc3QgPT4gbGlzdFtsaXN0Lmxlbmd0aCAtIDFdO1xuXG4vKipcbiAqIHBhcnRpYWwgaXMgYSBwb29yIG1hbidzIHdheSBvZiB0dXJuaW5nIGEgZnVuY3Rpb24gb2YgYXJpdHkgMS0zIGludG9cbiAqIGEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIG9uZSBhcmd1bW1lbnQuIFJlY29nbml6ZXMgYSBGdW5jdGlvbi5sZW5ndGggb2YgMyBtYXhcbiAqIEBzdW1tYXJ5IHsoRnVuY3Rpb24sICopIOKGkiAgKCog4oaSICAqKX1cbiAqL1xuZXhwb3J0IGNvbnN0IHBhcnRpYWwgPSAoZiwgYSkgPT5cbiAgICBmLmxlbmd0aCA9PT0gMSA/ICgpID0+IGYoYSkgOlxuICAgIGYubGVuZ3RoID09PSAyID8gYiA9PiBmKGEsIGIpIDpcbiAgICBmLmxlbmd0aCA9PT0gMyA/IChiLCBjKSA9PiBmKGEsIGIsIGMpIDpcbiAgICBmLmxlbmd0aCA9PT0gNCA/IChiLCBjLCBkKSA9PiBmKGEsIGIsIGMsIGQpIDpcbiAgICAoKCkgPT4geyB0aHJvdyBuZXcgUmFuZ2VFcnJvcihgRnVuY3Rpb24gJHtmfSBoYXMgYW4gYXJpdHkgb2YgJHtmLmxlbmd0aH0gKD4gNClgKSB9KSgpO1xuXG4vKipcbiAqIGNvbnN0YW50IGdpdmVuIGEgdmFsdWUsIHJldHVybiBhIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgdGhpcyB2YWx1ZS5cbiAqIEBzdW1tYXJ5IGNvbnN0YW50IFgg4oaSICAqIOKGkiAgWFxuICpcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbnN0YW50ID0geCA9PiAoKT0+eDtcblxuIl19
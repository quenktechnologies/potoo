'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * isFunction throws an Error if the type passed is not a function.
 * @throws {TypeError}
 * @summary isFunction :: (A → B) →  (A → B)
 */
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
 * pipe the results of one function into the other (L -> R)
 * @summary { (A →  A)... →  (A →  A)}
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
 * compose two or more functions into one.
 * @summary compose (A →  A)... →  (A →  A)
 */
var compose = exports.compose = function compose() {

  var i = arguments.length;
  var args = [];

  while (i--) {
    args[i] = arguments[i];
  }return function (x) {
    return args.reverse().reduce(function (v, n) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9mcGwvdXRpbC5qcyJdLCJuYW1lcyI6WyJpc0Z1bmN0aW9uIiwiZiIsIlR5cGVFcnJvciIsImNvbnN0cnVjdG9yIiwibmFtZSIsIm1lcmdlIiwibzEiLCJvMiIsIk9iamVjdCIsImFzc2lnbiIsIm9yZWR1Y2UiLCJvIiwiaSIsImtleXMiLCJyZWR1Y2UiLCJwIiwiayIsInBpcGUiLCJhcmd1bWVudHMiLCJsZW5ndGgiLCJhcmdzIiwidiIsIm4iLCJ4IiwiY29tcG9zZSIsInJldmVyc2UiLCJmbGluZyIsInMiLCJoZWFkIiwibGlzdCIsInRhaWwiLCJwYXJ0aWFsIiwiYSIsImIiLCJjIiwiZCIsIlJhbmdlRXJyb3IiLCJjb25zdGFudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUNBOzs7OztBQUtPLElBQU1BLGtDQUFhLFNBQWJBLFVBQWEsSUFBSzs7QUFFM0IsTUFBSSxPQUFPQyxDQUFQLEtBQWEsVUFBakIsRUFDSSxNQUFNLElBQUlDLFNBQUosQ0FBYywwQ0FDTEQsQ0FESyx5Q0FDTEEsQ0FESyxlQUNFQSxJQUFFQSxFQUFFRSxXQUFGLEdBQWNGLEVBQUVFLFdBQUYsQ0FBY0MsSUFBNUIsR0FBaUNILENBQW5DLEdBQXFDQSxDQUR2QyxTQUFkLENBQU47O0FBR0osU0FBT0EsQ0FBUDtBQUVILENBUk07O0FBVVA7Ozs7QUFJTyxJQUFNSSx3QkFBUSxTQUFSQSxLQUFRLENBQUNDLEVBQUQsRUFBS0MsRUFBTDtBQUFBLFNBQVlDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxFQUFsQixFQUFzQkMsRUFBdEIsQ0FBWjtBQUFBLENBQWQ7O0FBRVA7Ozs7QUFJTyxJQUFNRyw0QkFBVSxTQUFWQSxPQUFVLENBQUNDLENBQUQsRUFBSVYsQ0FBSixFQUFPVyxDQUFQO0FBQUEsU0FBYUosT0FBT0ssSUFBUCxDQUFZRixDQUFaLEVBQWVHLE1BQWYsQ0FBc0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVWYsRUFBRWMsQ0FBRixFQUFL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SUFBTWtCLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxTQUFLO0FBQUEsV0FBTWQsQ0FBTjtBQUFBLEdBQUw7QUFBQSxDQUFqQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG4vKipcbiAqIGlzRnVuY3Rpb24gdGhyb3dzIGFuIEVycm9yIGlmIHRoZSB0eXBlIHBhc3NlZCBpcyBub3QgYSBmdW5jdGlvbi5cbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn1cbiAqIEBzdW1tYXJ5IGlzRnVuY3Rpb24gOjogKEEg4oaSIEIpIOKGkiAgKEEg4oaSIEIpXG4gKi9cbmV4cG9ydCBjb25zdCBpc0Z1bmN0aW9uID0gZiA9PiB7XG5cbiAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGZ1bmN0aW9uIGdvdCBgICtcbiAgICAgICAgICAgIGAoJHt0eXBlb2YgZn0pICcke2Y/Zi5jb25zdHJ1Y3Rvcj9mLmNvbnN0cnVjdG9yLm5hbWU6ZjpmfSdgKTtcblxuICAgIHJldHVybiBmO1xuXG59O1xuXG4vKipcbiAqIG1lcmdlIHR3byBvYmplY3RzIGVhc2lseVxuICogQHN1bW1hcnkgKE9iamVjdCwgT2JqZWN0KSDihpIgIE9iamVjdFxuICovXG5leHBvcnQgY29uc3QgbWVyZ2UgPSAobzEsIG8yKSA9PiBPYmplY3QuYXNzaWduKHt9LCBvMSwgbzIpO1xuXG4vKipcbiAqIG9yZWR1Y2VcbiAqIEBzdW1tYXJ5IHsgKE9iamVjdCwgKCosc3RyaW5nLE9iamVjdCnihpIgKiwgKiApIOKGkiAgKn1cbiAqL1xuZXhwb3J0IGNvbnN0IG9yZWR1Y2UgPSAobywgZiwgaSkgPT4gT2JqZWN0LmtleXMobykucmVkdWNlKChwLCBrKSA9PiBmKHAsIG9ba10sIG8pLCBpKTtcblxuLyoqXG4gKiBwaXBlIHRoZSByZXN1bHRzIG9mIG9uZSBmdW5jdGlvbiBpbnRvIHRoZSBvdGhlciAoTCAtPiBSKVxuICogQHN1bW1hcnkgeyAoQSDihpIgIEEpLi4uIOKGkiAgKEEg4oaSICBBKX1cbiAqL1xuZXhwb3J0IGNvbnN0IHBpcGUgPSBmdW5jdGlvbigpIHtcblxuICAgIGxldCBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgd2hpbGUgKGktLSkgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICByZXR1cm4geCA9PiBhcmdzLnJlZHVjZSgodiwgbikgPT4gbih2KSwgeCk7XG5cbn1cblxuLyoqXG4gKiBjb21wb3NlIHR3byBvciBtb3JlIGZ1bmN0aW9ucyBpbnRvIG9uZS5cbiAqIEBzdW1tYXJ5IGNvbXBvc2UgKEEg4oaSICBBKS4uLiDihpIgIChBIOKGkiAgQSlcbiAqL1xuZXhwb3J0IGNvbnN0IGNvbXBvc2UgPSBmdW5jdGlvbigpIHtcblxuICAgIGxldCBpID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICBsZXQgYXJncyA9IFtdO1xuXG4gICAgd2hpbGUgKGktLSkgYXJnc1tpXSA9IGFyZ3VtZW50c1tpXTtcbiAgICByZXR1cm4geCA9PiBhcmdzLnJldmVyc2UoKS5yZWR1Y2UoKHYsIG4pID0+IG4odiksIHgpO1xuXG59XG5cbi8qKlxuICogZmxpbmcgcmVtb3ZlcyBhIGtleSBmcm9tIGFuIG9iamVjdFxuICogQHBhcmFtIHtzdHJpbmd9IGtleVxuICogQHBhcmFtIHtvYmplY3R9IG9iamVjdFxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHN1bW1hcnkgeyhzdHJpbmcsT2JqZWN0KSDihpIgIE9iamVjdH1cbiAqL1xuZXhwb3J0IGNvbnN0IGZsaW5nID0gKHMsIG8pID0+IHtcblxuICAgIGlmICgobyA9PSBudWxsKSB8fCAoby5jb25zdHJ1Y3RvciAhPT0gT2JqZWN0KSlcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZmxpbmcoKTogb25seSB3b3JrcyB3aXRoIG9iamVjdCBsaXRlcmFscyEnKTtcblxuICAgIHJldHVybiBPYmplY3Qua2V5cyhvKS5yZWR1Y2UoKG8yLCBrKSA9PiBrID09PSBzID8gbzIgOiBtZXJnZShvMiwge1xuICAgICAgICBba106IG9ba11cbiAgICB9KSwge30pO1xuXG59XG5cbi8qKlxuICogaGVhZCByZXR1cm5zIHRoZSBpdGVtIGF0IGluZGV4IDAgb2YgYW4gYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAc3VtbWFyeSB7IEFycmF5IOKGkiAgKiB9XG4gKi9cbmV4cG9ydCBjb25zdCBoZWFkID0gbGlzdCA9PiBsaXN0WzBdO1xuXG4vKipcbiAqIHRhaWwgcmV0dXJucyB0aGUgbGFzdCBpdGVtIGluIGFuIGFycmF5XG4gKiBAcGFyYW0ge0FycmF5fSBsaXN0XG4gKiBAcmV0dXJuIHsqfVxuICogQHN1bW1hcnkge0FycmF5IOKGkiAgKn1cbiAqL1xuZXhwb3J0IGNvbnN0IHRhaWwgPSBsaXN0ID0+IGxpc3RbbGlzdC5sZW5ndGggLSAxXTtcblxuLyoqXG4gKiBwYXJ0aWFsIGlzIGEgcG9vciBtYW4ncyB3YXkgb2YgdHVybmluZyBhIGZ1bmN0aW9uIG9mIGFyaXR5IDEtMyBpbnRvXG4gKiBhIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBvbmUgYXJndW1tZW50LiBSZWNvZ25pemVzIGEgRnVuY3Rpb24ubGVuZ3RoIG9mIDMgbWF4XG4gKiBAc3VtbWFyeSB7KEZ1bmN0aW9uLCAqKSDihpIgICgqIOKGkiAgKil9XG4gKi9cbmV4cG9ydCBjb25zdCBwYXJ0aWFsID0gKGYsIGEpID0+XG4gICAgZi5sZW5ndGggPT09IDEgPyAoKSA9PiBmKGEpIDpcbiAgICBmLmxlbmd0aCA9PT0gMiA/IGIgPT4gZihhLCBiKSA6XG4gICAgZi5sZW5ndGggPT09IDMgPyAoYiwgYykgPT4gZihhLCBiLCBjKSA6XG4gICAgZi5sZW5ndGggPT09IDQgPyAoYiwgYywgZCkgPT4gZihhLCBiLCBjLCBkKSA6XG4gICAgKCgpID0+IHsgdGhyb3cgbmV3IFJhbmdlRXJyb3IoYEZ1bmN0aW9uICR7Zn0gaGFzIGFuIGFyaXR5IG9mICR7Zi5sZW5ndGh9ICg+IDQpYCkgfSkoKTtcblxuLyoqXG4gKiBjb25zdGFudCBnaXZlbiBhIHZhbHVlLCByZXR1cm4gYSBmdW5jdGlvbiB0aGF0IGFsd2F5cyByZXR1cm5zIHRoaXMgdmFsdWUuXG4gKiBAc3VtbWFyeSBjb25zdGFudCBYIOKGkiAgKiDihpIgIFhcbiAqXG4gKi9cbmV4cG9ydCBjb25zdCBjb25zdGFudCA9IHggPT4gKCkgPT4geDtcbiJdfQ==
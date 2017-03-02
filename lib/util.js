"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbIm1lcmdlIiwibzEiLCJvMiIsIk9iamVjdCIsImFzc2lnbiIsIm9yZWR1Y2UiLCJvIiwiZiIsImkiLCJrZXlzIiwicmVkdWNlIiwicCIsImsiXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUE7Ozs7QUFJTyxJQUFNQSx3QkFBUSxTQUFSQSxLQUFRLENBQUNDLEVBQUQsRUFBS0MsRUFBTDtBQUFBLFNBQVlDLE9BQU9DLE1BQVAsQ0FBYyxFQUFkLEVBQWtCSCxFQUFsQixFQUFzQkMsRUFBdEIsQ0FBWjtBQUFBLENBQWQ7O0FBRVA7Ozs7QUFJTyxJQUFNRyw0QkFBVSxTQUFWQSxPQUFVLENBQUNDLENBQUQsRUFBSUMsQ0FBSixFQUFPQyxDQUFQO0FBQUEsU0FBYUwsT0FBT00sSUFBUCxDQUFZSCxDQUFaLEVBQWVJLE1BQWYsQ0FBc0IsVUFBQ0MsQ0FBRCxFQUFJQyxDQUFKO0FBQUEsV0FBVUwsRUFBRUksQ0FBRixFQUFLTCxFQUFFTSxDQUFGLENBQUwsRUFBV04sQ0FBWCxDQUFWO0FBQUEsR0FBdEIsRUFBK0NFLENBQS9DLENBQWI7QUFBQSxDQUFoQiIsImZpbGUiOiJ1dGlsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBtZXJnZSB0d28gb2JqZWN0cyBlYXNpbHlcbiAqIEBzdW1tYXJ5IChPYmplY3QsIE9iamVjdCkg4oaSICBPYmplY3RcbiAqL1xuZXhwb3J0IGNvbnN0IG1lcmdlID0gKG8xLCBvMikgPT4gT2JqZWN0LmFzc2lnbih7fSwgbzEsIG8yKTtcblxuLyoqXG4gKiBvcmVkdWNlXG4gKiBAc3VtbWFyeSB7IChPYmplY3QsICgqLHN0cmluZyxPYmplY3Qp4oaSICosICogKSDihpIgICp9XG4gKi9cbmV4cG9ydCBjb25zdCBvcmVkdWNlID0gKG8sIGYsIGkpID0+IE9iamVjdC5rZXlzKG8pLnJlZHVjZSgocCwgaykgPT4gZihwLCBvW2tdLCBvKSwgaSk7XG4iXX0=
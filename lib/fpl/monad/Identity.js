"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Identity
 */
var Identity = exports.Identity = function Identity(a) {
  var _this = this;

  _classCallCheck(this, Identity);

  this.a = a;
  this.map = map(this);
  this.chain = chain(this);
  this.ap = ap(this);
  this.get = function () {
    return get(_this);
  };
};

/**
 * of
 * @summary of :: A →  Identity<A>
 */


var of = exports.of = function of(v) {
  return new Identity(v);
};

/**
 * map
 * @summary map :: Identity<A> →  (A →  B) Identity<B>
 */
var map = exports.map = function map(i) {
  return function (f) {
    return new Identity(f(i.a));
  };
};

/**
 * chain
 * @summary chain :: Identity<A> →  (A → Identity<B>) →  Identity<B>
 */
var chain = exports.chain = function chain(i) {
  return function (f) {
    return f(i.a);
  };
};

/**
 * ap
 * @summary ap :: Identity<A> →  Identity<A → B> >  Identity<B>
 */
var ap = exports.ap = function ap(i) {
  return function (i2) {
    return i2.map(i.a);
  };
};

/**
 * get the value of an Identity
 * @summary get :: Identity<A> →  A
 */
var get = exports.get = function get(_ref) {
  var a = _ref.a;
  return a;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvbW9uYWQvSWRlbnRpdHkuanMiXSwibmFtZXMiOlsiSWRlbnRpdHkiLCJhIiwibWFwIiwiY2hhaW4iLCJhcCIsImdldCIsIm9mIiwidiIsImYiLCJpIiwiaTIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7OztJQUdhQSxRLFdBQUFBLFEsR0FFVCxrQkFBWUMsQ0FBWixFQUFlO0FBQUE7O0FBQUE7O0FBRVgsT0FBS0EsQ0FBTCxHQUFTQSxDQUFUO0FBQ0EsT0FBS0MsR0FBTCxHQUFXQSxJQUFJLElBQUosQ0FBWDtBQUNBLE9BQUtDLEtBQUwsR0FBYUEsTUFBTSxJQUFOLENBQWI7QUFDQSxPQUFLQyxFQUFMLEdBQVVBLEdBQUcsSUFBSCxDQUFWO0FBQ0EsT0FBS0MsR0FBTCxHQUFXO0FBQUEsV0FBSUEsVUFBSjtBQUFBLEdBQVg7QUFFSCxDOztBQUlMOzs7Ozs7QUFJTyxJQUFNQyxrQkFBSyxTQUFMQSxFQUFLO0FBQUEsU0FBSyxJQUFJTixRQUFKLENBQWFPLENBQWIsQ0FBTDtBQUFBLENBQVg7O0FBRVA7Ozs7QUFJTyxJQUFNTCxvQkFBTSxTQUFOQSxHQUFNO0FBQUEsU0FBSztBQUFBLFdBQUssSUFBSUYsUUFBSixDQUFhUSxFQUFFQyxFQUFFUixDQUFKLENBQWIsQ0FBTDtBQUFBLEdBQUw7QUFBQSxDQUFaOztBQUVQOzs7O0FBSU8sSUFBTUUsd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFNBQUs7QUFBQSxXQUFLSyxFQUFFQyxFQUFFUixDQUFKLENBQUw7QUFBQSxHQUFMO0FBQUEsQ0FBZDs7QUFFUDs7OztBQUlPLElBQU1HLGtCQUFLLFNBQUxBLEVBQUs7QUFBQSxTQUFLO0FBQUEsV0FBTU0sR0FBR1IsR0FBSCxDQUFPTyxFQUFFUixDQUFULENBQU47QUFBQSxHQUFMO0FBQUEsQ0FBWDs7QUFFUDs7OztBQUlPLElBQU1JLG9CQUFNLFNBQU5BLEdBQU07QUFBQSxNQUFHSixDQUFILFFBQUdBLENBQUg7QUFBQSxTQUFXQSxDQUFYO0FBQUEsQ0FBWiIsImZpbGUiOiJJZGVudGl0eS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogSWRlbnRpdHlcbiAqL1xuZXhwb3J0IGNsYXNzIElkZW50aXR5IHtcblxuICAgIGNvbnN0cnVjdG9yKGEpIHtcblxuICAgICAgICB0aGlzLmEgPSBhO1xuICAgICAgICB0aGlzLm1hcCA9IG1hcCh0aGlzKTtcbiAgICAgICAgdGhpcy5jaGFpbiA9IGNoYWluKHRoaXMpO1xuICAgICAgICB0aGlzLmFwID0gYXAodGhpcyk7XG4gICAgICAgIHRoaXMuZ2V0ID0gKCk9PmdldCh0aGlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIG9mXG4gKiBAc3VtbWFyeSBvZiA6OiBBIOKGkiAgSWRlbnRpdHk8QT5cbiAqL1xuZXhwb3J0IGNvbnN0IG9mID0gdiA9PiBuZXcgSWRlbnRpdHkodik7XG5cbi8qKlxuICogbWFwXG4gKiBAc3VtbWFyeSBtYXAgOjogSWRlbnRpdHk8QT4g4oaSICAoQSDihpIgIEIpIElkZW50aXR5PEI+XG4gKi9cbmV4cG9ydCBjb25zdCBtYXAgPSBpID0+IGYgPT4gbmV3IElkZW50aXR5KGYoaS5hKSk7XG5cbi8qKlxuICogY2hhaW5cbiAqIEBzdW1tYXJ5IGNoYWluIDo6IElkZW50aXR5PEE+IOKGkiAgKEEg4oaSIElkZW50aXR5PEI+KSDihpIgIElkZW50aXR5PEI+XG4gKi9cbmV4cG9ydCBjb25zdCBjaGFpbiA9IGkgPT4gZiA9PiBmKGkuYSk7XG5cbi8qKlxuICogYXBcbiAqIEBzdW1tYXJ5IGFwIDo6IElkZW50aXR5PEE+IOKGkiAgSWRlbnRpdHk8QSDihpIgQj4gPiAgSWRlbnRpdHk8Qj5cbiAqL1xuZXhwb3J0IGNvbnN0IGFwID0gaSA9PiBpMiA9PiBpMi5tYXAoaS5hKTtcblxuLyoqXG4gKiBnZXQgdGhlIHZhbHVlIG9mIGFuIElkZW50aXR5XG4gKiBAc3VtbWFyeSBnZXQgOjogSWRlbnRpdHk8QT4g4oaSICBBXG4gKi9cbmV4cG9ydCBjb25zdCBnZXQgPSAoeyBhIH0pID0+IGE7XG4iXX0=
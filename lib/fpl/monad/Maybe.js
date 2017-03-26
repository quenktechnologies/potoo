'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cata = exports.orElse = exports.get = exports.chain = exports.map = exports.orJust = exports.of = exports.fromAny = exports.Just = exports.Nothing = exports.Maybe = undefined;

var _Match = require('../control/Match');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Maybe
 */
var Maybe = exports.Maybe = function Maybe() {
  _classCallCheck(this, Maybe);

  this.orJust = orJust(this);
  this.map = map(this);
  this.chain = chain(this);
  this.get = get(this);
  this.orElse = orElse(this);
  this.cata = cata(this);
};

/**
 * Nothing
 */


var Nothing = exports.Nothing = function (_Maybe) {
  _inherits(Nothing, _Maybe);

  function Nothing() {
    _classCallCheck(this, Nothing);

    return _possibleConstructorReturn(this, (Nothing.__proto__ || Object.getPrototypeOf(Nothing)).apply(this, arguments));
  }

  return Nothing;
}(Maybe);

/**
 * Just
 */


var Just = exports.Just = function (_Maybe2) {
  _inherits(Just, _Maybe2);

  function Just(value) {
    _classCallCheck(this, Just);

    var _this2 = _possibleConstructorReturn(this, (Just.__proto__ || Object.getPrototypeOf(Just)).call(this));

    _this2.value = value;

    return _this2;
  }

  return Just;
}(Maybe);

/**
 * fromAny constructs a Maybe from a value that may be null.
 * @summary fromAny :: * →  Maybe<*>
 */


var fromAny = exports.fromAny = function fromAny(v) {
  return v == null ? new Nothing() : new Just(v);
};

/**
 * of wraps the passed value in a Maybe
 * @summary of :: * →  Maybe<*>
 */
var of = exports.of = function of(v) {
  return new Just(v);
};

/**
 * orJust will turn Nothing into Just, wrapping the value specified.
 * @summary orJust :: Maybe<A> → (()→ A) →  Maybe<A>
 */
var orJust = exports.orJust = function orJust(m) {
  return function (f) {
    return (0, _Match.match)(m).caseOf(Nothing, function () {
      return of(f());
    }).caseOf(Just, function (m) {
      return m;
    }).end();
  };
};

/**
 * map
 * @summary Maybe<A> →  (A →  B) →  Maybe<B>
 */
var map = exports.map = function map(m) {
  return function (f) {
    return (0, _Match.match)(m).caseOf(Nothing, function (m) {
      return m;
    }).caseOf(Just, function (_ref) {
      var value = _ref.value;
      return of(f(value));
    }).end();
  };
};

/**
 * chain
 * @summary Maybe<A> →  (A →  Maybe<B>) →  Maybe<B>
 */
var chain = exports.chain = function chain(m) {
  return function (f) {
    return (0, _Match.match)(m).caseOf(Nothing, function (m) {
      return m;
    }).caseOf(Just, function (_ref2) {
      var value = _ref2.value;
      return f(value);
    }).end();
  };
};

/**
 * get the value wrapped by the Maybe
 * @throws {TypeError} if the Maybe is Nothing
 * @summary Maybe<A> →  () →  A
 */
var get = exports.get = function get(m) {
  return function () {
    return (0, _Match.match)(m).caseOf(Nothing, function () {
      throw new TypeError('Cannot get anything from Nothing!');
    }).caseOf(Just, function (_ref3) {
      var value = _ref3.value;
      return value;
    }).end();
  };
};

/**
 * orElse applies a function for transforming Nothing into a Just
 * @summary orElse :: Maybe →  (() →  Maybe<B>) →  Maybe<B>
 */
var orElse = exports.orElse = function orElse(m) {
  return function (f) {
    return (0, _Match.match)(m).caseOf(Nothing, f).caseOf(Just, function (m) {
      return m;
    }).end();
  };
};

/**
 * cata applies the corresponding function to the Maybe
 * @summary cata :: Maybe →  (()→ B, A →  B) →  B
 */
var cata = exports.cata = function cata(m) {
  return function (f, g) {
    return (0, _Match.match)(m).caseOf(Nothing, f).caseOf(Just, g).end();
  };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvbW9uYWQvTWF5YmUuanMiXSwibmFtZXMiOlsiTWF5YmUiLCJvckp1c3QiLCJtYXAiLCJjaGFpbiIsImdldCIsIm9yRWxzZSIsImNhdGEiLCJOb3RoaW5nIiwiSnVzdCIsInZhbHVlIiwiZnJvbUFueSIsInYiLCJvZiIsIm0iLCJjYXNlT2YiLCJmIiwiZW5kIiwiVHlwZUVycm9yIiwiZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7OztBQUVBOzs7SUFHYUEsSyxXQUFBQSxLLEdBRVQsaUJBQWM7QUFBQTs7QUFFVixPQUFLQyxNQUFMLEdBQWNBLE9BQU8sSUFBUCxDQUFkO0FBQ0EsT0FBS0MsR0FBTCxHQUFXQSxJQUFJLElBQUosQ0FBWDtBQUNBLE9BQUtDLEtBQUwsR0FBYUEsTUFBTSxJQUFOLENBQWI7QUFDQSxPQUFLQyxHQUFMLEdBQVdBLElBQUksSUFBSixDQUFYO0FBQ0EsT0FBS0MsTUFBTCxHQUFjQSxPQUFPLElBQVAsQ0FBZDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsS0FBSyxJQUFMLENBQVo7QUFFSCxDOztBQUtMOzs7OztJQUdhQyxPLFdBQUFBLE87Ozs7Ozs7Ozs7RUFBZ0JQLEs7O0FBRTdCOzs7OztJQUdhUSxJLFdBQUFBLEk7OztBQUVULGdCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBQUE7O0FBR2YsV0FBS0EsS0FBTCxHQUFhQSxLQUFiOztBQUhlO0FBS2xCOzs7RUFQcUJULEs7O0FBVzFCOzs7Ozs7QUFJTyxJQUFNVSw0QkFBVSxTQUFWQSxPQUFVO0FBQUEsU0FBS0MsS0FBSyxJQUFMLEdBQVksSUFBSUosT0FBSixFQUFaLEdBQTRCLElBQUlDLElBQUosQ0FBU0csQ0FBVCxDQUFqQztBQUFBLENBQWhCOztBQUVQOzs7O0FBSU8sSUFBTUMsa0JBQUssU0FBTEEsRUFBSztBQUFBLFNBQUssSUFBSUosSUFBSixDQUFTRyxDQUFULENBQUw7QUFBQSxDQUFYOztBQUVQOzs7O0FBSU8sSUFBTVYsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQUs7QUFBQSxXQUFLLGtCQUFNWSxDQUFOLEVBQzNCQyxNQUQyQixDQUNwQlAsT0FEb0IsRUFDWDtBQUFBLGFBQU1LLEdBQUdHLEdBQUgsQ0FBTjtBQUFBLEtBRFcsRUFFM0JELE1BRjJCLENBRXBCTixJQUZvQixFQUVkO0FBQUEsYUFBS0ssQ0FBTDtBQUFBLEtBRmMsRUFHM0JHLEdBSDJCLEVBQUw7QUFBQSxHQUFMO0FBQUEsQ0FBZjs7QUFLUDs7OztBQUlPLElBQU1kLG9CQUFNLFNBQU5BLEdBQU07QUFBQSxTQUFLO0FBQUEsV0FBSyxrQkFBTVcsQ0FBTixFQUN4QkMsTUFEd0IsQ0FDakJQLE9BRGlCLEVBQ1I7QUFBQSxhQUFLTSxDQUFMO0FBQUEsS0FEUSxFQUV4QkMsTUFGd0IsQ0FFakJOLElBRmlCLEVBRVg7QUFBQSxVQUFHQyxLQUFILFFBQUdBLEtBQUg7QUFBQSxhQUFlRyxHQUFHRyxFQUFFTixLQUFGLENBQUgsQ0FBZjtBQUFBLEtBRlcsRUFHeEJPLEdBSHdCLEVBQUw7QUFBQSxHQUFMO0FBQUEsQ0FBWjs7QUFLUDs7OztBQUlPLElBQU1iLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxTQUFLO0FBQUEsV0FBSyxrQkFBTVUsQ0FBTixFQUMxQkMsTUFEMEIsQ0FDbkJQLE9BRG1CLEVBQ1Y7QUFBQSxhQUFLTSxDQUFMO0FBQUEsS0FEVSxFQUUxQkMsTUFGMEIsQ0FFbkJOLElBRm1CLEVBRWI7QUFBQSxVQUFHQyxLQUFILFNBQUdBLEtBQUg7QUFBQSxhQUFlTSxFQUFFTixLQUFGLENBQWY7QUFBQSxLQUZhLEVBRzFCTyxHQUgwQixFQUFMO0FBQUEsR0FBTDtBQUFBLENBQWQ7O0FBS1A7Ozs7O0FBS08sSUFBTVosb0JBQU0sU0FBTkEsR0FBTTtBQUFBLFNBQUs7QUFBQSxXQUFNLGtCQUFNUyxDQUFOLEVBQ3pCQyxNQUR5QixDQUNsQlAsT0FEa0IsRUFDVCxZQUFNO0FBQUUsWUFBTSxJQUFJVSxTQUFKLENBQWMsbUNBQWQsQ0FBTjtBQUEyRCxLQUQxRCxFQUV6QkgsTUFGeUIsQ0FFbEJOLElBRmtCLEVBRVo7QUFBQSxVQUFHQyxLQUFILFNBQUdBLEtBQUg7QUFBQSxhQUFlQSxLQUFmO0FBQUEsS0FGWSxFQUd6Qk8sR0FIeUIsRUFBTjtBQUFBLEdBQUw7QUFBQSxDQUFaOztBQUtQOzs7O0FBSU8sSUFBTVgsMEJBQVMsU0FBVEEsTUFBUztBQUFBLFNBQUs7QUFBQSxXQUFLLGtCQUFNUSxDQUFOLEVBQzNCQyxNQUQyQixDQUNwQlAsT0FEb0IsRUFDWFEsQ0FEVyxFQUUzQkQsTUFGMkIsQ0FFcEJOLElBRm9CLEVBRWQ7QUFBQSxhQUFLSyxDQUFMO0FBQUEsS0FGYyxFQUczQkcsR0FIMkIsRUFBTDtBQUFBLEdBQUw7QUFBQSxDQUFmOztBQUtQOzs7O0FBSU8sSUFBTVYsc0JBQU8sU0FBUEEsSUFBTztBQUFBLFNBQUssVUFBQ1MsQ0FBRCxFQUFJRyxDQUFKO0FBQUEsV0FBVSxrQkFBTUwsQ0FBTixFQUM5QkMsTUFEOEIsQ0FDdkJQLE9BRHVCLEVBQ2RRLENBRGMsRUFFOUJELE1BRjhCLENBRXZCTixJQUZ1QixFQUVqQlUsQ0FGaUIsRUFHOUJGLEdBSDhCLEVBQVY7QUFBQSxHQUFMO0FBQUEsQ0FBYiIsImZpbGUiOiJNYXliZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1hdGNoIH0gZnJvbSAnLi4vY29udHJvbC9NYXRjaCc7XG5cbi8qKlxuICogTWF5YmVcbiAqL1xuZXhwb3J0IGNsYXNzIE1heWJlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMub3JKdXN0ID0gb3JKdXN0KHRoaXMpO1xuICAgICAgICB0aGlzLm1hcCA9IG1hcCh0aGlzKTtcbiAgICAgICAgdGhpcy5jaGFpbiA9IGNoYWluKHRoaXMpO1xuICAgICAgICB0aGlzLmdldCA9IGdldCh0aGlzKTtcbiAgICAgICAgdGhpcy5vckVsc2UgPSBvckVsc2UodGhpcyk7XG4gICAgICAgIHRoaXMuY2F0YSA9IGNhdGEodGhpcyk7XG5cbiAgICB9XG5cblxufVxuXG4vKipcbiAqIE5vdGhpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGhpbmcgZXh0ZW5kcyBNYXliZSB7fVxuXG4vKipcbiAqIEp1c3RcbiAqL1xuZXhwb3J0IGNsYXNzIEp1c3QgZXh0ZW5kcyBNYXliZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIGZyb21BbnkgY29uc3RydWN0cyBhIE1heWJlIGZyb20gYSB2YWx1ZSB0aGF0IG1heSBiZSBudWxsLlxuICogQHN1bW1hcnkgZnJvbUFueSA6OiAqIOKGkiAgTWF5YmU8Kj5cbiAqL1xuZXhwb3J0IGNvbnN0IGZyb21BbnkgPSB2ID0+IHYgPT0gbnVsbCA/IG5ldyBOb3RoaW5nKCkgOiBuZXcgSnVzdCh2KTtcblxuLyoqXG4gKiBvZiB3cmFwcyB0aGUgcGFzc2VkIHZhbHVlIGluIGEgTWF5YmVcbiAqIEBzdW1tYXJ5IG9mIDo6ICog4oaSICBNYXliZTwqPlxuICovXG5leHBvcnQgY29uc3Qgb2YgPSB2ID0+IG5ldyBKdXN0KHYpO1xuXG4vKipcbiAqIG9ySnVzdCB3aWxsIHR1cm4gTm90aGluZyBpbnRvIEp1c3QsIHdyYXBwaW5nIHRoZSB2YWx1ZSBzcGVjaWZpZWQuXG4gKiBAc3VtbWFyeSBvckp1c3QgOjogTWF5YmU8QT4g4oaSICgoKeKGkiBBKSDihpIgIE1heWJlPEE+XG4gKi9cbmV4cG9ydCBjb25zdCBvckp1c3QgPSBtID0+IGYgPT4gbWF0Y2gobSlcbiAgICAuY2FzZU9mKE5vdGhpbmcsICgpID0+IG9mKGYoKSkpXG4gICAgLmNhc2VPZihKdXN0LCBtID0+IG0pXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIG1hcFxuICogQHN1bW1hcnkgTWF5YmU8QT4g4oaSICAoQSDihpIgIEIpIOKGkiAgTWF5YmU8Qj5cbiAqL1xuZXhwb3J0IGNvbnN0IG1hcCA9IG0gPT4gZiA9PiBtYXRjaChtKVxuICAgIC5jYXNlT2YoTm90aGluZywgbSA9PiBtKVxuICAgIC5jYXNlT2YoSnVzdCwgKHsgdmFsdWUgfSkgPT4gb2YoZih2YWx1ZSkpKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBjaGFpblxuICogQHN1bW1hcnkgTWF5YmU8QT4g4oaSICAoQSDihpIgIE1heWJlPEI+KSDihpIgIE1heWJlPEI+XG4gKi9cbmV4cG9ydCBjb25zdCBjaGFpbiA9IG0gPT4gZiA9PiBtYXRjaChtKVxuICAgIC5jYXNlT2YoTm90aGluZywgbSA9PiBtKVxuICAgIC5jYXNlT2YoSnVzdCwgKHsgdmFsdWUgfSkgPT4gZih2YWx1ZSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIGdldCB0aGUgdmFsdWUgd3JhcHBlZCBieSB0aGUgTWF5YmVcbiAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgdGhlIE1heWJlIGlzIE5vdGhpbmdcbiAqIEBzdW1tYXJ5IE1heWJlPEE+IOKGkiAgKCkg4oaSICBBXG4gKi9cbmV4cG9ydCBjb25zdCBnZXQgPSBtID0+ICgpID0+IG1hdGNoKG0pXG4gICAgLmNhc2VPZihOb3RoaW5nLCAoKSA9PiB7IHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBnZXQgYW55dGhpbmcgZnJvbSBOb3RoaW5nIScpOyB9KVxuICAgIC5jYXNlT2YoSnVzdCwgKHsgdmFsdWUgfSkgPT4gdmFsdWUpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIG9yRWxzZSBhcHBsaWVzIGEgZnVuY3Rpb24gZm9yIHRyYW5zZm9ybWluZyBOb3RoaW5nIGludG8gYSBKdXN0XG4gKiBAc3VtbWFyeSBvckVsc2UgOjogTWF5YmUg4oaSICAoKCkg4oaSICBNYXliZTxCPikg4oaSICBNYXliZTxCPlxuICovXG5leHBvcnQgY29uc3Qgb3JFbHNlID0gbSA9PiBmID0+IG1hdGNoKG0pXG4gICAgLmNhc2VPZihOb3RoaW5nLCBmKVxuICAgIC5jYXNlT2YoSnVzdCwgbSA9PiBtKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBjYXRhIGFwcGxpZXMgdGhlIGNvcnJlc3BvbmRpbmcgZnVuY3Rpb24gdG8gdGhlIE1heWJlXG4gKiBAc3VtbWFyeSBjYXRhIDo6IE1heWJlIOKGkiAgKCgp4oaSIEIsIEEg4oaSICBCKSDihpIgIEJcbiAqL1xuZXhwb3J0IGNvbnN0IGNhdGEgPSBtID0+IChmLCBnKSA9PiBtYXRjaChtKVxuICAgIC5jYXNlT2YoTm90aGluZywgZilcbiAgICAuY2FzZU9mKEp1c3QsIGcpXG4gICAgLmVuZCgpO1xuIl19
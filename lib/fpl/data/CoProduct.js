'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.right = exports.left = exports.cata = exports.map = exports.CoProduct = undefined;

var _Either = require('../monad/Either');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * CoProduct
 * @implements {Functor}
 */
var CoProduct = exports.CoProduct = function CoProduct(either) {
  _classCallCheck(this, CoProduct);

  this.either = either;
  this.map = map(this);
  this.cata = cata(this);
};

/**
 * map
 * @summary map F<A> →  (A →  B) →  F<B>
 */


var map = exports.map = function map(ftor) {
  return function (f) {
    return new CoProduct(ftor.cata(function (a) {
      return new _Either.Left(a.map(f));
    }, function (a) {
      return new _Either.Right(a.map(f));
    }));
  };
};

/**
 * cata
 * @summary cata :: CoProduct <F,G,A> →  (F<A> →  B, G<A> → B) → B
 */
var cata = exports.cata = function cata(_ref) {
  var either = _ref.either;
  return function (f, g) {
    return either.cata(f, g);
  };
};

/**
 * left
 * @summary :: F<A> →  CoProduct<F,G,A>
 */
var left = exports.left = function left(F) {
  return new CoProduct(new _Either.Left(F));
};

/**
 * right
 * @summary :: G<A> →  CoProduct<F,G,A>
 */
var right = exports.right = function right(G) {
  return new CoProduct(new _Either.Right(G));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvZGF0YS9Db1Byb2R1Y3QuanMiXSwibmFtZXMiOlsiQ29Qcm9kdWN0IiwiZWl0aGVyIiwibWFwIiwiY2F0YSIsImZ0b3IiLCJhIiwiZiIsImciLCJsZWZ0IiwiRiIsInJpZ2h0IiwiRyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7SUFJYUEsUyxXQUFBQSxTLEdBRVQsbUJBQVlDLE1BQVosRUFBb0I7QUFBQTs7QUFFaEIsT0FBS0EsTUFBTCxHQUFjQSxNQUFkO0FBQ0EsT0FBS0MsR0FBTCxHQUFXQSxJQUFJLElBQUosQ0FBWDtBQUNBLE9BQUtDLElBQUwsR0FBWUEsS0FBSyxJQUFMLENBQVo7QUFFSCxDOztBQUlMOzs7Ozs7QUFJTyxJQUFNRCxvQkFBTSxTQUFOQSxHQUFNO0FBQUEsU0FBUTtBQUFBLFdBQ3ZCLElBQUlGLFNBQUosQ0FBY0ksS0FBS0QsSUFBTCxDQUFVO0FBQUEsYUFBSyxpQkFBU0UsRUFBRUgsR0FBRixDQUFNSSxDQUFOLENBQVQsQ0FBTDtBQUFBLEtBQVYsRUFBbUM7QUFBQSxhQUFLLGtCQUFVRCxFQUFFSCxHQUFGLENBQU1JLENBQU4sQ0FBVixDQUFMO0FBQUEsS0FBbkMsQ0FBZCxDQUR1QjtBQUFBLEdBQVI7QUFBQSxDQUFaOztBQUdQOzs7O0FBSU8sSUFBTUgsc0JBQU8sU0FBUEEsSUFBTztBQUFBLE1BQUdGLE1BQUgsUUFBR0EsTUFBSDtBQUFBLFNBQWdCLFVBQUNLLENBQUQsRUFBSUMsQ0FBSjtBQUFBLFdBQVVOLE9BQU9FLElBQVAsQ0FBWUcsQ0FBWixFQUFlQyxDQUFmLENBQVY7QUFBQSxHQUFoQjtBQUFBLENBQWI7O0FBRVA7Ozs7QUFJTyxJQUFNQyxzQkFBTyxTQUFQQSxJQUFPO0FBQUEsU0FBSyxJQUFJUixTQUFKLENBQWMsaUJBQVNTLENBQVQsQ0FBZCxDQUFMO0FBQUEsQ0FBYjs7QUFFUDs7OztBQUlPLElBQU1DLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxTQUFLLElBQUlWLFNBQUosQ0FBYyxrQkFBVVcsQ0FBVixDQUFkLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6IkNvUHJvZHVjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExlZnQsIFJpZ2h0IH0gZnJvbSAnLi4vbW9uYWQvRWl0aGVyJztcblxuLyoqXG4gKiBDb1Byb2R1Y3RcbiAqIEBpbXBsZW1lbnRzIHtGdW5jdG9yfVxuICovXG5leHBvcnQgY2xhc3MgQ29Qcm9kdWN0IHtcblxuICAgIGNvbnN0cnVjdG9yKGVpdGhlcikge1xuXG4gICAgICAgIHRoaXMuZWl0aGVyID0gZWl0aGVyO1xuICAgICAgICB0aGlzLm1hcCA9IG1hcCh0aGlzKTtcbiAgICAgICAgdGhpcy5jYXRhID0gY2F0YSh0aGlzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIG1hcFxuICogQHN1bW1hcnkgbWFwIEY8QT4g4oaSICAoQSDihpIgIEIpIOKGkiAgRjxCPlxuICovXG5leHBvcnQgY29uc3QgbWFwID0gZnRvciA9PiBmID0+XG4gICAgbmV3IENvUHJvZHVjdChmdG9yLmNhdGEoYSA9PiBuZXcgTGVmdChhLm1hcChmKSksIGEgPT4gbmV3IFJpZ2h0KGEubWFwKGYpKSkpO1xuXG4vKipcbiAqIGNhdGFcbiAqIEBzdW1tYXJ5IGNhdGEgOjogQ29Qcm9kdWN0IDxGLEcsQT4g4oaSICAoRjxBPiDihpIgIEIsIEc8QT4g4oaSIEIpIOKGkiBCXG4gKi9cbmV4cG9ydCBjb25zdCBjYXRhID0gKHsgZWl0aGVyIH0pID0+IChmLCBnKSA9PiBlaXRoZXIuY2F0YShmLCBnKTtcblxuLyoqXG4gKiBsZWZ0XG4gKiBAc3VtbWFyeSA6OiBGPEE+IOKGkiAgQ29Qcm9kdWN0PEYsRyxBPlxuICovXG5leHBvcnQgY29uc3QgbGVmdCA9IEYgPT4gbmV3IENvUHJvZHVjdChuZXcgTGVmdChGKSk7XG5cbi8qKlxuICogcmlnaHRcbiAqIEBzdW1tYXJ5IDo6IEc8QT4g4oaSICBDb1Byb2R1Y3Q8RixHLEE+XG4gKi9cbmV4cG9ydCBjb25zdCByaWdodCA9IEcgPT4gbmV3IENvUHJvZHVjdChuZXcgUmlnaHQoRykpO1xuIl19
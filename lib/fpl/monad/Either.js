"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.right = right;
exports.left = left;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Either monad.
 * @abstract
 */
var Either = exports.Either = function () {
    function Either(v) {
        _classCallCheck(this, Either);

        this._value = v;
    }

    _createClass(Either, [{
        key: "join",
        value: function join() {

            return this.chain(function (x) {
                return x;
            });
        }
    }, {
        key: "left",
        value: function left() {

            if (this instanceof Left) return this._value;

            throw new TypeError("Either#left(): '" + this.constructor.name + "' is not instance of Left!");
        }
    }, {
        key: "right",
        value: function right() {

            if (this instanceof Right) return this._value;

            throw new TypeError("Either#right(): '" + this.constructor.name + "' is not instance of Right!");
        }
    }, {
        key: "cata",
        value: function cata(l, r) {

            return this instanceof Left ? l(this._value) : r(this._value);
        }
    }]);

    return Either;
}();

/**
 * Right represents the correct thing.
 */


var Right = exports.Right = function (_Either) {
    _inherits(Right, _Either);

    function Right() {
        _classCallCheck(this, Right);

        return _possibleConstructorReturn(this, (Right.__proto__ || Object.getPrototypeOf(Right)).apply(this, arguments));
    }

    _createClass(Right, [{
        key: "map",
        value: function map(f) {

            return new Right(f(this._value));
        }
    }, {
        key: "chain",
        value: function chain(f) {

            return f(this._value);
        }
    }, {
        key: "orElse",
        value: function orElse() {

            return this;
        }
    }, {
        key: "ap",
        value: function ap(either) {
            var _this2 = this;

            return either.map(function (fn) {
                return fn(_this2._value);
            });
        }
    }]);

    return Right;
}(Either);

var Left = exports.Left = function (_Either2) {
    _inherits(Left, _Either2);

    function Left() {
        _classCallCheck(this, Left);

        return _possibleConstructorReturn(this, (Left.__proto__ || Object.getPrototypeOf(Left)).apply(this, arguments));
    }

    _createClass(Left, [{
        key: "map",
        value: function map() {

            return this;
        }
    }, {
        key: "chain",
        value: function chain() {

            return this;
        }
    }, {
        key: "orElse",
        value: function orElse(f) {

            return f(this._value);
        }
    }, {
        key: "ap",
        value: function ap() {

            return this;
        }
    }]);

    return Left;
}(Either);

/**
 * right constructs a new Right type.
 * @param {*} value
 * @returns {Right}
 */


function right(value) {

    return new Right(value);
}

/**
 * left constructs a new Left type.
 * @param {*} value
 * @returns {Left}
 */
function left(value) {

    return new Left(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvbW9uYWQvRWl0aGVyLmpzIl0sIm5hbWVzIjpbInJpZ2h0IiwibGVmdCIsIkVpdGhlciIsInYiLCJfdmFsdWUiLCJjaGFpbiIsIngiLCJMZWZ0IiwiVHlwZUVycm9yIiwiY29uc3RydWN0b3IiLCJuYW1lIiwiUmlnaHQiLCJsIiwiciIsImYiLCJlaXRoZXIiLCJtYXAiLCJmbiIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQTRHZ0JBLEssR0FBQUEsSztRQVdBQyxJLEdBQUFBLEk7Ozs7Ozs7O0FBdkhoQjs7OztJQUlhQyxNLFdBQUFBLE07QUFFVCxvQkFBWUMsQ0FBWixFQUFlO0FBQUE7O0FBRVgsYUFBS0MsTUFBTCxHQUFjRCxDQUFkO0FBRUg7Ozs7K0JBRU07O0FBRUgsbUJBQU8sS0FBS0UsS0FBTCxDQUFXO0FBQUEsdUJBQUtDLENBQUw7QUFBQSxhQUFYLENBQVA7QUFFSDs7OytCQUVNOztBQUVILGdCQUFJLGdCQUFnQkMsSUFBcEIsRUFDSSxPQUFPLEtBQUtILE1BQVo7O0FBRUosa0JBQU0sSUFBSUksU0FBSixzQkFBaUMsS0FBS0MsV0FBTCxDQUFpQkMsSUFBbEQsZ0NBQU47QUFFSDs7O2dDQUVPOztBQUVKLGdCQUFJLGdCQUFnQkMsS0FBcEIsRUFDSSxPQUFPLEtBQUtQLE1BQVo7O0FBRUosa0JBQU0sSUFBSUksU0FBSix1QkFBa0MsS0FBS0MsV0FBTCxDQUFpQkMsSUFBbkQsaUNBQU47QUFFSDs7OzZCQUVJRSxDLEVBQUdDLEMsRUFBRzs7QUFFUCxtQkFBUSxnQkFBZ0JOLElBQWpCLEdBQXlCSyxFQUFFLEtBQUtSLE1BQVAsQ0FBekIsR0FBMENTLEVBQUUsS0FBS1QsTUFBUCxDQUFqRDtBQUVIOzs7Ozs7QUFJTDs7Ozs7SUFHYU8sSyxXQUFBQSxLOzs7Ozs7Ozs7Ozs0QkFFTEcsQyxFQUFHOztBQUVILG1CQUFPLElBQUlILEtBQUosQ0FBVUcsRUFBRSxLQUFLVixNQUFQLENBQVYsQ0FBUDtBQUVIOzs7OEJBRUtVLEMsRUFBRzs7QUFFTCxtQkFBT0EsRUFBRSxLQUFLVixNQUFQLENBQVA7QUFFSDs7O2lDQUVROztBQUVMLG1CQUFPLElBQVA7QUFFSDs7OzJCQUVFVyxNLEVBQVE7QUFBQTs7QUFFUCxtQkFBT0EsT0FBT0MsR0FBUCxDQUFXO0FBQUEsdUJBQU1DLEdBQUcsT0FBS2IsTUFBUixDQUFOO0FBQUEsYUFBWCxDQUFQO0FBRUg7Ozs7RUF4QnNCRixNOztJQTRCZEssSSxXQUFBQSxJOzs7Ozs7Ozs7Ozs4QkFFSDs7QUFFRixtQkFBTyxJQUFQO0FBRUg7OztnQ0FFTzs7QUFFSixtQkFBTyxJQUFQO0FBRUg7OzsrQkFFTU8sQyxFQUFHOztBQUVOLG1CQUFPQSxFQUFFLEtBQUtWLE1BQVAsQ0FBUDtBQUVIOzs7NkJBRUk7O0FBRUQsbUJBQU8sSUFBUDtBQUVIOzs7O0VBeEJxQkYsTTs7QUE0QjFCOzs7Ozs7O0FBS08sU0FBU0YsS0FBVCxDQUFla0IsS0FBZixFQUFzQjs7QUFFekIsV0FBTyxJQUFJUCxLQUFKLENBQVVPLEtBQVYsQ0FBUDtBQUVIOztBQUVEOzs7OztBQUtPLFNBQVNqQixJQUFULENBQWNpQixLQUFkLEVBQXFCOztBQUV4QixXQUFPLElBQUlYLElBQUosQ0FBU1csS0FBVCxDQUFQO0FBRUgiLCJmaWxlIjoiRWl0aGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFaXRoZXIgbW9uYWQuXG4gKiBAYWJzdHJhY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEVpdGhlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2KSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgam9pbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IHgpO1xuXG4gICAgfVxuXG4gICAgbGVmdCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIExlZnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRWl0aGVyI2xlZnQoKTogJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgaXMgbm90IGluc3RhbmNlIG9mIExlZnQhYCk7XG5cbiAgICB9XG5cbiAgICByaWdodCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFJpZ2h0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEVpdGhlciNyaWdodCgpOiAnJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9JyBpcyBub3QgaW5zdGFuY2Ugb2YgUmlnaHQhYCk7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KSA/IGwodGhpcy5fdmFsdWUpIDogcih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSaWdodCByZXByZXNlbnRzIHRoZSBjb3JyZWN0IHRoaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUmlnaHQgZXh0ZW5kcyBFaXRoZXIge1xuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJpZ2h0KGYodGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBhcChlaXRoZXIpIHtcblxuICAgICAgICByZXR1cm4gZWl0aGVyLm1hcChmbiA9PiBmbih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBMZWZ0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGNoYWluKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBhcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxufVxuXG4vKipcbiAqIHJpZ2h0IGNvbnN0cnVjdHMgYSBuZXcgUmlnaHQgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtSaWdodH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0KHZhbHVlKSB7XG5cbiAgICByZXR1cm4gbmV3IFJpZ2h0KHZhbHVlKTtcblxufVxuXG4vKipcbiAqIGxlZnQgY29uc3RydWN0cyBhIG5ldyBMZWZ0IHR5cGUuXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJucyB7TGVmdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlZnQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgTGVmdCh2YWx1ZSk7XG5cbn1cblxuXG4iXX0=
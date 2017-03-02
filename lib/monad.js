'use strict';

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
 * Identity
 * @param {*} value
 */
var Identity = exports.Identity = function () {
    function Identity(value) {
        _classCallCheck(this, Identity);

        this._value = value;
    }

    _createClass(Identity, [{
        key: 'map',
        value: function map(f) {

            return new Identity(f(this._value));
        }
    }, {
        key: 'chain',
        value: function chain(f) {

            return f(this._value);
        }
    }, {
        key: 'ap',
        value: function ap(m) {

            return m.map(this._value);
        }
    }], [{
        key: 'of',
        value: function of(v) {

            return new Identity(v);
        }
    }]);

    return Identity;
}();

/**
 * Maybe
 */


var Maybe = exports.Maybe = function () {
    function Maybe(v) {
        _classCallCheck(this, Maybe);

        this.value = v;
    }

    _createClass(Maybe, [{
        key: 'map',
        value: function map(f) {

            return Maybe.not(f(this.value));
        }
    }], [{
        key: 'not',
        value: function not(v) {

            return v == null ? new Nothing() : Maybe.of(v);
        }
    }, {
        key: 'of',
        value: function of(v) {

            return new Just(v);
        }
    }]);

    return Maybe;
}();

/**
 * Nothing
 */


var Nothing = exports.Nothing = function (_Maybe) {
    _inherits(Nothing, _Maybe);

    function Nothing() {
        _classCallCheck(this, Nothing);

        return _possibleConstructorReturn(this, (Nothing.__proto__ || Object.getPrototypeOf(Nothing)).apply(this, arguments));
    }

    _createClass(Nothing, [{
        key: 'chain',
        value: function chain() {

            return this;
        }
    }, {
        key: 'orElse',
        value: function orElse(f) {

            return f();
        }
    }, {
        key: 'just',
        value: function just() {

            throw new TypeError('just() is not implemented on Nothing!');
        }
    }, {
        key: 'cata',
        value: function cata(l, r) {

            return r();
        }
    }]);

    return Nothing;
}(Maybe);

/**
 * Just
 */


var Just = exports.Just = function (_Maybe2) {
    _inherits(Just, _Maybe2);

    function Just() {
        _classCallCheck(this, Just);

        return _possibleConstructorReturn(this, (Just.__proto__ || Object.getPrototypeOf(Just)).apply(this, arguments));
    }

    _createClass(Just, [{
        key: 'chain',
        value: function chain(f) {

            return this.value == null ? new Nothing() : f(this.value);
        }
    }, {
        key: 'orElse',
        value: function orElse(f) {

            return this.value == null ? f() : this;
        }
    }, {
        key: 'just',
        value: function just() {

            return this.value;
        }
    }, {
        key: 'cata',
        value: function cata(l, r) {

            return this.value == null ? l(this.value) : r(this.value);
        }
    }]);

    return Just;
}(Maybe);

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
        key: 'join',
        value: function join() {

            return this.chain(function (x) {
                return x;
            });
        }
    }, {
        key: 'left',
        value: function left() {

            if (this instanceof Left) return this._value;

            throw new TypeError('Either#left(): \'' + this.constructor.name + '\' is not instance of Left!');
        }
    }, {
        key: 'right',
        value: function right() {

            if (this instanceof Right) return this._value;

            throw new TypeError('Either#right(): \'' + this.constructor.name + '\' is not instance of Right!');
        }
    }, {
        key: 'cata',
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
        key: 'map',
        value: function map(f) {

            return new Right(f(this._value));
        }
    }, {
        key: 'chain',
        value: function chain(f) {

            return f(this._value);
        }
    }, {
        key: 'orElse',
        value: function orElse() {

            return this;
        }
    }, {
        key: 'ap',
        value: function ap(either) {
            var _this4 = this;

            return either.map(function (fn) {
                return fn(_this4._value);
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
        key: 'map',
        value: function map() {

            return this;
        }
    }, {
        key: 'chain',
        value: function chain() {

            return this;
        }
    }, {
        key: 'orElse',
        value: function orElse(f) {

            return f(this._value);
        }
    }, {
        key: 'ap',
        value: function ap() {

            return this;
        }
    }]);

    return Left;
}(Either);

var Reader = exports.Reader = function () {
    function Reader(f) {
        _classCallCheck(this, Reader);

        this._value = f;
    }

    _createClass(Reader, [{
        key: 'map',
        value: function map(f) {
            var _this6 = this;

            return new Reader(function (config) {
                return f(_this6.run(config));
            });
        }
    }, {
        key: 'chain',
        value: function chain() {
            var _this7 = this;

            return new Reader(function (config) {
                return _this7.run(config).run(config);
            });
        }
    }, {
        key: 'ap',
        value: function ap(reader) {
            var _this8 = this;

            reader.map(function (fn) {
                return fn(_this8._value);
            });
        }
    }, {
        key: 'run',
        value: function run(config) {

            return this._value(config);
        }
    }]);

    return Reader;
}();

/**
 * State is a monadic class that we use to hold information that changes
 * during compilation. It keeps the changes insolated from the
 * rest of the process until needed so we can have a 'pure' compilation.
 *
 * This implementation is influenced by:
 * @link https://en.wikipedia.org/wiki/Monad_(functional_programming)#State_monads
 * @param {*} value
 */


var State = exports.State = function () {
    function State(value) {
        _classCallCheck(this, State);

        this._value = value;
    }

    _createClass(State, [{
        key: 'map',
        value: function map(f) {
            var _this9 = this;

            return new State(function (s) {
                var _run = _this9.run(s),
                    value = _run.value,
                    state = _run.state;

                return { value: f(value), state: state };
            });
        }
    }, {
        key: 'join',
        value: function join() {
            var _this10 = this;

            return new State(function (s) {
                var _run2 = _this10.run(s),
                    value = _run2.value,
                    state = _run2.state;

                return value.run(state);
            });
        }
    }, {
        key: 'chain',
        value: function chain(f) {

            return this.map(f).join();
        }
    }, {
        key: 'evalState',
        value: function evalState(initState) {

            return this.run(initState).value;
        }
    }, {
        key: 'execState',
        value: function execState(initState) {

            return this.run(initState).state;
        }
    }, {
        key: 'run',
        value: function run(s) {

            return this._value(s);
        }
    }], [{
        key: 'unit',
        value: function unit(value) {

            return new State(function (state) {
                return { value: value, state: state };
            });
        }
    }, {
        key: 'get',
        value: function get() {

            return new State(function (state) {
                return { value: state, state: state };
            });
        }
    }, {
        key: 'put',
        value: function put(state) {

            return new State(function () {
                return { value: null, state: state };
            });
        }
    }, {
        key: 'modify',
        value: function modify(f) {

            return State.get().chain(function (state) {
                return State.put(f(state));
            });
        }
    }, {
        key: 'gets',
        value: function gets(f) {

            return State.get().chain(function (state) {
                return State.unit(f(state));
            });
        }
    }]);

    return State;
}();

/**
 * IO monadic type for containing interactions with the 'real world'.
 */


var IO = exports.IO = function () {
    function IO(f) {
        _classCallCheck(this, IO);

        this.f = f;
    }

    _createClass(IO, [{
        key: 'map',
        value: function map(f) {
            var _this11 = this;

            return new IO(function () {
                return f(_this11.f());
            });
        }
    }, {
        key: 'chain',
        value: function chain(f) {
            var _this12 = this;

            return new IO(function () {
                return f(_this12.f()).run();
            });
        }
    }, {
        key: 'ap',
        value: function ap(io) {
            var _this13 = this;

            return io.map(function (f) {
                return f(_this13.f());
            });
        }
    }, {
        key: 'run',
        value: function run() {
            return this.f();
        }
    }], [{
        key: 'of',
        value: function of(v) {

            return new IO(typeof v === 'function' ? v : function () {
                return v;
            });
        }
    }]);

    return IO;
}();

/**
 * Free
 */


var Free = exports.Free = function () {
    function Free() {
        _classCallCheck(this, Free);
    }

    _createClass(Free, [{
        key: 'map',
        value: function map(f) {

            return this.chain(function (x) {
                return new Return(f(x));
            });
        }
    }, {
        key: 'ap',
        value: function ap(f) {

            return this.chain(function (x) {
                return f.map(function (g) {
                    return g(x);
                });
            });
        }
    }], [{
        key: 'of',
        value: function of(a) {

            return new Return(a);
        }
    }, {
        key: 'liftF',
        value: function liftF(ftor) {

            return typeof ftor === 'function' ? new Suspend(function (x) {
                return new Return(ftor(x));
            }) : new Suspend(ftor.map(function (x) {
                return new Return(x);
            }));
        }
    }]);

    return Free;
}();

var Suspend = exports.Suspend = function (_Free) {
    _inherits(Suspend, _Free);

    function Suspend(ftor) {
        _classCallCheck(this, Suspend);

        var _this14 = _possibleConstructorReturn(this, (Suspend.__proto__ || Object.getPrototypeOf(Suspend)).call(this));

        _this14.ftor = ftor;

        return _this14;
    }

    _createClass(Suspend, [{
        key: 'chain',
        value: function chain(f) {
            var _this15 = this;

            return typeof this.ftor === 'function' ? new Suspend(function (x) {
                return _this15.ftor(x).chain(f);
            }) : new Suspend(this.ftor.map(function (free) {
                return free.chain(f);
            }));
        }
    }, {
        key: 'resume',
        value: function resume() {

            return left(this.ftor);
        }
    }, {
        key: 'go',
        value: function go(f) {

            var r = this.resume();

            while (r instanceof Left) {
                r = f(r.left()).resume();
            }return r.right();
        }
    }]);

    return Suspend;
}(Free);

var Return = exports.Return = function (_Free2) {
    _inherits(Return, _Free2);

    function Return(val) {
        _classCallCheck(this, Return);

        var _this16 = _possibleConstructorReturn(this, (Return.__proto__ || Object.getPrototypeOf(Return)).call(this));

        _this16.value = val;

        return _this16;
    }

    _createClass(Return, [{
        key: 'chain',
        value: function chain(f) {

            return f(this.value);
        }
    }, {
        key: 'resume',
        value: function resume() {

            return right(this.value);
        }
    }, {
        key: 'go',
        value: function go() {

            return this.value;
        }
    }]);

    return Return;
}(Free);

/**
 * identity returns an Identity monad with.
 * @param {*} value
 */


var identity = exports.identity = function identity(v) {
    return new Identity(v);
};

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

var state = exports.state = function state(value) {
    return State.unit(value);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb25hZC5qcyJdLCJuYW1lcyI6WyJyaWdodCIsImxlZnQiLCJJZGVudGl0eSIsInZhbHVlIiwiX3ZhbHVlIiwiZiIsIm0iLCJtYXAiLCJ2IiwiTWF5YmUiLCJub3QiLCJOb3RoaW5nIiwib2YiLCJKdXN0IiwiVHlwZUVycm9yIiwibCIsInIiLCJFaXRoZXIiLCJjaGFpbiIsIngiLCJMZWZ0IiwiY29uc3RydWN0b3IiLCJuYW1lIiwiUmlnaHQiLCJlaXRoZXIiLCJmbiIsIlJlYWRlciIsInJ1biIsImNvbmZpZyIsInJlYWRlciIsIlN0YXRlIiwicyIsInN0YXRlIiwiam9pbiIsImluaXRTdGF0ZSIsImdldCIsInB1dCIsInVuaXQiLCJJTyIsImlvIiwiRnJlZSIsIlJldHVybiIsImciLCJhIiwiZnRvciIsIlN1c3BlbmQiLCJmcmVlIiwicmVzdW1lIiwidmFsIiwiaWRlbnRpdHkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O1FBNGZnQkEsSyxHQUFBQSxLO1FBV0FDLEksR0FBQUEsSTs7Ozs7Ozs7QUF2Z0JoQjs7OztJQUlhQyxRLFdBQUFBLFE7QUFFVCxzQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUVmLGFBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUVIOzs7OzRCQVFHRSxDLEVBQUc7O0FBRUgsbUJBQU8sSUFBSUgsUUFBSixDQUFhRyxFQUFFLEtBQUtELE1BQVAsQ0FBYixDQUFQO0FBRUg7Ozs4QkFFS0MsQyxFQUFHOztBQUVMLG1CQUFPQSxFQUFFLEtBQUtELE1BQVAsQ0FBUDtBQUVIOzs7MkJBRUVFLEMsRUFBRzs7QUFFRixtQkFBT0EsRUFBRUMsR0FBRixDQUFNLEtBQUtILE1BQVgsQ0FBUDtBQUVIOzs7MkJBdEJTSSxDLEVBQUc7O0FBRVQsbUJBQU8sSUFBSU4sUUFBSixDQUFhTSxDQUFiLENBQVA7QUFFSDs7Ozs7O0FBc0JMOzs7OztJQUdhQyxLLFdBQUFBLEs7QUFFVCxtQkFBWUQsQ0FBWixFQUFlO0FBQUE7O0FBRVgsYUFBS0wsS0FBTCxH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dkMsQyxFQUFHOztBQUVGLGdCQUFJVyxJQUFJLEtBQUsrQixNQUFMLEVBQVI7O0FBRUEsbUJBQU8vQixhQUFhSSxJQUFwQjtBQUNJSixvQkFBS1gsRUFBRVcsRUFBRWYsSUFBRixFQUFGLENBQUQsQ0FBYzhDLE1BQWQsRUFBSjtBQURKLGFBR0EsT0FBTy9CLEVBQUVoQixLQUFGLEVBQVA7QUFFSDs7OztFQWhDd0J3QyxJOztJQW9DaEJDLE0sV0FBQUEsTTs7O0FBRVQsb0JBQVlPLEdBQVosRUFBaUI7QUFBQTs7QUFBQTs7QUFHYixnQkFBSzdDLEtBQUwsR0FBYTZDLEdBQWI7O0FBSGE7QUFLaEI7Ozs7OEJBRUszQyxDLEVBQUc7O0FBRUwsbUJBQU9BLEVBQUUsS0FBS0YsS0FBUCxDQUFQO0FBRUg7OztpQ0FFUTs7QUFFTCxtQkFBT0gsTUFBTSxLQUFLRyxLQUFYLENBQVA7QUFFSDs7OzZCQUVJOztBQUVELG1CQUFPLEtBQUtBLEtBQVo7QUFFSDs7OztFQXpCdUJxQyxJOztBQThCNUI7Ozs7OztBQUlPLElBQU1TLDhCQUFXLFNBQVhBLFFBQVc7QUFBQSxXQUFLLElBQUkvQyxRQUFKLENBQWFNLENBQWIsQ0FBTDtBQUFBLENBQWpCOztBQUVQOzs7OztBQUtPLFNBQVNSLEtBQVQsQ0FBZUcsS0FBZixFQUFzQjs7QUFFekIsV0FBTyxJQUFJb0IsS0FBSixDQUFVcEIsS0FBVixDQUFQO0FBRUg7O0FBRUQ7Ozs7O0FBS08sU0FBU0YsSUFBVCxDQUFjRSxLQUFkLEVBQXFCOztBQUV4QixXQUFPLElBQUlpQixJQUFKLENBQVNqQixLQUFULENBQVA7QUFFSDs7QUFFTSxJQUFNNkIsd0JBQVEsU0FBUkEsS0FBUSxDQUFDN0IsS0FBRDtBQUFBLFdBQ2pCMkIsTUFBTU8sSUFBTixDQUFXbEMsS0FBWCxDQURpQjtBQUFBLENBQWQiLCJmaWxlIjoibW9uYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIElkZW50aXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cbmV4cG9ydCBjbGFzcyBJZGVudGl0eSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSWRlbnRpdHkodik7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSWRlbnRpdHkoZih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIHJldHVybiBmKHRoaXMuX3ZhbHVlKTtcblxuICAgIH1cblxuICAgIGFwKG0pIHtcblxuICAgICAgICByZXR1cm4gbS5tYXAodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogTWF5YmVcbiAqL1xuZXhwb3J0IGNsYXNzIE1heWJlIHtcblxuICAgIGNvbnN0cnVjdG9yKHYpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdjtcblxuICAgIH1cblxuICAgIHN0YXRpYyBub3Qodikge1xuXG4gICAgICAgIHJldHVybiB2ID09IG51bGwgPyBuZXcgTm90aGluZygpIDogTWF5YmUub2Yodik7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSnVzdCh2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIE1heWJlLm5vdChmKHRoaXMudmFsdWUpKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE5vdGhpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGhpbmcgZXh0ZW5kcyBNYXliZSB7XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYoKTtcblxuICAgIH1cblxuICAgIGp1c3QoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignanVzdCgpIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiBOb3RoaW5nIScpO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuIHIoKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEp1c3RcbiAqL1xuZXhwb3J0IGNsYXNzIEp1c3QgZXh0ZW5kcyBNYXliZSB7XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gbnVsbCA/IG5ldyBOb3RoaW5nKCkgOiBmKHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsID8gZigpIDogdGhpcztcblxuICAgIH1cblxuICAgIGp1c3QoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsID8gbCh0aGlzLnZhbHVlKSA6IHIodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBFaXRoZXIgbW9uYWQuXG4gKiBAYWJzdHJhY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEVpdGhlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2KSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgam9pbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IHgpO1xuXG4gICAgfVxuXG4gICAgbGVmdCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIExlZnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRWl0aGVyI2xlZnQoKTogJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgaXMgbm90IGluc3RhbmNlIG9mIExlZnQhYCk7XG5cbiAgICB9XG5cbiAgICByaWdodCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFJpZ2h0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEVpdGhlciNyaWdodCgpOiAnJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9JyBpcyBub3QgaW5zdGFuY2Ugb2YgUmlnaHQhYCk7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KSA/IGwodGhpcy5fdmFsdWUpIDogcih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSaWdodCByZXByZXNlbnRzIHRoZSBjb3JyZWN0IHRoaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUmlnaHQgZXh0ZW5kcyBFaXRoZXIge1xuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJpZ2h0KGYodGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBhcChlaXRoZXIpIHtcblxuICAgICAgICByZXR1cm4gZWl0aGVyLm1hcChmbiA9PiBmbih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBMZWZ0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGNoYWluKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBhcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmVhZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGYpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IGY7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVhZGVyKGNvbmZpZyA9PlxuICAgICAgICAgICAgZih0aGlzLnJ1bihjb25maWcpKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlYWRlcihjb25maWcgPT5cbiAgICAgICAgICAgIHRoaXMucnVuKGNvbmZpZykucnVuKGNvbmZpZykpO1xuICAgIH1cblxuICAgIGFwKHJlYWRlcikge1xuXG4gICAgICAgIHJlYWRlci5tYXAoZm4gPT4gZm4odGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIHJ1bihjb25maWcpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUoY29uZmlnKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN0YXRlIGlzIGEgbW9uYWRpYyBjbGFzcyB0aGF0IHdlIHVzZSB0byBob2xkIGluZm9ybWF0aW9uIHRoYXQgY2hhbmdlc1xuICogZHVyaW5nIGNvbXBpbGF0aW9uLiBJdCBrZWVwcyB0aGUgY2hhbmdlcyBpbnNvbGF0ZWQgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgdGhlIHByb2Nlc3MgdW50aWwgbmVlZGVkIHNvIHdlIGNhbiBoYXZlIGEgJ3B1cmUnIGNvbXBpbGF0aW9uLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgaW5mbHVlbmNlZCBieTpcbiAqIEBsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01vbmFkXyhmdW5jdGlvbmFsX3Byb2dyYW1taW5nKSNTdGF0ZV9tb25hZHNcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIHN0YXRpYyB1bml0KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzdGF0ZSA9PiAoeyB2YWx1ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHN0YXRlID0+ICh7IHZhbHVlOiBzdGF0ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHB1dChzdGF0ZSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoKCkgPT4gKHsgdmFsdWU6IG51bGwsIHN0YXRlIH0pKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBtb2RpZnkoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUucHV0KGYoc3RhdGUpKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldHMoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUudW5pdChmKHN0YXRlKSkpXG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUocyA9PiB7XG4gICAgICAgICAgICBsZXQgeyB2YWx1ZSwgc3RhdGUgfSA9IHRoaXMucnVuKHMpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGYodmFsdWUpLCBzdGF0ZSB9O1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGpvaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzID0+IHtcbiAgICAgICAgICAgIGxldCB7IHZhbHVlLCBzdGF0ZSB9ID0gdGhpcy5ydW4ocyk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucnVuKHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKGYpLmpvaW4oKTtcblxuICAgIH1cblxuICAgIGV2YWxTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS52YWx1ZTtcblxuICAgIH1cblxuICAgIGV4ZWNTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS5zdGF0ZTtcblxuICAgIH1cblxuICAgIHJ1bihzKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlKHMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogSU8gbW9uYWRpYyB0eXBlIGZvciBjb250YWluaW5nIGludGVyYWN0aW9ucyB3aXRoIHRoZSAncmVhbCB3b3JsZCcuXG4gKi9cbmV4cG9ydCBjbGFzcyBJTyB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgdGhpcy5mID0gZjtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTyh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyA/IHYgOiAoKSA9PiB2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTygoKSA9PiBmKHRoaXMuZigpKSk7XG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSU8oKCkgPT4gZih0aGlzLmYoKSkucnVuKCkpO1xuICAgIH1cblxuICAgIGFwKGlvKSB7XG5cbiAgICAgICAgcmV0dXJuIGlvLm1hcChmID0+IGYodGhpcy5mKCkpKTtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmYoKVxuICAgIH1cblxufVxuXG4vKipcbiAqIEZyZWVcbiAqL1xuZXhwb3J0IGNsYXNzIEZyZWUge1xuXG4gICAgc3RhdGljIG9mKGEpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJldHVybihhKVxuXG4gICAgfVxuXG4gICAgc3RhdGljIGxpZnRGKGZ0b3IpIHtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIGZ0b3IgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgICAgbmV3IFN1c3BlbmQoeCA9PiBuZXcgUmV0dXJuKGZ0b3IoeCkpKSA6XG4gICAgICAgICAgICBuZXcgU3VzcGVuZChmdG9yLm1hcCh4ID0+IG5ldyBSZXR1cm4oeCkpKVxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW4oeCA9PiBuZXcgUmV0dXJuKGYoeCkpKTtcblxuICAgIH1cblxuICAgIGFwKGYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IGYubWFwKGcgPT4gZyh4KSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBTdXNwZW5kIGV4dGVuZHMgRnJlZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihmdG9yKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5mdG9yID0gZnRvcjtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gKHR5cGVvZiB0aGlzLmZ0b3IgPT09ICdmdW5jdGlvbicpID9cbiAgICAgICAgICAgIG5ldyBTdXNwZW5kKHggPT4gdGhpcy5mdG9yKHgpLmNoYWluKGYpKSA6XG4gICAgICAgICAgICBuZXcgU3VzcGVuZCh0aGlzLmZ0b3IubWFwKGZyZWUgPT4gZnJlZS5jaGFpbihmKSkpO1xuXG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuXG4gICAgICAgIHJldHVybiBsZWZ0KHRoaXMuZnRvcik7XG5cbiAgICB9XG5cbiAgICBnbyhmKSB7XG5cbiAgICAgICAgbGV0IHIgPSB0aGlzLnJlc3VtZSgpO1xuXG4gICAgICAgIHdoaWxlIChyIGluc3RhbmNlb2YgTGVmdClcbiAgICAgICAgICAgIHIgPSAoZihyLmxlZnQoKSkpLnJlc3VtZSgpO1xuXG4gICAgICAgIHJldHVybiByLnJpZ2h0KCk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFJldHVybiBleHRlbmRzIEZyZWUge1xuXG4gICAgY29uc3RydWN0b3IodmFsKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbDtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLnZhbHVlKTtcblxuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcblxuICAgICAgICByZXR1cm4gcmlnaHQodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBnbygpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxufVxuXG5cbi8qKlxuICogaWRlbnRpdHkgcmV0dXJucyBhbiBJZGVudGl0eSBtb25hZCB3aXRoLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5leHBvcnQgY29uc3QgaWRlbnRpdHkgPSB2ID0+IG5ldyBJZGVudGl0eSh2KTtcblxuLyoqXG4gKiByaWdodCBjb25zdHJ1Y3RzIGEgbmV3IFJpZ2h0IHR5cGUuXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJucyB7UmlnaHR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByaWdodCh2YWx1ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBSaWdodCh2YWx1ZSk7XG5cbn1cblxuLyoqXG4gKiBsZWZ0IGNvbnN0cnVjdHMgYSBuZXcgTGVmdCB0eXBlLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybnMge0xlZnR9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsZWZ0KHZhbHVlKSB7XG5cbiAgICByZXR1cm4gbmV3IExlZnQodmFsdWUpO1xuXG59XG5cbmV4cG9ydCBjb25zdCBzdGF0ZSA9ICh2YWx1ZSkgPT5cbiAgICBTdGF0ZS51bml0KHZhbHVlKTtcbiJdfQ==
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
    }]);

    return Identity;
}();

/**
 * Maybe
 */


var Maybe = exports.Maybe = function () {
    function Maybe() {
        _classCallCheck(this, Maybe);
    }

    _createClass(Maybe, null, [{
        key: 'not',
        value: function not(v) {

            return v == null ? new Nothing() : new Just(v);
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


var Nothing = exports.Nothing = function () {
    function Nothing() {
        _classCallCheck(this, Nothing);
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
}();

/**
 * Just
 */


var Just = exports.Just = function () {
    function Just(v) {
        _classCallCheck(this, Just);

        this.value = v;
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
}();

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
            var _this4 = this;

            return new Reader(function (config) {
                return f(_this4.run(config));
            });
        }
    }, {
        key: 'chain',
        value: function chain() {
            var _this5 = this;

            return new Reader(function (config) {
                return _this5.run(config).run(config);
            });
        }
    }, {
        key: 'ap',
        value: function ap(reader) {
            var _this6 = this;

            reader.map(function (fn) {
                return fn(_this6._value);
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
            var _this7 = this;

            return new State(function (s) {
                var _run = _this7.run(s),
                    value = _run.value,
                    state = _run.state;

                return { value: f(value), state: state };
            });
        }
    }, {
        key: 'join',
        value: function join() {
            var _this8 = this;

            return new State(function (s) {
                var _run2 = _this8.run(s),
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
            var _this9 = this;

            return new IO(function () {
                return f(_this9.f());
            });
        }
    }, {
        key: 'chain',
        value: function chain(f) {
            var _this10 = this;

            return new IO(function () {
                return f(_this10.f()).run();
            });
        }
    }, {
        key: 'ap',
        value: function ap(io) {
            var _this11 = this;

            return io.map(function (f) {
                return f(_this11.f());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb25hZC5qcyJdLCJuYW1lcyI6WyJyaWdodCIsImxlZnQiLCJJZGVudGl0eSIsInZhbHVlIiwiX3ZhbHVlIiwiZiIsIm0iLCJtYXAiLCJNYXliZSIsInYiLCJOb3RoaW5nIiwiSnVzdCIsIlR5cGVFcnJvciIsImwiLCJyIiwiRWl0aGVyIiwiY2hhaW4iLCJ4IiwiTGVmdCIsIlJpZ2h0IiwiZWl0aGVyIiwiZm4iLCJSZWFkZXIiLCJydW4iLCJjb25maWciLCJyZWFkZXIiLCJTdGF0ZSIsInMiLCJzdGF0ZSIsImpvaW4iLCJpbml0U3RhdGUiLCJnZXQiLCJwdXQiLCJ1bml0IiwiSU8iLCJpbyIsImlkZW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7OztRQTRYZ0JBLEssR0FBQUEsSztRQWFBQyxJLEdBQUFBLEk7Ozs7Ozs7O0FBelloQjs7OztJQUlhQyxRLFdBQUFBLFE7QUFFVCxzQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUVmLGFBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUVIOzs7OzRCQUVHRSxDLEVBQUc7O0FBRUgsbUJBQU8sSUFBSUgsUUFBSixDQUFhRyxFQUFFLEtBQUtELE1BQVAsQ0FBYixDQUFQO0FBRUg7Ozs4QkFFS0MsQyxFQUFHOztBQUVMLG1CQUFPQSxFQUFFLEtBQUtELE1BQVAsQ0FBUDtBQUVIOzs7MkJBRUVFLEMsRUFBRzs7QUFFRixtQkFBT0EsRUFBRUMsR0FBRixDQUFNLEtBQUtILE1BQVgsQ0FBUDtBQUVIOzs7Ozs7QUFJTDs7Ozs7SUFHYUksSyxXQUFBQSxLOzs7Ozs7OzRCQUVFQyxDLEVBQUc7O0FBRVYsbUJBQU9BLEtBQUssSUFBTCxHQUFZLElBQUlDLE9BQUosRUFBWixHQUE0QixJQUFJQyxJQUFKLENBQVNGLENBQVQsQ0FBbkM7QUFFSDs7OzJCQUVTQSxDLEVBQUc7O0FBRVQsbUJBQU8sSUFBSUUsSUFBSixDQUFTRixDQUFULENBQVA7QUFFSDs7Ozs7O0FBSUw7Ozs7O0lBR2FDLE8sV0FBQUEsTzs7Ozs7OztnQ0FF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OztBQUVILG1CQUFPQSxHQUFHNUIsR0FBSCxDQUFPO0FBQUEsdUJBQUtGLEVBQUUsUUFBS0EsQ0FBTCxFQUFGLENBQUw7QUFBQSxhQUFQLENBQVA7QUFDSDs7OzhCQUVLO0FBQ0YsbUJBQU8sS0FBS0EsQ0FBTCxFQUFQO0FBQ0g7OzsyQkF2QlNJLEMsRUFBRzs7QUFFVCxtQkFBTyxJQUFJeUIsRUFBSixDQUFPLE9BQU96QixDQUFQLEtBQWEsVUFBYixHQUEwQkEsQ0FBMUIsR0FBOEI7QUFBQSx1QkFBTUEsQ0FBTjtBQUFBLGFBQXJDLENBQVA7QUFFSDs7Ozs7O0FBdUJMOzs7Ozs7QUFJTyxJQUFNMkIsOEJBQVcsU0FBWEEsUUFBVztBQUFBLFdBQUssSUFBSWxDLFFBQUosQ0FBYU8sQ0FBYixDQUFMO0FBQUEsQ0FBakI7O0FBRVA7Ozs7O0FBS08sU0FBU1QsS0FBVCxDQUFlRyxLQUFmLEVBQXNCOztBQUV6QixXQUFPLElBQUlnQixLQUFKLENBQVVoQixLQUFWLENBQVA7QUFFSDs7QUFJRDs7Ozs7QUFLTyxTQUFTRixJQUFULENBQWNFLEtBQWQsRUFBcUI7O0FBRXhCLFdBQU8sSUFBSWUsSUFBSixDQUFTZixLQUFULENBQVA7QUFFSDs7QUFFTSxJQUFNeUIsd0JBQVEsU0FBUkEsS0FBUSxDQUFDekIsS0FBRDtBQUFBLFdBQ2pCdUIsTUFBTU8sSUFBTixDQUFXOUIsS0FBWCxDQURpQjtBQUFBLENBQWQiLCJmaWxlIjoibW9uYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIElkZW50aXR5XG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cbmV4cG9ydCBjbGFzcyBJZGVudGl0eSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSWRlbnRpdHkoZih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIHJldHVybiBmKHRoaXMuX3ZhbHVlKTtcblxuICAgIH1cblxuICAgIGFwKG0pIHtcblxuICAgICAgICByZXR1cm4gbS5tYXAodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogTWF5YmVcbiAqL1xuZXhwb3J0IGNsYXNzIE1heWJlIHtcblxuICAgIHN0YXRpYyBub3Qodikge1xuXG4gICAgICAgIHJldHVybiB2ID09IG51bGwgPyBuZXcgTm90aGluZygpIDogbmV3IEp1c3Qodik7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSnVzdCh2KTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE5vdGhpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGhpbmcge1xuXG4gICAgY2hhaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoZikge1xuXG4gICAgICAgIHJldHVybiBmKCk7XG5cbiAgICB9XG5cbiAgICBqdXN0KCkge1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2p1c3QoKSBpcyBub3QgaW1wbGVtZW50ZWQgb24gTm90aGluZyEnKTtcblxuICAgIH1cblxuICAgIGNhdGEobCwgcikge1xuXG4gICAgICAgIHJldHVybiByKCk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBKdXN0XG4gKi9cbmV4cG9ydCBjbGFzcyBKdXN0IHtcblxuICAgIGNvbnN0cnVjdG9yKHYpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdjtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsID8gbmV3IE5vdGhpbmcoKSA6IGYodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09IG51bGwgPyBmKCkgOiB0aGlzO1xuXG4gICAgfVxuXG4gICAganVzdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxuICAgIGNhdGEobCwgcikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09IG51bGwgPyBsKHRoaXMudmFsdWUpIDogcih0aGlzLnZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEVpdGhlciBtb25hZC5cbiAqIEBhYnN0cmFjdFxuICovXG5leHBvcnQgY2xhc3MgRWl0aGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHYpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IHY7XG5cbiAgICB9XG5cbiAgICBqb2luKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluKHggPT4geCk7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KSA/IGwodGhpcy5fdmFsdWUpIDogcih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSaWdodCByZXByZXNlbnRzIHRoZSBjb3JyZWN0IHRoaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUmlnaHQgZXh0ZW5kcyBFaXRoZXIge1xuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJpZ2h0KGYodGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBhcChlaXRoZXIpIHtcblxuICAgICAgICByZXR1cm4gZWl0aGVyLm1hcChmbiA9PiBmbih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBMZWZ0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGNoYWluKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBhcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmVhZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGYpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IGY7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVhZGVyKGNvbmZpZyA9PlxuICAgICAgICAgICAgZih0aGlzLnJ1bihjb25maWcpKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlYWRlcihjb25maWcgPT5cbiAgICAgICAgICAgIHRoaXMucnVuKGNvbmZpZykucnVuKGNvbmZpZykpO1xuICAgIH1cblxuICAgIGFwKHJlYWRlcikge1xuXG4gICAgICAgIHJlYWRlci5tYXAoZm4gPT4gZm4odGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIHJ1bihjb25maWcpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUoY29uZmlnKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFN0YXRlIGlzIGEgbW9uYWRpYyBjbGFzcyB0aGF0IHdlIHVzZSB0byBob2xkIGluZm9ybWF0aW9uIHRoYXQgY2hhbmdlc1xuICogZHVyaW5nIGNvbXBpbGF0aW9uLiBJdCBrZWVwcyB0aGUgY2hhbmdlcyBpbnNvbGF0ZWQgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgdGhlIHByb2Nlc3MgdW50aWwgbmVlZGVkIHNvIHdlIGNhbiBoYXZlIGEgJ3B1cmUnIGNvbXBpbGF0aW9uLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgaW5mbHVlbmNlZCBieTpcbiAqIEBsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01vbmFkXyhmdW5jdGlvbmFsX3Byb2dyYW1taW5nKSNTdGF0ZV9tb25hZHNcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIHN0YXRpYyB1bml0KHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzdGF0ZSA9PiAoeyB2YWx1ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHN0YXRlID0+ICh7IHZhbHVlOiBzdGF0ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHB1dChzdGF0ZSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoKCkgPT4gKHsgdmFsdWU6IG51bGwsIHN0YXRlIH0pKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBtb2RpZnkoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUucHV0KGYoc3RhdGUpKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldHMoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUudW5pdChmKHN0YXRlKSkpXG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUocyA9PiB7XG4gICAgICAgICAgICBsZXQgeyB2YWx1ZSwgc3RhdGUgfSA9IHRoaXMucnVuKHMpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGYodmFsdWUpLCBzdGF0ZSB9O1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGpvaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzID0+IHtcbiAgICAgICAgICAgIGxldCB7IHZhbHVlLCBzdGF0ZSB9ID0gdGhpcy5ydW4ocyk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucnVuKHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKGYpLmpvaW4oKTtcblxuICAgIH1cblxuICAgIGV2YWxTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS52YWx1ZTtcblxuICAgIH1cblxuICAgIGV4ZWNTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS5zdGF0ZTtcblxuICAgIH1cblxuICAgIHJ1bihzKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlKHMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogSU8gbW9uYWRpYyB0eXBlIGZvciBjb250YWluaW5nIGludGVyYWN0aW9ucyB3aXRoIHRoZSAncmVhbCB3b3JsZCcuXG4gKi9cbmV4cG9ydCBjbGFzcyBJTyB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgdGhpcy5mID0gZjtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTyh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyA/IHYgOiAoKSA9PiB2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTygoKSA9PiBmKHRoaXMuZigpKSk7XG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSU8oKCkgPT4gZih0aGlzLmYoKSkucnVuKCkpO1xuICAgIH1cblxuICAgIGFwKGlvKSB7XG5cbiAgICAgICAgcmV0dXJuIGlvLm1hcChmID0+IGYodGhpcy5mKCkpKTtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmYoKVxuICAgIH1cblxufVxuXG4vKipcbiAqIGlkZW50aXR5IHJldHVybnMgYW4gSWRlbnRpdHkgbW9uYWQgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gdiA9PiBuZXcgSWRlbnRpdHkodik7XG5cbi8qKlxuICogcmlnaHQgY29uc3RydWN0cyBhIG5ldyBSaWdodCB0eXBlLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybnMge1JpZ2h0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmlnaHQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgUmlnaHQodmFsdWUpO1xuXG59XG5cblxuXG4vKipcbiAqIGxlZnQgY29uc3RydWN0cyBhIG5ldyBMZWZ0IHR5cGUuXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJucyB7TGVmdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlZnQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgTGVmdCh2YWx1ZSk7XG5cbn1cblxuZXhwb3J0IGNvbnN0IHN0YXRlID0gKHZhbHVlKSA9PlxuICAgIFN0YXRlLnVuaXQodmFsdWUpO1xuIl19
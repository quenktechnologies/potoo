'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.liftF = exports.state = exports.identity = exports.Return = exports.Suspend = exports.Free = exports.IO = exports.State = exports.Writer = exports.Reader = exports.Left = exports.Right = exports.Either = exports.Just = exports.Nothing = exports.Maybe = exports.Identity = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.right = right;
exports.left = left;

var _util = require('./util');

var _be = require('./be');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _check = function _check(key, check) {
    return function (value) {
        return (0, _be.hope)(key, value, check);
    };
};

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
        key: 'orJust',
        value: function orJust(v) {

            return this instanceof Nothing ? new Just(v) : this;
        }
    }], [{
        key: 'not',
        value: function not(v) {

            return v == null ? new Nothing() : Maybe.of(v);
        }
    }, {
        key: 'lift',
        value: function lift(v) {

            return Maybe.not(v);
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

            return new Just(f());
        }
    }, {
        key: 'extract',
        value: function extract() {

            throw new TypeError('just() is not implemented on Nothing!');
        }
    }, {
        key: 'cata',
        value: function cata(l, r) {

            return l();
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
        key: 'map',
        value: function map(f) {

            return Maybe.not(f(this.value));
        }
    }, {
        key: 'chain',
        value: function chain(f) {

            return f(this.value);
        }
    }, {
        key: 'orElse',
        value: function orElse(f) {

            return this;
        }
    }, {
        key: 'extract',
        value: function extract() {

            return this.value;
        }
    }, {
        key: 'cata',
        value: function cata(l, r) {

            return r(this.value);
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
 * Writer
 */


var Writer = exports.Writer = function () {
    function Writer(value) {
        var log = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

        _classCallCheck(this, Writer);

        this.value = [value, log];
    }

    _createClass(Writer, [{
        key: 'map',
        value: function map(f) {
            var _runWriter = this.runWriter(),
                v = _runWriter.v,
                l = _runWriter.l;

            var _f = f(v),
                v1 = _f.v1,
                l2 = _f.l2;

            return new Writer(v1, l.concat(l2));
        }
    }, {
        key: 'chain',
        value: function chain(f) {
            var _runWriter2 = this.runWriter(),
                v = _runWriter2.v,
                l = _runWriter2.l;

            var _f$runWriter = f(v).runWriter(),
                v1 = _f$runWriter.v1,
                l1 = _f$runWriter.l1;

            return new Writer(v1, l.concat(l1));
        }
    }, {
        key: 'runWriter',
        value: function runWriter() {

            return this.value;
        }
    }], [{
        key: 'of',
        value: function of(v) {

            return new Writer(v);
        }
    }]);

    return Writer;
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
        key: 'of',
        value: function of(value) {

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
                return State.of(f(state));
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

            (0, _util.isFunction)(f);

            return new IO(function () {
                return f(_this11.f());
            });
        }
    }, {
        key: 'chain',
        value: function chain(f) {
            var _this12 = this;

            (0, _util.isFunction)(f);
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

            (0, _util.isFunction)(f);

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

            (0, _util.isFunction)(f);

            return typeof this.ftor === 'function' ? new Suspend(function (x) {
                return _this15.ftor(x).chain(f);
            }) : new Suspend(this.ftor.map(_check('free', (0, _be.type)(Free))).map(function (free) {
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

            (0, _util.isFunction)(f);

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
    return State.of(value);
};

var liftF = exports.liftF = Free.liftF;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb25hZC5qcyJdLCJuYW1lcyI6WyJyaWdodCIsImxlZnQiLCJfY2hlY2siLCJrZXkiLCJjaGVjayIsInZhbHVlIiwiSWRlbnRpdHkiLCJfdmFsdWUiLCJmIiwibSIsIm1hcCIsInYiLCJNYXliZSIsIk5vdGhpbmciLCJKdXN0Iiwib2YiLCJub3QiLCJUeXBlRXJyb3IiLCJsIiwiciIsIkVpdGhlciIsImNoYWluIiwieCIsIkxlZnQiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJSaWdodCIsImVpdGhlciIsImZuIiwiUmVhZGVyIiwicnVuIiwiY29uZmlnIiwicmVhZGVyIiwiV3JpdGVyIiwibG9nIiwicnVuV3JpdGVyIiwidjEiLCJsMiIsImNvbmNhdCIsImwxIiwiU3RhdGUiLCJzIiwic3RhdGUiLCJqb2luIiwiaW5pdFN0YXRlIiwiZ2V0IiwicHV0IiwiSU8iLCJpbyIsIkZyZWUiLCJSZXR1cm4iLCJnIiwiYSIsImZ0b3IiLCJTdXNwZW5kIiwiZnJlZSIsInJlc3VtZSIsInZhbCIsImlkZW50aXR5IiwibGlmdEYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztRQW1sQmdCQSxLLEdBQUFBLEs7UUFXQUMsSSxHQUFBQSxJOztBQTlsQmhCOztBQUNBOzs7Ozs7OztBQUVBLElBQU1DLFNBQVMsU0FBVEEsTUFBUyxDQUFDQyxHQUFELEVBQU1DLEtBQU47QUFBQSxXQUFnQjtBQUFBLGVBQVMsY0FBS0QsR0FBTCxFQUFVRSxLQUFWLEVBQWlCRCxLQUFqQixDQUFUO0FBQUEsS0FBaEI7QUFBQSxDQUFmOztBQUVBOzs7OztJQUlhRSxRLFdBQUFBLFE7QUFFVCxzQkFBWUQsS0FBWixFQUFtQjtBQUFBOztBQUVmLGFBQUtFLE1BQUwsR0FBY0YsS0FBZDtBQUVIOzs7OzRCQVFHRyxDLEVBQUc7O0FBRUgsbUJBQU8sSUFBSUYsUUFBSixDQUFhRSxFQUFFLEtBQUtELE1BQVAsQ0FBYixDQUFQO0FBRUg7Ozs4QkFFS0MsQyxFQUFHOztBQUVMLG1CQUFPQSxFQUFFLEtB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LElBQUlxQixLQUFKLENBQVVyQixLQUFWLENBQVA7QUFFSDs7QUFFRDs7Ozs7QUFLTyxTQUFTSixJQUFULENBQWNJLEtBQWQsRUFBcUI7O0FBRXhCLFdBQU8sSUFBSWtCLElBQUosQ0FBU2xCLEtBQVQsQ0FBUDtBQUVIOztBQUVNLElBQU1xQyx3QkFBUSxTQUFSQSxLQUFRLENBQUNyQyxLQUFEO0FBQUEsV0FDakJtQyxNQUFNekIsRUFBTixDQUFTVixLQUFULENBRGlCO0FBQUEsQ0FBZDs7QUFHQSxJQUFNc0Qsd0JBQVFWLEtBQUtVLEtBQW5CIiwiZmlsZSI6Im1vbmFkLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQgeyB0eXBlLCBob3BlIH0gZnJvbSAnLi9iZSc7XG5cbmNvbnN0IF9jaGVjayA9IChrZXksIGNoZWNrKSA9PiB2YWx1ZSA9PiBob3BlKGtleSwgdmFsdWUsIGNoZWNrKTtcblxuLyoqXG4gKiBJZGVudGl0eVxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5leHBvcnQgY2xhc3MgSWRlbnRpdHkge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG9mKHYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElkZW50aXR5KHYpO1xuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElkZW50aXR5KGYodGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBhcChtKSB7XG5cbiAgICAgICAgcmV0dXJuIG0ubWFwKHRoaXMuX3ZhbHVlKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIE1heWJlXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXliZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2KSB7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IHY7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgbm90KHYpIHtcblxuICAgICAgICByZXR1cm4gdiA9PSBudWxsID8gbmV3IE5vdGhpbmcoKSA6IE1heWJlLm9mKHYpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGxpZnQodikge1xuXG4gICAgICAgIHJldHVybiBNYXliZS5ub3Qodik7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSnVzdCh2KTtcblxuICAgIH1cblxuICAgIG9ySnVzdCh2KSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBOb3RoaW5nID8gbmV3IEp1c3QodikgOiB0aGlzO1xuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBOb3RoaW5nXG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RoaW5nIGV4dGVuZHMgTWF5YmUge1xuXG5cblxuICAgIG1hcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGNoYWluKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IEp1c3QoZigpKTtcblxuICAgIH1cblxuICAgIGV4dHJhY3QoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignanVzdCgpIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiBOb3RoaW5nIScpO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuIGwoKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEp1c3RcbiAqL1xuZXhwb3J0IGNsYXNzIEp1c3QgZXh0ZW5kcyBNYXliZSB7XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBNYXliZS5ub3QoZih0aGlzLnZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgZXh0cmFjdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxuICAgIGNhdGEobCwgcikge1xuXG4gICAgICAgIHJldHVybiByKHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRWl0aGVyIG1vbmFkLlxuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBFaXRoZXIge1xuXG4gICAgY29uc3RydWN0b3Iodikge1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdjtcblxuICAgIH1cblxuICAgIGpvaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW4oeCA9PiB4KTtcblxuICAgIH1cblxuICAgIGxlZnQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEVpdGhlciNsZWZ0KCk6ICcke3RoaXMuY29uc3RydWN0b3IubmFtZX0nIGlzIG5vdCBpbnN0YW5jZSBvZiBMZWZ0IWApO1xuXG4gICAgfVxuXG4gICAgcmlnaHQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBSaWdodClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFaXRoZXIjcmlnaHQoKTogJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgaXMgbm90IGluc3RhbmNlIG9mIFJpZ2h0IWApO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzIGluc3RhbmNlb2YgTGVmdCkgPyBsKHRoaXMuX3ZhbHVlKSA6IHIodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogUmlnaHQgcmVwcmVzZW50cyB0aGUgY29ycmVjdCB0aGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJpZ2h0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSaWdodChmKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgYXAoZWl0aGVyKSB7XG5cbiAgICAgICAgcmV0dXJuIGVpdGhlci5tYXAoZm4gPT4gZm4odGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgTGVmdCBleHRlbmRzIEVpdGhlciB7XG5cbiAgICBtYXAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgYXAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFJlYWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSBmO1xuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlYWRlcihjb25maWcgPT5cbiAgICAgICAgICAgIGYodGhpcy5ydW4oY29uZmlnKSkpO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZWFkZXIoY29uZmlnID0+XG4gICAgICAgICAgICB0aGlzLnJ1bihjb25maWcpLnJ1bihjb25maWcpKTtcbiAgICB9XG5cbiAgICBhcChyZWFkZXIpIHtcblxuICAgICAgICByZWFkZXIubWFwKGZuID0+IGZuKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBydW4oY29uZmlnKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlKGNvbmZpZyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBXcml0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFdyaXRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgbG9nID0gW10pIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gW3ZhbHVlLCBsb2ddO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG9mKHYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFdyaXRlcih2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgbGV0IHsgdiwgbCB9ID0gdGhpcy5ydW5Xcml0ZXIoKTtcbiAgICAgICAgbGV0IHsgdjEsIGwyIH0gPSBmKHYpO1xuXG4gICAgICAgIHJldHVybiBuZXcgV3JpdGVyKHYxLCBsLmNvbmNhdChsMikpO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIGxldCB7IHYsIGwgfSA9IHRoaXMucnVuV3JpdGVyKCk7XG4gICAgICAgIGxldCB7IHYxLCBsMSB9ID0gZih2KS5ydW5Xcml0ZXIoKTtcblxuICAgICAgICByZXR1cm4gbmV3IFdyaXRlcih2MSwgbC5jb25jYXQobDEpKTtcblxuICAgIH1cblxuICAgIHJ1bldyaXRlcigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxuXG59XG5cbi8qKlxuICogU3RhdGUgaXMgYSBtb25hZGljIGNsYXNzIHRoYXQgd2UgdXNlIHRvIGhvbGQgaW5mb3JtYXRpb24gdGhhdCBjaGFuZ2VzXG4gKiBkdXJpbmcgY29tcGlsYXRpb24uIEl0IGtlZXBzIHRoZSBjaGFuZ2VzIGluc29sYXRlZCBmcm9tIHRoZVxuICogcmVzdCBvZiB0aGUgcHJvY2VzcyB1bnRpbCBuZWVkZWQgc28gd2UgY2FuIGhhdmUgYSAncHVyZScgY29tcGlsYXRpb24uXG4gKlxuICogVGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBpbmZsdWVuY2VkIGJ5OlxuICogQGxpbmsgaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvTW9uYWRfKGZ1bmN0aW9uYWxfcHJvZ3JhbW1pbmcpI1N0YXRlX21vbmFkc1xuICogQHBhcmFtIHsqfSB2YWx1ZVxuICovXG5leHBvcnQgY2xhc3MgU3RhdGUge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG9mKHZhbHVlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzdGF0ZSA9PiAoeyB2YWx1ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIGdldCgpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHN0YXRlID0+ICh7IHZhbHVlOiBzdGF0ZSwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIHB1dChzdGF0ZSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoKCkgPT4gKHsgdmFsdWU6IG51bGwsIHN0YXRlIH0pKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBtb2RpZnkoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUucHV0KGYoc3RhdGUpKSk7XG4gICAgfVxuXG4gICAgc3RhdGljIGdldHMoZikge1xuXG4gICAgICAgIHJldHVybiBTdGF0ZS5nZXQoKS5jaGFpbihzdGF0ZSA9PlxuICAgICAgICAgICAgU3RhdGUub2YoZihzdGF0ZSkpKVxuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHMgPT4ge1xuICAgICAgICAgICAgbGV0IHsgdmFsdWUsIHN0YXRlIH0gPSB0aGlzLnJ1bihzKTtcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBmKHZhbHVlKSwgc3RhdGUgfTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBqb2luKCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUocyA9PiB7XG4gICAgICAgICAgICBsZXQgeyB2YWx1ZSwgc3RhdGUgfSA9IHRoaXMucnVuKHMpO1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnJ1bihzdGF0ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLm1hcChmKS5qb2luKCk7XG5cbiAgICB9XG5cbiAgICBldmFsU3RhdGUoaW5pdFN0YXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucnVuKGluaXRTdGF0ZSkudmFsdWU7XG5cbiAgICB9XG5cbiAgICBleGVjU3RhdGUoaW5pdFN0YXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMucnVuKGluaXRTdGF0ZSkuc3RhdGU7XG5cbiAgICB9XG5cbiAgICBydW4ocykge1xuXG4gICAgICAgIHJldHVybiB0aGlzLl92YWx1ZShzKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIElPIG1vbmFkaWMgdHlwZSBmb3IgY29udGFpbmluZyBpbnRlcmFjdGlvbnMgd2l0aCB0aGUgJ3JlYWwgd29ybGQnLlxuICovXG5leHBvcnQgY2xhc3MgSU8ge1xuXG4gICAgY29uc3RydWN0b3IoZikge1xuXG4gICAgICAgIHRoaXMuZiA9IGY7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSU8odHlwZW9mIHYgPT09ICdmdW5jdGlvbicgPyB2IDogKCkgPT4gdik7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIGlzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTygoKSA9PiBmKHRoaXMuZigpKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgaXNGdW5jdGlvbihmKTtcbiAgICAgICAgcmV0dXJuIG5ldyBJTygoKSA9PiBmKHRoaXMuZigpKS5ydW4oKSk7XG5cbiAgICB9XG5cbiAgICBhcChpbykge1xuXG4gICAgICAgIHJldHVybiBpby5tYXAoZiA9PiBmKHRoaXMuZigpKSk7XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5mKClcbiAgICB9XG5cbn1cblxuLyoqXG4gKiBGcmVlXG4gKi9cbmV4cG9ydCBjbGFzcyBGcmVlIHtcblxuICAgIHN0YXRpYyBvZihhKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZXR1cm4oYSlcblxuICAgIH1cblxuICAgIHN0YXRpYyBsaWZ0RihmdG9yKSB7XG5cbiAgICAgICAgcmV0dXJuIHR5cGVvZiBmdG9yID09PSAnZnVuY3Rpb24nID9cbiAgICAgICAgICAgIG5ldyBTdXNwZW5kKHggPT4gbmV3IFJldHVybihmdG9yKHgpKSkgOlxuICAgICAgICAgICAgbmV3IFN1c3BlbmQoZnRvci5tYXAoeCA9PiBuZXcgUmV0dXJuKHgpKSlcbiAgICB9XG5cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgaXNGdW5jdGlvbihmKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IG5ldyBSZXR1cm4oZih4KSkpO1xuXG4gICAgfVxuXG4gICAgYXAoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluKHggPT4gZi5tYXAoZyA9PiBnKHgpKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFN1c3BlbmQgZXh0ZW5kcyBGcmVlIHtcblxuICAgIGNvbnN0cnVjdG9yKGZ0b3IpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZ0b3IgPSBmdG9yO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIGlzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdGhpcy5mdG9yID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICBuZXcgU3VzcGVuZCh4ID0+XG4gICAgICAgICAgICAgICAgdGhpcy5mdG9yKHgpLmNoYWluKGYpKSA6XG4gICAgICAgICAgICBuZXcgU3VzcGVuZChcbiAgICAgICAgICAgICAgICB0aGlzXG4gICAgICAgICAgICAgICAgLmZ0b3JcbiAgICAgICAgICAgICAgICAubWFwKF9jaGVjaygnZnJlZScsIHR5cGUoRnJlZSkpKVxuICAgICAgICAgICAgICAgIC5tYXAoZnJlZSA9PiBmcmVlLmNoYWluKGYpKSk7XG5cbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxlZnQodGhpcy5mdG9yKTtcblxuICAgIH1cblxuICAgIGdvKGYpIHtcblxuICAgICAgICBsZXQgciA9IHRoaXMucmVzdW1lKCk7XG5cbiAgICAgICAgd2hpbGUgKHIgaW5zdGFuY2VvZiBMZWZ0KVxuICAgICAgICAgICAgciA9IChmKHIubGVmdCgpKSkucmVzdW1lKCk7XG5cbiAgICAgICAgcmV0dXJuIHIucmlnaHQoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmV0dXJuIGV4dGVuZHMgRnJlZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWwpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIGlzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHJpZ2h0KHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG4gICAgZ28oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG5cbiAgICB9XG5cbn1cblxuXG4vKipcbiAqIGlkZW50aXR5IHJldHVybnMgYW4gSWRlbnRpdHkgbW9uYWQgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gdiA9PiBuZXcgSWRlbnRpdHkodik7XG5cbi8qKlxuICogcmlnaHQgY29uc3RydWN0cyBhIG5ldyBSaWdodCB0eXBlLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybnMge1JpZ2h0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmlnaHQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgUmlnaHQodmFsdWUpO1xuXG59XG5cbi8qKlxuICogbGVmdCBjb25zdHJ1Y3RzIGEgbmV3IExlZnQgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtMZWZ0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVmdCh2YWx1ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBMZWZ0KHZhbHVlKTtcblxufVxuXG5leHBvcnQgY29uc3Qgc3RhdGUgPSAodmFsdWUpID0+XG4gICAgU3RhdGUub2YodmFsdWUpO1xuXG5leHBvcnQgY29uc3QgbGlmdEYgPSBGcmVlLmxpZnRGO1xuIl19
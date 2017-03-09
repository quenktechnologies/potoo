'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.right = right;
exports.left = left;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _isFunction = function _isFunction(f) {

    if (typeof f !== 'function') throw new TypeError('Expected function got ' + ('(' + (typeof f === 'undefined' ? 'undefined' : _typeof(f)) + ') \'' + (f ? f.constructor ? f.constructor.name : f : f) + '\''));

    return f;
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

            return this instanceof Nothing ? v : this.value;
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

            return f();
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

            return new Writer(v1, l1.concat(l2));
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

            return new IO(function () {
                return f(_this11.f());
            });
        }
    }, {
        key: 'chain',
        value: function chain(f) {
            var _this12 = this;

            _isFunction(f);
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

            _isFunction(f);

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

            _isFunction(f);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb25hZC5qcyJdLCJuYW1lcyI6WyJyaWdodCIsImxlZnQiLCJfaXNGdW5jdGlvbiIsImYiLCJUeXBlRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJJZGVudGl0eSIsInZhbHVlIiwiX3ZhbHVlIiwibSIsIm1hcCIsInYiLCJNYXliZSIsIk5vdGhpbmciLCJvZiIsIkp1c3QiLCJsIiwiciIsIm5vdCIsIkVpdGhlciIsImNoYWluIiwieCIsIkxlZnQiLCJSaWdodCIsImVpdGhlciIsImZuIiwiUmVhZGVyIiwicnVuIiwiY29uZmlnIiwicmVhZGVyIiwiV3JpdGVyIiwibG9nIiwicnVuV3JpdGVyIiwidjEiLCJsMiIsImwxIiwiY29uY2F0IiwiU3RhdGUiLCJzIiwic3RhdGUiLCJqb2luIiwiaW5pdFN0YXRlIiwiZ2V0IiwicHV0IiwiSU8iLCJpbyIsIkZyZWUiLCJSZXR1cm4iLCJnIiwiYSIsImZ0b3IiLCJTdXNwZW5kIiwiZnJlZSIsInJlc3VtZSIsInZhbCIsImlkZW50aXR5Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O1FBeWtCZ0JBLEssR0FBQUEsSztRQVdBQyxJLEdBQUFBLEk7Ozs7Ozs7O0FBcGxCaEIsSUFBTUMsY0FBYyxTQUFkQSxXQUFjLElBQUs7O0FBRXJCLFFBQUksT0FBT0MsQ0FBUCxLQUFhLFVBQWpCLEVBQ0ksTUFBTSxJQUFJQyxTQUFKLENBQWMsMENBQ0xELENBREsseUNBQ0xBLENBREssZUFDRUEsSUFBRUEsRUFBRUUsV0FBRixHQUFjRixFQUFFRSxXQUFGLENBQWNDLElBQTVCLEdBQWlDSCxDQUFuQyxHQUFxQ0EsQ0FEdkMsU0FBZCxDQUFOOztBQUlKLFdBQU9BLENBQVA7QUFFSCxDQVREOztBQVdBOzs7OztJQUlhSSxRLFdBQUFBLFE7QUFFVCxzQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUVmLGFBQUtDLE1BQUwsR0FBY0QsS0FBZDtBQUVIOzs7OzRCQVFHTCxDLEVBQUc7O0FBRUgsbUJBQU8sSUFBSUksUUFBSixD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Q0FBUDtBQUVIOztBQUVNLElBQU1nQyx3QkFBUSxTQUFSQSxLQUFRLENBQUNoQyxLQUFEO0FBQUEsV0FDakI4QixNQUFNdkIsRUFBTixDQUFTUCxLQUFULENBRGlCO0FBQUEsQ0FBZCIsImZpbGUiOiJtb25hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9pc0Z1bmN0aW9uID0gZiA9PiB7XG5cbiAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGZ1bmN0aW9uIGdvdCBgICtcbiAgICAgICAgICAgIGAoJHt0eXBlb2YgZn0pICcke2Y/Zi5jb25zdHJ1Y3Rvcj9mLmNvbnN0cnVjdG9yLm5hbWU6ZjpmfSdgKTtcblxuXG4gICAgcmV0dXJuIGY7XG5cbn07XG5cbi8qKlxuICogSWRlbnRpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIElkZW50aXR5IHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZGVudGl0eSh2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZGVudGl0eShmKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgYXAobSkge1xuXG4gICAgICAgIHJldHVybiBtLm1hcCh0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBNYXliZVxuICovXG5leHBvcnQgY2xhc3MgTWF5YmUge1xuXG4gICAgY29uc3RydWN0b3Iodikge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG5vdCh2KSB7XG5cbiAgICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IG5ldyBOb3RoaW5nKCkgOiBNYXliZS5vZih2KTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBKdXN0KHYpO1xuXG4gICAgfVxuXG4gICAgb3JKdXN0KHYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIE5vdGhpbmcgPyB2IDogdGhpcy52YWx1ZTtcblxuICAgIH1cblxuXG59XG5cbi8qKlxuICogTm90aGluZ1xuICovXG5leHBvcnQgY2xhc3MgTm90aGluZyBleHRlbmRzIE1heWJlIHtcblxuXG5cbiAgICBtYXAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYoKTtcblxuICAgIH1cblxuICAgIGV4dHJhY3QoKSB7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignanVzdCgpIGlzIG5vdCBpbXBsZW1lbnRlZCBvbiBOb3RoaW5nIScpO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuIGwoKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIEp1c3RcbiAqL1xuZXhwb3J0IGNsYXNzIEp1c3QgZXh0ZW5kcyBNYXliZSB7XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBNYXliZS5ub3QoZih0aGlzLnZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgZXh0cmFjdCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxuICAgIGNhdGEobCwgcikge1xuXG4gICAgICAgIHJldHVybiByKHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogRWl0aGVyIG1vbmFkLlxuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBFaXRoZXIge1xuXG4gICAgY29uc3RydWN0b3Iodikge1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdjtcblxuICAgIH1cblxuICAgIGpvaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW4oeCA9PiB4KTtcblxuICAgIH1cblxuICAgIGxlZnQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEVpdGhlciNsZWZ0KCk6ICcke3RoaXMuY29uc3RydWN0b3IubmFtZX0nIGlzIG5vdCBpbnN0YW5jZSBvZiBMZWZ0IWApO1xuXG4gICAgfVxuXG4gICAgcmlnaHQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBSaWdodClcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBFaXRoZXIjcmlnaHQoKTogJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgaXMgbm90IGluc3RhbmNlIG9mIFJpZ2h0IWApO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuICh0aGlzIGluc3RhbmNlb2YgTGVmdCkgPyBsKHRoaXMuX3ZhbHVlKSA6IHIodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogUmlnaHQgcmVwcmVzZW50cyB0aGUgY29ycmVjdCB0aGluZy5cbiAqL1xuZXhwb3J0IGNsYXNzIFJpZ2h0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSaWdodChmKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgYXAoZWl0aGVyKSB7XG5cbiAgICAgICAgcmV0dXJuIGVpdGhlci5tYXAoZm4gPT4gZm4odGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgTGVmdCBleHRlbmRzIEVpdGhlciB7XG5cbiAgICBtYXAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgYXAoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFJlYWRlciB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSBmO1xuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlYWRlcihjb25maWcgPT5cbiAgICAgICAgICAgIGYodGhpcy5ydW4oY29uZmlnKSkpO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZWFkZXIoY29uZmlnID0+XG4gICAgICAgICAgICB0aGlzLnJ1bihjb25maWcpLnJ1bihjb25maWcpKTtcbiAgICB9XG5cbiAgICBhcChyZWFkZXIpIHtcblxuICAgICAgICByZWFkZXIubWFwKGZuID0+IGZuKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBydW4oY29uZmlnKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlKGNvbmZpZyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBXcml0ZXJcbiAqL1xuZXhwb3J0IGNsYXNzIFdyaXRlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSwgbG9nID0gW10pIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gW3ZhbHVlLCBsb2ddO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG9mKHYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFdyaXRlcih2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgbGV0IHsgdiwgbCB9ID0gdGhpcy5ydW5Xcml0ZXIoKTtcbiAgICAgICAgbGV0IHsgdjEsIGwyIH0gPSBmKHYpO1xuXG4gICAgICAgIHJldHVybiBuZXcgV3JpdGVyKHYxLCBsMS5jb25jYXQobDIpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICBsZXQgeyB2LCBsIH0gPSB0aGlzLnJ1bldyaXRlcigpO1xuICAgICAgICBsZXQgeyB2MSwgbDEgfSA9IGYodikucnVuV3JpdGVyKCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXcml0ZXIodjEsIGwuY29uY2F0KGwxKSk7XG5cbiAgICB9XG5cbiAgICBydW5Xcml0ZXIoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG5cbiAgICB9XG5cblxufVxuXG4vKipcbiAqIFN0YXRlIGlzIGEgbW9uYWRpYyBjbGFzcyB0aGF0IHdlIHVzZSB0byBob2xkIGluZm9ybWF0aW9uIHRoYXQgY2hhbmdlc1xuICogZHVyaW5nIGNvbXBpbGF0aW9uLiBJdCBrZWVwcyB0aGUgY2hhbmdlcyBpbnNvbGF0ZWQgZnJvbSB0aGVcbiAqIHJlc3Qgb2YgdGhlIHByb2Nlc3MgdW50aWwgbmVlZGVkIHNvIHdlIGNhbiBoYXZlIGEgJ3B1cmUnIGNvbXBpbGF0aW9uLlxuICpcbiAqIFRoaXMgaW1wbGVtZW50YXRpb24gaXMgaW5mbHVlbmNlZCBieTpcbiAqIEBsaW5rIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01vbmFkXyhmdW5jdGlvbmFsX3Byb2dyYW1taW5nKSNTdGF0ZV9tb25hZHNcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXRlIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2YWx1ZSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoc3RhdGUgPT4gKHsgdmFsdWUsIHN0YXRlIH0pKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBnZXQoKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzdGF0ZSA9PiAoeyB2YWx1ZTogc3RhdGUsIHN0YXRlIH0pKTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBwdXQoc3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKCgpID0+ICh7IHZhbHVlOiBudWxsLCBzdGF0ZSB9KSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgbW9kaWZ5KGYpIHtcblxuICAgICAgICByZXR1cm4gU3RhdGUuZ2V0KCkuY2hhaW4oc3RhdGUgPT5cbiAgICAgICAgICAgIFN0YXRlLnB1dChmKHN0YXRlKSkpO1xuICAgIH1cblxuICAgIHN0YXRpYyBnZXRzKGYpIHtcblxuICAgICAgICByZXR1cm4gU3RhdGUuZ2V0KCkuY2hhaW4oc3RhdGUgPT5cbiAgICAgICAgICAgIFN0YXRlLm9mKGYoc3RhdGUpKSlcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzID0+IHtcbiAgICAgICAgICAgIGxldCB7IHZhbHVlLCBzdGF0ZSB9ID0gdGhpcy5ydW4ocyk7XG4gICAgICAgICAgICByZXR1cm4geyB2YWx1ZTogZih2YWx1ZSksIHN0YXRlIH07XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgam9pbigpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHMgPT4ge1xuICAgICAgICAgICAgbGV0IHsgdmFsdWUsIHN0YXRlIH0gPSB0aGlzLnJ1bihzKTtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5ydW4oc3RhdGUpO1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5tYXAoZikuam9pbigpO1xuXG4gICAgfVxuXG4gICAgZXZhbFN0YXRlKGluaXRTdGF0ZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bihpbml0U3RhdGUpLnZhbHVlO1xuXG4gICAgfVxuXG4gICAgZXhlY1N0YXRlKGluaXRTdGF0ZSkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJ1bihpbml0U3RhdGUpLnN0YXRlO1xuXG4gICAgfVxuXG4gICAgcnVuKHMpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUocyk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBJTyBtb25hZGljIHR5cGUgZm9yIGNvbnRhaW5pbmcgaW50ZXJhY3Rpb25zIHdpdGggdGhlICdyZWFsIHdvcmxkJy5cbiAqL1xuZXhwb3J0IGNsYXNzIElPIHtcblxuICAgIGNvbnN0cnVjdG9yKGYpIHtcblxuICAgICAgICB0aGlzLmYgPSBmO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG9mKHYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElPKHR5cGVvZiB2ID09PSAnZnVuY3Rpb24nID8gdiA6ICgpID0+IHYpO1xuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IElPKCgpID0+IGYodGhpcy5mKCkpKTtcbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgX2lzRnVuY3Rpb24oZik7XG4gICAgICAgIHJldHVybiBuZXcgSU8oKCkgPT4gZih0aGlzLmYoKSkucnVuKCkpO1xuXG4gICAgfVxuXG4gICAgYXAoaW8pIHtcblxuICAgICAgICByZXR1cm4gaW8ubWFwKGYgPT4gZih0aGlzLmYoKSkpO1xuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZigpXG4gICAgfVxuXG59XG5cbi8qKlxuICogRnJlZVxuICovXG5leHBvcnQgY2xhc3MgRnJlZSB7XG5cbiAgICBzdGF0aWMgb2YoYSkge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmV0dXJuKGEpXG5cbiAgICB9XG5cbiAgICBzdGF0aWMgbGlmdEYoZnRvcikge1xuXG4gICAgICAgIHJldHVybiB0eXBlb2YgZnRvciA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgICAgICAgICBuZXcgU3VzcGVuZCh4ID0+IG5ldyBSZXR1cm4oZnRvcih4KSkpIDpcbiAgICAgICAgICAgIG5ldyBTdXNwZW5kKGZ0b3IubWFwKHggPT4gbmV3IFJldHVybih4KSkpXG4gICAgfVxuXG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluKHggPT4gbmV3IFJldHVybihmKHgpKSk7XG5cbiAgICB9XG5cbiAgICBhcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW4oeCA9PiBmLm1hcChnID0+IGcoeCkpKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgU3VzcGVuZCBleHRlbmRzIEZyZWUge1xuXG4gICAgY29uc3RydWN0b3IoZnRvcikge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZnRvciA9IGZ0b3I7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgX2lzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgcmV0dXJuICh0eXBlb2YgdGhpcy5mdG9yID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICBuZXcgU3VzcGVuZCh4ID0+IHRoaXMuZnRvcih4KS5jaGFpbihmKSkgOlxuICAgICAgICAgICAgbmV3IFN1c3BlbmQodGhpcy5mdG9yLm1hcChmcmVlID0+IGZyZWUuY2hhaW4oZikpKTtcblxuICAgIH1cblxuICAgIHJlc3VtZSgpIHtcblxuICAgICAgICByZXR1cm4gbGVmdCh0aGlzLmZ0b3IpO1xuXG4gICAgfVxuXG4gICAgZ28oZikge1xuXG4gICAgICAgIGxldCByID0gdGhpcy5yZXN1bWUoKTtcblxuICAgICAgICB3aGlsZSAociBpbnN0YW5jZW9mIExlZnQpXG4gICAgICAgICAgICByID0gKGYoci5sZWZ0KCkpKS5yZXN1bWUoKTtcblxuICAgICAgICByZXR1cm4gci5yaWdodCgpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBSZXR1cm4gZXh0ZW5kcyBGcmVlIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbCkge1xuXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWw7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgX2lzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIHJpZ2h0KHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG4gICAgZ28oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG5cbiAgICB9XG5cbn1cblxuXG4vKipcbiAqIGlkZW50aXR5IHJldHVybnMgYW4gSWRlbnRpdHkgbW9uYWQgd2l0aC5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNvbnN0IGlkZW50aXR5ID0gdiA9PiBuZXcgSWRlbnRpdHkodik7XG5cbi8qKlxuICogcmlnaHQgY29uc3RydWN0cyBhIG5ldyBSaWdodCB0eXBlLlxuICogQHBhcmFtIHsqfSB2YWx1ZVxuICogQHJldHVybnMge1JpZ2h0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmlnaHQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgUmlnaHQodmFsdWUpO1xuXG59XG5cbi8qKlxuICogbGVmdCBjb25zdHJ1Y3RzIGEgbmV3IExlZnQgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtMZWZ0fVxuICovXG5leHBvcnQgZnVuY3Rpb24gbGVmdCh2YWx1ZSkge1xuXG4gICAgcmV0dXJuIG5ldyBMZWZ0KHZhbHVlKTtcblxufVxuXG5leHBvcnQgY29uc3Qgc3RhdGUgPSAodmFsdWUpID0+XG4gICAgU3RhdGUub2YodmFsdWUpO1xuIl19
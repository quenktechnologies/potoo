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

            return this instanceof Nothing ? new Just(v) : this;
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

var liftF = exports.liftF = Free.liftF;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9tb25hZC5qcyJdLCJuYW1lcyI6WyJyaWdodCIsImxlZnQiLCJfaXNGdW5jdGlvbiIsImYiLCJUeXBlRXJyb3IiLCJjb25zdHJ1Y3RvciIsIm5hbWUiLCJJZGVudGl0eSIsInZhbHVlIiwiX3ZhbHVlIiwibSIsIm1hcCIsInYiLCJNYXliZSIsIk5vdGhpbmciLCJKdXN0Iiwib2YiLCJsIiwiciIsIm5vdCIsIkVpdGhlciIsImNoYWluIiwieCIsIkxlZnQiLCJSaWdodCIsImVpdGhlciIsImZuIiwiUmVhZGVyIiwicnVuIiwiY29uZmlnIiwicmVhZGVyIiwiV3JpdGVyIiwibG9nIiwicnVuV3JpdGVyIiwidjEiLCJsMiIsImNvbmNhdCIsImwxIiwiU3RhdGUiLCJzIiwic3RhdGUiLCJqb2luIiwiaW5pdFN0YXRlIiwiZ2V0IiwicHV0IiwiSU8iLCJpbyIsIkZyZWUiLCJSZXR1cm4iLCJnIiwiYSIsImZ0b3IiLCJTdXNwZW5kIiwiZnJlZSIsInJlc3VtZSIsInZhbCIsImlkZW50aXR5IiwibGlmdEYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7UUF5a0JnQkEsSyxHQUFBQSxLO1FBV0FDLEksR0FBQUEsSTs7Ozs7Ozs7QUFwbEJoQixJQUFNQyxjQUFjLFNBQWRBLFdBQWMsSUFBSzs7QUFFckIsUUFBSSxPQUFPQyxDQUFQLEtBQWEsVUFBakIsRUFDSSxNQUFNLElBQUlDLFNBQUosQ0FBYywwQ0FDTEQsQ0FESyx5Q0FDTEEsQ0FESyxlQUNFQSxJQUFFQSxFQUFFRSxXQUFGLEdBQWNGLEVBQUVFLFdBQUYsQ0FBY0MsSUFBNUIsR0FBaUNILENBQW5DLEdBQXFDQSxDQUR2QyxTQUFkLENBQU47O0FBSUosV0FBT0EsQ0FBUDtBQUVILENBVEQ7O0FBV0E7Ozs7O0lBSWFJLFEsV0FBQUEsUTtBQUVULHNCQUFZQyxLQUFaLEVBQW1CO0FBQUE7O0FBRWYsYUFBS0MsTUFBTCxHQUFjRCxLQUFkO0FBRUg7Ozs7NEJBUUdMLEMsRUFBRzs7QUFFSCxtQkFBTyxJQUFJ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LEtBQWQsRUFBcUI7O0FBRXhCLFdBQU8sSUFBSWUsSUFBSixDQUFTZixLQUFULENBQVA7QUFFSDs7QUFFTSxJQUFNZ0Msd0JBQVEsU0FBUkEsS0FBUSxDQUFDaEMsS0FBRDtBQUFBLFdBQ2pCOEIsTUFBTXRCLEVBQU4sQ0FBU1IsS0FBVCxDQURpQjtBQUFBLENBQWQ7O0FBR0EsSUFBTWlELHdCQUFRVixLQUFLVSxLQUFuQiIsImZpbGUiOiJtb25hZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9pc0Z1bmN0aW9uID0gZiA9PiB7XG5cbiAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEV4cGVjdGVkIGZ1bmN0aW9uIGdvdCBgICtcbiAgICAgICAgICAgIGAoJHt0eXBlb2YgZn0pICcke2Y/Zi5jb25zdHJ1Y3Rvcj9mLmNvbnN0cnVjdG9yLm5hbWU6ZjpmfSdgKTtcblxuXG4gICAgcmV0dXJuIGY7XG5cbn07XG5cbi8qKlxuICogSWRlbnRpdHlcbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqL1xuZXhwb3J0IGNsYXNzIElkZW50aXR5IHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZGVudGl0eSh2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJZGVudGl0eShmKHRoaXMuX3ZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIGYodGhpcy5fdmFsdWUpO1xuXG4gICAgfVxuXG4gICAgYXAobSkge1xuXG4gICAgICAgIHJldHVybiBtLm1hcCh0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBNYXliZVxuICovXG5leHBvcnQgY2xhc3MgTWF5YmUge1xuXG4gICAgY29uc3RydWN0b3Iodikge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG5vdCh2KSB7XG5cbiAgICAgICAgcmV0dXJuIHYgPT0gbnVsbCA/IG5ldyBOb3RoaW5nKCkgOiBNYXliZS5vZih2KTtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBKdXN0KHYpO1xuXG4gICAgfVxuXG4gICAgb3JKdXN0KHYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIE5vdGhpbmcgPyBuZXcgSnVzdCh2KSA6IHRoaXM7XG5cbiAgICB9XG5cblxufVxuXG4vKipcbiAqIE5vdGhpbmdcbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGhpbmcgZXh0ZW5kcyBNYXliZSB7XG5cblxuXG4gICAgbWFwKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgSnVzdChmKCkpO1xuXG4gICAgfVxuXG4gICAgZXh0cmFjdCgpIHtcblxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdqdXN0KCkgaXMgbm90IGltcGxlbWVudGVkIG9uIE5vdGhpbmchJyk7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gbCgpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogSnVzdFxuICovXG5leHBvcnQgY2xhc3MgSnVzdCBleHRlbmRzIE1heWJlIHtcblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIE1heWJlLm5vdChmKHRoaXMudmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLnZhbHVlKTtcblxuICAgIH1cblxuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBleHRyYWN0KCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuXG4gICAgfVxuXG4gICAgY2F0YShsLCByKSB7XG5cbiAgICAgICAgcmV0dXJuIHIodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBFaXRoZXIgbW9uYWQuXG4gKiBAYWJzdHJhY3RcbiAqL1xuZXhwb3J0IGNsYXNzIEVpdGhlciB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2KSB7XG5cbiAgICAgICAgdGhpcy5fdmFsdWUgPSB2O1xuXG4gICAgfVxuXG4gICAgam9pbigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IHgpO1xuXG4gICAgfVxuXG4gICAgbGVmdCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIExlZnQpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWU7XG5cbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgRWl0aGVyI2xlZnQoKTogJyR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfScgaXMgbm90IGluc3RhbmNlIG9mIExlZnQhYCk7XG5cbiAgICB9XG5cbiAgICByaWdodCgpIHtcblxuICAgICAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFJpZ2h0KVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoYEVpdGhlciNyaWdodCgpOiAnJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9JyBpcyBub3QgaW5zdGFuY2Ugb2YgUmlnaHQhYCk7XG5cbiAgICB9XG5cbiAgICBjYXRhKGwsIHIpIHtcblxuICAgICAgICByZXR1cm4gKHRoaXMgaW5zdGFuY2VvZiBMZWZ0KSA/IGwodGhpcy5fdmFsdWUpIDogcih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBSaWdodCByZXByZXNlbnRzIHRoZSBjb3JyZWN0IHRoaW5nLlxuICovXG5leHBvcnQgY2xhc3MgUmlnaHQgZXh0ZW5kcyBFaXRoZXIge1xuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJpZ2h0KGYodGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNoYWluKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBvckVsc2UoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICBhcChlaXRoZXIpIHtcblxuICAgICAgICByZXR1cm4gZWl0aGVyLm1hcChmbiA9PiBmbih0aGlzLl92YWx1ZSkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBMZWZ0IGV4dGVuZHMgRWl0aGVyIHtcblxuICAgIG1hcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIGNoYWluKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICByZXR1cm4gZih0aGlzLl92YWx1ZSk7XG5cbiAgICB9XG5cbiAgICBhcCgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmVhZGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKGYpIHtcblxuICAgICAgICB0aGlzLl92YWx1ZSA9IGY7XG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgUmVhZGVyKGNvbmZpZyA9PlxuICAgICAgICAgICAgZih0aGlzLnJ1bihjb25maWcpKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbigpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJlYWRlcihjb25maWcgPT5cbiAgICAgICAgICAgIHRoaXMucnVuKGNvbmZpZykucnVuKGNvbmZpZykpO1xuICAgIH1cblxuICAgIGFwKHJlYWRlcikge1xuXG4gICAgICAgIHJlYWRlci5tYXAoZm4gPT4gZm4odGhpcy5fdmFsdWUpKTtcblxuICAgIH1cblxuICAgIHJ1bihjb25maWcpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5fdmFsdWUoY29uZmlnKTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIFdyaXRlclxuICovXG5leHBvcnQgY2xhc3MgV3JpdGVyIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlLCBsb2cgPSBbXSkge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSBbdmFsdWUsIGxvZ107XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2Yodikge1xuXG4gICAgICAgIHJldHVybiBuZXcgV3JpdGVyKHYpO1xuXG4gICAgfVxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICBsZXQgeyB2LCBsIH0gPSB0aGlzLnJ1bldyaXRlcigpO1xuICAgICAgICBsZXQgeyB2MSwgbDIgfSA9IGYodik7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBXcml0ZXIodjEsIGwuY29uY2F0KGwyKSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgbGV0IHsgdiwgbCB9ID0gdGhpcy5ydW5Xcml0ZXIoKTtcbiAgICAgICAgbGV0IHsgdjEsIGwxIH0gPSBmKHYpLnJ1bldyaXRlcigpO1xuXG4gICAgICAgIHJldHVybiBuZXcgV3JpdGVyKHYxLCBsLmNvbmNhdChsMSkpO1xuXG4gICAgfVxuXG4gICAgcnVuV3JpdGVyKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBTdGF0ZSBpcyBhIG1vbmFkaWMgY2xhc3MgdGhhdCB3ZSB1c2UgdG8gaG9sZCBpbmZvcm1hdGlvbiB0aGF0IGNoYW5nZXNcbiAqIGR1cmluZyBjb21waWxhdGlvbi4gSXQga2VlcHMgdGhlIGNoYW5nZXMgaW5zb2xhdGVkIGZyb20gdGhlXG4gKiByZXN0IG9mIHRoZSBwcm9jZXNzIHVudGlsIG5lZWRlZCBzbyB3ZSBjYW4gaGF2ZSBhICdwdXJlJyBjb21waWxhdGlvbi5cbiAqXG4gKiBUaGlzIGltcGxlbWVudGF0aW9uIGlzIGluZmx1ZW5jZWQgYnk6XG4gKiBAbGluayBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Nb25hZF8oZnVuY3Rpb25hbF9wcm9ncmFtbWluZykjU3RhdGVfbW9uYWRzXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMuX3ZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgb2YodmFsdWUpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFN0YXRlKHN0YXRlID0+ICh7IHZhbHVlLCBzdGF0ZSB9KSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0KCkge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUoc3RhdGUgPT4gKHsgdmFsdWU6IHN0YXRlLCBzdGF0ZSB9KSk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgcHV0KHN0YXRlKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZSgoKSA9PiAoeyB2YWx1ZTogbnVsbCwgc3RhdGUgfSkpO1xuXG4gICAgfVxuXG4gICAgc3RhdGljIG1vZGlmeShmKSB7XG5cbiAgICAgICAgcmV0dXJuIFN0YXRlLmdldCgpLmNoYWluKHN0YXRlID0+XG4gICAgICAgICAgICBTdGF0ZS5wdXQoZihzdGF0ZSkpKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0cyhmKSB7XG5cbiAgICAgICAgcmV0dXJuIFN0YXRlLmdldCgpLmNoYWluKHN0YXRlID0+XG4gICAgICAgICAgICBTdGF0ZS5vZihmKHN0YXRlKSkpXG5cbiAgICB9XG5cbiAgICBtYXAoZikge1xuXG4gICAgICAgIHJldHVybiBuZXcgU3RhdGUocyA9PiB7XG4gICAgICAgICAgICBsZXQgeyB2YWx1ZSwgc3RhdGUgfSA9IHRoaXMucnVuKHMpO1xuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IGYodmFsdWUpLCBzdGF0ZSB9O1xuICAgICAgICB9KTtcblxuICAgIH1cblxuICAgIGpvaW4oKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBTdGF0ZShzID0+IHtcbiAgICAgICAgICAgIGxldCB7IHZhbHVlLCBzdGF0ZSB9ID0gdGhpcy5ydW4ocyk7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUucnVuKHN0YXRlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBjaGFpbihmKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKGYpLmpvaW4oKTtcblxuICAgIH1cblxuICAgIGV2YWxTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS52YWx1ZTtcblxuICAgIH1cblxuICAgIGV4ZWNTdGF0ZShpbml0U3RhdGUpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5ydW4oaW5pdFN0YXRlKS5zdGF0ZTtcblxuICAgIH1cblxuICAgIHJ1bihzKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlKHMpO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogSU8gbW9uYWRpYyB0eXBlIGZvciBjb250YWluaW5nIGludGVyYWN0aW9ucyB3aXRoIHRoZSAncmVhbCB3b3JsZCcuXG4gKi9cbmV4cG9ydCBjbGFzcyBJTyB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgdGhpcy5mID0gZjtcblxuICAgIH1cblxuICAgIHN0YXRpYyBvZih2KSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTyh0eXBlb2YgdiA9PT0gJ2Z1bmN0aW9uJyA/IHYgOiAoKSA9PiB2KTtcblxuICAgIH1cblxuICAgIG1hcChmKSB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBJTygoKSA9PiBmKHRoaXMuZigpKSk7XG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIF9pc0Z1bmN0aW9uKGYpO1xuICAgICAgICByZXR1cm4gbmV3IElPKCgpID0+IGYodGhpcy5mKCkpLnJ1bigpKTtcblxuICAgIH1cblxuICAgIGFwKGlvKSB7XG5cbiAgICAgICAgcmV0dXJuIGlvLm1hcChmID0+IGYodGhpcy5mKCkpKTtcbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmYoKVxuICAgIH1cblxufVxuXG4vKipcbiAqIEZyZWVcbiAqL1xuZXhwb3J0IGNsYXNzIEZyZWUge1xuXG4gICAgc3RhdGljIG9mKGEpIHtcblxuICAgICAgICByZXR1cm4gbmV3IFJldHVybihhKVxuXG4gICAgfVxuXG4gICAgc3RhdGljIGxpZnRGKGZ0b3IpIHtcblxuICAgICAgICByZXR1cm4gdHlwZW9mIGZ0b3IgPT09ICdmdW5jdGlvbicgP1xuICAgICAgICAgICAgbmV3IFN1c3BlbmQoeCA9PiBuZXcgUmV0dXJuKGZ0b3IoeCkpKSA6XG4gICAgICAgICAgICBuZXcgU3VzcGVuZChmdG9yLm1hcCh4ID0+IG5ldyBSZXR1cm4oeCkpKVxuICAgIH1cblxuXG4gICAgbWFwKGYpIHtcblxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbih4ID0+IG5ldyBSZXR1cm4oZih4KSkpO1xuXG4gICAgfVxuXG4gICAgYXAoZikge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluKHggPT4gZi5tYXAoZyA9PiBnKHgpKSk7XG5cbiAgICB9XG5cbn1cblxuZXhwb3J0IGNsYXNzIFN1c3BlbmQgZXh0ZW5kcyBGcmVlIHtcblxuICAgIGNvbnN0cnVjdG9yKGZ0b3IpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmZ0b3IgPSBmdG9yO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIF9pc0Z1bmN0aW9uKGYpO1xuXG4gICAgICAgIHJldHVybiAodHlwZW9mIHRoaXMuZnRvciA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgbmV3IFN1c3BlbmQoeCA9PiB0aGlzLmZ0b3IoeCkuY2hhaW4oZikpIDpcbiAgICAgICAgICAgIG5ldyBTdXNwZW5kKHRoaXMuZnRvci5tYXAoZnJlZSA9PiBmcmVlLmNoYWluKGYpKSk7XG5cbiAgICB9XG5cbiAgICByZXN1bWUoKSB7XG5cbiAgICAgICAgcmV0dXJuIGxlZnQodGhpcy5mdG9yKTtcblxuICAgIH1cblxuICAgIGdvKGYpIHtcblxuICAgICAgICBsZXQgciA9IHRoaXMucmVzdW1lKCk7XG5cbiAgICAgICAgd2hpbGUgKHIgaW5zdGFuY2VvZiBMZWZ0KVxuICAgICAgICAgICAgciA9IChmKHIubGVmdCgpKSkucmVzdW1lKCk7XG5cbiAgICAgICAgcmV0dXJuIHIucmlnaHQoKTtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmV0dXJuIGV4dGVuZHMgRnJlZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWwpIHtcblxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsO1xuXG4gICAgfVxuXG4gICAgY2hhaW4oZikge1xuXG4gICAgICAgIF9pc0Z1bmN0aW9uKGYpO1xuXG4gICAgICAgIHJldHVybiBmKHRoaXMudmFsdWUpO1xuXG4gICAgfVxuXG4gICAgcmVzdW1lKCkge1xuXG4gICAgICAgIHJldHVybiByaWdodCh0aGlzLnZhbHVlKTtcblxuICAgIH1cblxuICAgIGdvKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuXG4gICAgfVxuXG59XG5cblxuLyoqXG4gKiBpZGVudGl0eSByZXR1cm5zIGFuIElkZW50aXR5IG1vbmFkIHdpdGguXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKi9cbmV4cG9ydCBjb25zdCBpZGVudGl0eSA9IHYgPT4gbmV3IElkZW50aXR5KHYpO1xuXG4vKipcbiAqIHJpZ2h0IGNvbnN0cnVjdHMgYSBuZXcgUmlnaHQgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWVcbiAqIEByZXR1cm5zIHtSaWdodH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0KHZhbHVlKSB7XG5cbiAgICByZXR1cm4gbmV3IFJpZ2h0KHZhbHVlKTtcblxufVxuXG4vKipcbiAqIGxlZnQgY29uc3RydWN0cyBhIG5ldyBMZWZ0IHR5cGUuXG4gKiBAcGFyYW0geyp9IHZhbHVlXG4gKiBAcmV0dXJucyB7TGVmdH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxlZnQodmFsdWUpIHtcblxuICAgIHJldHVybiBuZXcgTGVmdCh2YWx1ZSk7XG5cbn1cblxuZXhwb3J0IGNvbnN0IHN0YXRlID0gKHZhbHVlKSA9PlxuICAgIFN0YXRlLm9mKHZhbHVlKTtcblxuZXhwb3J0IGNvbnN0IGxpZnRGID0gRnJlZS5saWZ0RjtcbiJdfQ==
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.run = exports.go = exports.resume = exports.chain = exports.map = exports.liftF = exports.of = exports.Return = exports.Suspend = exports.Free = undefined;

var _util = require('../util');

var _Either = require('./Either');

var _Match = require('../control/Match');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Free
 *
 * Inspired by https://cwmyers.github.io/monet.js/#free
 */
var Free = exports.Free = function Free() {
    var _this = this;

    _classCallCheck(this, Free);

    this.map = map(this);
    this.chain = chain(this);
    this.resume = function () {
        return resume(_this);
    };
    this.go = go(this);
};

var Suspend = exports.Suspend = function (_Free) {
    _inherits(Suspend, _Free);

    function Suspend(f) {
        _classCallCheck(this, Suspend);

        var _this2 = _possibleConstructorReturn(this, (Suspend.__proto__ || Object.getPrototypeOf(Suspend)).call(this));

        _this2.f = f;

        return _this2;
    }

    return Suspend;
}(Free);

var Return = exports.Return = function (_Free2) {
    _inherits(Return, _Free2);

    function Return(a) {
        _classCallCheck(this, Return);

        var _this3 = _possibleConstructorReturn(this, (Return.__proto__ || Object.getPrototypeOf(Return)).call(this));

        _this3.a = a;

        return _this3;
    }

    return Return;
}(Free);

/**
 * of wraps a value in a Free
 * @summary of :: A →  Free<F,A>
 */


var of = exports.of = function of(a) {
    return new Return(a);
};

/**
 * liftF lifts a functor into a Free
 * @summary liftF :: Functor<A> →  Free<F,A>
 */
var liftF = exports.liftF = function liftF(f) {
    return typeof f === 'function' ? new Suspend((0, _util.compose)(of, f)) : new Suspend(f.map(of));
};

/**
 * map
 * @summary map :: Free<F,A> →  (A →  B)  →  Free<F, B>
 */
var map = exports.map = function map(fr) {
    return function (f) {
        return fr.chain((0, _util.compose)(of, (0, _util.isFunction)(f)));
    };
};

/**
 * chain
 * @summary chain :: Free<F,A> →  (A →  Free<F,B) →  Free<F,B>
 */
var chain = exports.chain = function chain(fr) {
    return function (g) {
        return (0, _Match.match)(fr).caseOf(Suspend, function (_ref) {
            var f = _ref.f;
            return typeof fr.f === 'function' ? new Suspend(function (x) {
                return f(x).chain((0, _util.isFunction)(g));
            }) : new Suspend(f.map(function (free) {
                return free.chain((0, _util.isFunction)(g));
            }));
        }).caseOf(Return, function (_ref2) {
            var a = _ref2.a;
            return (0, _util.isFunction)(g).call(null, a);
        }).end();
    };
};

/**
 * resume the next stage of the computation
 * @summary resume :: Free<F<*>,A> →  Either<F<Free<F,A>>, A>
 */
var resume = exports.resume = function resume(fr) {
    return (0, _Match.match)(fr).caseOf(Suspend, function (_ref3) {
        var f = _ref3.f;
        return (0, _Either.left)(f);
    }).caseOf(Return, function (_ref4) {
        var a = _ref4.a;
        return (0, _Either.right)(a);
    }).end();
};

/**
 * go runs the computation to completion using f to extract each stage.
 * @summmary go :: Free<F<*>, A> →  (F<Free<F,A>> →  Free<F,A>) →  A
 */
var go = exports.go = function go(fr) {
    return function (f) {
        return (0, _Match.match)(fr).caseOf(Suspend, function (sus) {

            var r = sus.resume();

            while (r instanceof _Either.Left) {
                r = (0, _util.isFunction)(f)(r.left()).resume();
            }return r.right();
        }).caseOf(Return, function (_ref5) {
            var a = _ref5.a;
            return a;
        }).end();
    };
};

/**
 * run the Free chain to completion
 * @summary run :: Free<A→ A,A> →  A
 */
var run = exports.run = function run(fr) {
    return fr.go(function (f) {
        return f();
    });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvbW9uYWQvRnJlZS5qcyJdLCJuYW1lcyI6WyJGcmVlIiwibWFwIiwiY2hhaW4iLCJyZXN1bWUiLCJnbyIsIlN1c3BlbmQiLCJmIiwiUmV0dXJuIiwiYSIsIm9mIiwibGlmdEYiLCJmciIsImNhc2VPZiIsIngiLCJnIiwiZnJlZSIsImNhbGwiLCJlbmQiLCJyIiwic3VzIiwibGVmdCIsInJpZ2h0IiwicnVuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7O0lBS2FBLEksV0FBQUEsSSxHQUVULGdCQUFjO0FBQUE7O0FBQUE7O0FBRVYsU0FBS0MsR0FBTCxHQUFXQSxJQUFJLElBQUosQ0FBWDtBQUNBLFNBQUtDLEtBQUwsR0FBYUEsTUFBTSxJQUFOLENBQWI7QUFDQSxTQUFLQyxNQUFMLEdBQWM7QUFBQSxlQUFJQSxhQUFKO0FBQUEsS0FBZDtBQUNBLFNBQUtDLEVBQUwsR0FBVUEsR0FBRyxJQUFILENBQVY7QUFFSCxDOztJQUlRQyxPLFdBQUFBLE87OztBQUVULHFCQUFZQyxDQUFaLEVBQWU7QUFBQTs7QUFBQTs7QUFHWCxlQUFLQSxDQUFMLEdBQVNBLENBQVQ7O0FBSFc7QUFLZDs7O0VBUHdCTixJOztJQVdoQk8sTSxXQUFBQSxNOzs7QUFFVCxvQkFBWUMsQ0FBWixFQUFlO0FBQUE7O0FBQUE7O0FBR1gsZUFBS0EsQ0FBTCxHQUFTQSxDQUFUOztBQUhXO0FBS2Q7OztFQVB1QlIsSTs7QUFXNUI7Ozs7OztBQUlPLElBQU1TLGtCQUFLLFNBQUxBLEVBQUs7QUFBQSxXQUFLLElBQUlGLE1BQUosQ0FBV0MsQ0FBWCxDQUFMO0FBQUEsQ0FBWDs7QUFFUDs7OztBQUlPLElBQU1FLHdCQUFRLFNBQVJBLEtBQVE7QUFBQSxXQUFLLE9BQU9KLENBQVAsS0FBYSxVQUFiLEdBQ3RCLElBQUlELE9BQUosQ0FBWSxtQkFBUUksRUFBUixFQUFZSCxDQUFaLENBQVosQ0FEc0IsR0FFdEIsSUFBSUQsT0FBSixDQUFZQyxFQUFFTCxHQUFGLENBQU1RLEVBQU4sQ0FBWixDQUZpQjtBQUFBLENBQWQ7O0FBSVA7Ozs7QUFJTyxJQUFNUixvQkFBTSxTQUFOQSxHQUFNO0FBQUEsV0FBTTtBQUFBLGVBQUtVLEdBQUdULEtBQUgsQ0FBUyxtQkFBUU8sRUFBUixFQUFZLHNCQUFXSCxDQUFYLENBQVosQ0FBVCxDQUFMO0FBQUEsS0FBTjtBQUFBLENBQVo7O0FBRVA7Ozs7QUFJTyxJQUFNSix3QkFBUSxTQUFSQSxLQUFRO0FBQUEsV0FBTTtBQUFBLGVBQUssa0JBQU1TLEVBQU4sRUFDM0JDLE1BRDJCLENBQ3BCUCxPQURvQixFQUNYO0FBQUEsZ0JBQUdDLENBQUgsUUFBR0EsQ0FBSDtBQUFBLG1CQUFZLE9BQU9LLEdBQUdMLENBQVYsS0FBZ0IsVUFBakIsR0FDeEIsSUFBSUQsT0FBSixDQUFZO0FBQUEsdUJBQUtDLEVBQUVPLENBQUYsRUFBS1gsS0FBTCxDQUFXLHNCQUFXWSxDQUFYLENBQVgsQ0FBTDtBQUFBLGFBQVosQ0FEd0IsR0FFeEIsSUFBSVQsT0FBSixDQUFZQyxFQUFFTCxHQUFGLENBQU07QUFBQSx1QkFBUWMsS0FBS2IsS0FBTCxDQUFXLHNCQUFXWSxDQUFYLENBQVgsQ0FBUjtBQUFBLGFBQU4sQ0FBWixDQUZhO0FBQUEsU0FEVyxFQUkzQkYsTUFKMkIsQ0FJcEJMLE1BSm9CLEVBSVo7QUFBQSxnQkFBR0MsQ0FBSCxTQUFHQSxDQUFIO0FBQUEsbUJBQVcsc0JBQVdNLENBQVgsRUFBY0UsSUFBZCxDQUFtQixJQUFuQixFQUF5QlIsQ0FBekIsQ0FBWDtBQUFBLFNBSlksRUFLM0JTLEdBTDJCLEVBQUw7QUFBQSxLQUFOO0FBQUEsQ0FBZDs7QUFPUDs7OztBQUlPLElBQU1kLDBCQUFTLFNBQVRBLE1BQVM7QUFBQSxXQUFNLGtCQUFNUSxFQUFOLEVBQ3ZCQyxNQUR1QixDQUNoQlAsT0FEZ0IsRUFDUDtBQUFBLFlBQUdDLENBQUgsU0FBR0EsQ0FBSDtBQUFBLGVBQVcsa0JBQUtBLENBQUwsQ0FBWDtBQUFBLEtBRE8sRUFFdkJNLE1BRnVCLENBRWhCTCxNQUZnQixFQUVSO0FBQUEsWUFBR0MsQ0FBSCxTQUFHQSxDQUFIO0FBQUEsZUFBVyxtQkFBTUEsQ0FBTixDQUFYO0FBQUEsS0FGUSxFQUd2QlMsR0FIdUIsRUFBTjtBQUFBLENBQWY7O0FBS1A7Ozs7QUFJTyxJQUFNYixrQkFBSyxTQUFMQSxFQUFLO0FBQUEsV0FBTTtBQUFBLGVBQUssa0JBQU1PLEVBQU4sRUFDeEJDLE1BRHdCLENBQ2pCUCxPQURpQixFQUNSLGVBQU87O0FBRXBCLGdCQUFJYSxJQUFJQyxJQUFJaEIsTUFBSixFQUFSOztBQUVBLG1CQUFPZSx5QkFBUDtBQUNJQSxvQkFBSyxzQkFBV1osQ0FBWCxFQUFjWSxFQUFFRSxJQUFGLEVBQWQsQ0FBRCxDQUEwQmpCLE1BQTFCLEVBQUo7QUFESixhQUdBLE9BQU9lLEVBQUVHLEtBQUYsRUFBUDtBQUVILFNBVndCLEVBV3hCVCxNQVh3QixDQVdqQkwsTUFYaUIsRUFXVDtBQUFBLGdCQUFHQyxDQUFILFNBQUdBLENBQUg7QUFBQSxtQkFBV0EsQ0FBWDtBQUFBLFNBWFMsRUFZeEJTLEdBWndCLEVBQUw7QUFBQSxLQUFOO0FBQUEsQ0FBWDs7QUFjUDs7OztBQUlPLElBQU1LLG9CQUFNLFNBQU5BLEdBQU07QUFBQSxXQUFNWCxHQUFHUCxFQUFILENBQU07QUFBQSxlQUFLRSxHQUFMO0FBQUEsS0FBTixDQUFOO0FBQUEsQ0FBWiIsImZpbGUiOiJGcmVlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGdW5jdGlvbiwgY29tcG9zZSB9IGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IHsgbGVmdCwgcmlnaHQsIExlZnQgfSBmcm9tICcuL0VpdGhlcic7XG5pbXBvcnQgeyBtYXRjaCB9IGZyb20gJy4uL2NvbnRyb2wvTWF0Y2gnO1xuXG4vKipcbiAqIEZyZWVcbiAqXG4gKiBJbnNwaXJlZCBieSBodHRwczovL2N3bXllcnMuZ2l0aHViLmlvL21vbmV0LmpzLyNmcmVlXG4gKi9cbmV4cG9ydCBjbGFzcyBGcmVlIHtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgICAgIHRoaXMubWFwID0gbWFwKHRoaXMpO1xuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW4odGhpcyk7XG4gICAgICAgIHRoaXMucmVzdW1lID0gKCk9PnJlc3VtZSh0aGlzKTtcbiAgICAgICAgdGhpcy5nbyA9IGdvKHRoaXMpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCBjbGFzcyBTdXNwZW5kIGV4dGVuZHMgRnJlZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihmKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5mID0gZjtcblxuICAgIH1cblxufVxuXG5leHBvcnQgY2xhc3MgUmV0dXJuIGV4dGVuZHMgRnJlZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihhKSB7XG5cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5hID0gYTtcblxuICAgIH1cblxufVxuXG4vKipcbiAqIG9mIHdyYXBzIGEgdmFsdWUgaW4gYSBGcmVlXG4gKiBAc3VtbWFyeSBvZiA6OiBBIOKGkiAgRnJlZTxGLEE+XG4gKi9cbmV4cG9ydCBjb25zdCBvZiA9IGEgPT4gbmV3IFJldHVybihhKTtcblxuLyoqXG4gKiBsaWZ0RiBsaWZ0cyBhIGZ1bmN0b3IgaW50byBhIEZyZWVcbiAqIEBzdW1tYXJ5IGxpZnRGIDo6IEZ1bmN0b3I8QT4g4oaSICBGcmVlPEYsQT5cbiAqL1xuZXhwb3J0IGNvbnN0IGxpZnRGID0gZiA9PiB0eXBlb2YgZiA9PT0gJ2Z1bmN0aW9uJyA/XG4gICAgbmV3IFN1c3BlbmQoY29tcG9zZShvZiwgZikpIDpcbiAgICBuZXcgU3VzcGVuZChmLm1hcChvZikpXG5cbi8qKlxuICogbWFwXG4gKiBAc3VtbWFyeSBtYXAgOjogRnJlZTxGLEE+IOKGkiAgKEEg4oaSICBCKSAg4oaSICBGcmVlPEYsIEI+XG4gKi9cbmV4cG9ydCBjb25zdCBtYXAgPSBmciA9PiBmID0+IGZyLmNoYWluKGNvbXBvc2Uob2YsIGlzRnVuY3Rpb24oZikpKTtcblxuLyoqXG4gKiBjaGFpblxuICogQHN1bW1hcnkgY2hhaW4gOjogRnJlZTxGLEE+IOKGkiAgKEEg4oaSICBGcmVlPEYsQikg4oaSICBGcmVlPEYsQj5cbiAqL1xuZXhwb3J0IGNvbnN0IGNoYWluID0gZnIgPT4gZyA9PiBtYXRjaChmcilcbiAgICAuY2FzZU9mKFN1c3BlbmQsICh7IGYgfSkgPT4gKHR5cGVvZiBmci5mID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgIG5ldyBTdXNwZW5kKHggPT4gZih4KS5jaGFpbihpc0Z1bmN0aW9uKGcpKSkgOlxuICAgICAgICBuZXcgU3VzcGVuZChmLm1hcChmcmVlID0+IGZyZWUuY2hhaW4oaXNGdW5jdGlvbihnKSkpKSlcbiAgICAuY2FzZU9mKFJldHVybiwgKHsgYSB9KSA9PiBpc0Z1bmN0aW9uKGcpLmNhbGwobnVsbCwgYSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIHJlc3VtZSB0aGUgbmV4dCBzdGFnZSBvZiB0aGUgY29tcHV0YXRpb25cbiAqIEBzdW1tYXJ5IHJlc3VtZSA6OiBGcmVlPEY8Kj4sQT4g4oaSICBFaXRoZXI8RjxGcmVlPEYsQT4+LCBBPlxuICovXG5leHBvcnQgY29uc3QgcmVzdW1lID0gZnIgPT4gbWF0Y2goZnIpXG4gICAgLmNhc2VPZihTdXNwZW5kLCAoeyBmIH0pID0+IGxlZnQoZikpXG4gICAgLmNhc2VPZihSZXR1cm4sICh7IGEgfSkgPT4gcmlnaHQoYSkpXG4gICAgLmVuZCgpO1xuXG4vKipcbiAqIGdvIHJ1bnMgdGhlIGNvbXB1dGF0aW9uIHRvIGNvbXBsZXRpb24gdXNpbmcgZiB0byBleHRyYWN0IGVhY2ggc3RhZ2UuXG4gKiBAc3VtbW1hcnkgZ28gOjogRnJlZTxGPCo+LCBBPiDihpIgIChGPEZyZWU8RixBPj4g4oaSICBGcmVlPEYsQT4pIOKGkiAgQVxuICovXG5leHBvcnQgY29uc3QgZ28gPSBmciA9PiBmID0+IG1hdGNoKGZyKVxuICAgIC5jYXNlT2YoU3VzcGVuZCwgc3VzID0+IHtcblxuICAgICAgICBsZXQgciA9IHN1cy5yZXN1bWUoKTtcblxuICAgICAgICB3aGlsZSAociBpbnN0YW5jZW9mIExlZnQpXG4gICAgICAgICAgICByID0gKGlzRnVuY3Rpb24oZikoci5sZWZ0KCkpKS5yZXN1bWUoKTtcblxuICAgICAgICByZXR1cm4gci5yaWdodCgpO1xuXG4gICAgfSlcbiAgICAuY2FzZU9mKFJldHVybiwgKHsgYSB9KSA9PiBhKVxuICAgIC5lbmQoKTtcblxuLyoqXG4gKiBydW4gdGhlIEZyZWUgY2hhaW4gdG8gY29tcGxldGlvblxuICogQHN1bW1hcnkgcnVuIDo6IEZyZWU8QeKGkiBBLEE+IOKGkiAgQVxuICovXG5leHBvcnQgY29uc3QgcnVuID0gZnIgPT4gZnIuZ28oZiA9PiBmKCkpO1xuIl19
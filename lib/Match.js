'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.match = exports.UnMatched = exports.Matched = exports.Match = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _beof = require('beof');

var _beof2 = _interopRequireDefault(_beof);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Match provides an api for functional match expressions.
 * @abstract
 */
var Match = exports.Match = function () {
    function Match(value) {
        _classCallCheck(this, Match);

        this.value = value;
    }

    /**
     * caseOf
     * @summary (class|string|boolean|number, class|string|boolean|number →  *) →  Match
     */


    _createClass(Match, [{
        key: 'caseOf',
        value: function caseOf() {

            return this;
        }

        /**
         * end executes the left function if the value was unmatched and returns the result
         * otherwise does the same with the right function.
         * @summary (* →  *, * → *) →  Match
         */

    }, {
        key: 'end',
        value: function end(l, r) {

            (0, _beof2.default)({ l: l }).function();
            (0, _beof2.default)({ r: r }).function();

            return this instanceof UnMatched ? l(this.value) : r(this.value);
        }
    }]);

    return Match;
}();

/**
 * Matched
 */


var Matched = exports.Matched = function (_Match) {
    _inherits(Matched, _Match);

    function Matched() {
        _classCallCheck(this, Matched);

        return _possibleConstructorReturn(this, (Matched.__proto__ || Object.getPrototypeOf(Matched)).apply(this, arguments));
    }

    _createClass(Matched, [{
        key: 'caseOf',
        value: function caseOf() {

            return this;
        }
    }]);

    return Matched;
}(Match);

/**
 * UnMatched
 */


var UnMatched = exports.UnMatched = function (_Match2) {
    _inherits(UnMatched, _Match2);

    function UnMatched() {
        _classCallCheck(this, UnMatched);

        return _possibleConstructorReturn(this, (UnMatched.__proto__ || Object.getPrototypeOf(UnMatched)).apply(this, arguments));
    }

    _createClass(UnMatched, [{
        key: 'caseOf',
        value: function caseOf(type, f) {

            switch (typeof type === 'undefined' ? 'undefined' : _typeof(type)) {

                case 'string':
                case 'number':
                case 'boolean':
                    return type === this.value ? new Matched(f(this.value)) : new UnMatched(this.value);

                case 'function':
                    return this.value instanceof type ? new Matched(f(this.value)) : new UnMatched(this.value);

                case 'object':
                    return type == null ? this.value == null ? new Matched(f(this.value)) : new UnMatched(this) : this.value === type ? new Matched(f(this.value)) : new UnMatched(this);

                default:
                    return new UnMatched(this.value);

            }
        }
    }]);

    return UnMatched;
}(Match);

/**
 * match a value against some conditions.
 * @summary * →  UnMatched
 */


var match = exports.match = function match(v) {
    return new UnMatched(v);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYXRjaC5qcyJdLCJuYW1lcyI6WyJNYXRjaCIsInZhbHVlIiwibCIsInIiLCJmdW5jdGlvbiIsIlVuTWF0Y2hlZCIsIk1hdGNoZWQiLCJ0eXBlIiwiZiIsIm1hdGNoIiwidiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7SUFJYUEsSyxXQUFBQSxLO0FBRVQsbUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFFZixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs7aUNBSVM7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7Ozs0QkFLSUMsQyxFQUFHQyxDLEVBQUc7O0FBRU4sZ0NBQUssRUFBRUQsSUFBRixFQUFMLEVBQVlFLFFBQVo7QUFDQSxnQ0FBSyxFQUFFRCxJQUFGLEVBQUwsRUFBWUMsUUFBWjs7QUFFQSxtQkFBUSxnQkFBZ0JDLFNBQWpCLEdBQThCSCxFQUFFLEtBQUtELEtBQVAsQ0FBOUIsR0FBOENFLEVBQUUsS0FBS0YsS0FBUCxDQUFyRDtBQUVIOzs7Ozs7QUFLTDs7Ozs7SUFHYUssTyxXQUFBQSxPOzs7Ozs7Ozs7OztpQ0FFQTs7QUFFTCxtQkFBTyxJQUFQO0FBRUg7Ozs7RUFOd0JOLEs7O0FBVTdCOzs7OztJQUdhSyxTLFdBQUFBLFM7Ozs7Ozs7Ozs7OytCQUVGRSxJLEVBQU1DLEMsRUFBRzs7QUFFWiwyQkFBZUQsSUFBZix5Q0FBZUEsSUFBZjs7QUFFSSxxQkFBSyxRQUFMO0FBQ0EscUJBQUssUUFBTDtBQUNBLHFCQUFLLFNBQUw7QUFDSSwyQkFBUUEsU0FBUyxLQUFLTixLQUFmLEdBQ0gsSUFBSUssT0FBSixDQUFZRSxFQUFFLEtBQUtQLEtBQVAsQ0FBWixDQURHLEdBQzBCLElBQUlJLFNBQUosQ0FBYyxLQUFLSixLQUFuQixDQURqQzs7QUFHSixxQkFBSyxVQUFMO0FBQ0ksMkJBQVEsS0FBS0EsS0FBTCxZQUFzQk0sSUFBdkIsR0FDSCxJQUFJRCxPQUFKLENBQVlFLEVBQUUsS0FBS1AsS0FBUCxDQUFaLENBREcsR0FDMEIsSUFBSUksU0FBSixDQUFjLEtBQUtKLEtBQW5CLENBRGpDOztBQUdKLHFCQUFLLFFBQUw7QUFDSSwyQkFBUU0sUUFBUSxJQUFULEdBQ0ssS0FBS04sS0FBTCxJQUFjLElBQWYsR0FBdUIsSUFBSUssT0FBSixDQUFZRSxFQUFFLEtBQUtQLEtBQVAsQ0FBWixDQUF2QixHQUFvRCxJQUFJSSxTQUFKLENBQWMsSUFBZCxDQUR4RCxHQUVKLEtBQUtKLEtBQUwsS0FBZU0sSUFBaEIsR0FBd0IsSUFBSUQsT0FBSixDQUFZRSxFQUFFLEtBQUtQLEtBQVAsQ0FBWixDQUF4QixHQUFxRCxJQUFJSSxTQUFKLENBQWMsSUFBZCxDQUZ2RDs7QUFJSjtBQUNJLDJCQUFPLElBQUlBLFNBQUosQ0FBYyxLQUFLSixLQUFuQixDQUFQOztBQWxCUjtBQXNCSDs7OztFQTFCMEJELEs7O0FBOEIvQjs7Ozs7O0FBSU8sSUFBTVMsd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQUssSUFBSUosU0FBSixDQUFjSyxDQUFkLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6Ik1hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGJlb2YgZnJvbSAnYmVvZic7XG5cbi8qKlxuICogTWF0Y2ggcHJvdmlkZXMgYW4gYXBpIGZvciBmdW5jdGlvbmFsIG1hdGNoIGV4cHJlc3Npb25zLlxuICogQGFic3RyYWN0XG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaCB7XG5cbiAgICBjb25zdHJ1Y3Rvcih2YWx1ZSkge1xuXG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNhc2VPZlxuICAgICAqIEBzdW1tYXJ5IChjbGFzc3xzdHJpbmd8Ym9vbGVhbnxudW1iZXIsIGNsYXNzfHN0cmluZ3xib29sZWFufG51bWJlciDihpIgICopIOKGkiAgTWF0Y2hcbiAgICAgKi9cbiAgICBjYXNlT2YoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBlbmQgZXhlY3V0ZXMgdGhlIGxlZnQgZnVuY3Rpb24gaWYgdGhlIHZhbHVlIHdhcyB1bm1hdGNoZWQgYW5kIHJldHVybnMgdGhlIHJlc3VsdFxuICAgICAqIG90aGVyd2lzZSBkb2VzIHRoZSBzYW1lIHdpdGggdGhlIHJpZ2h0IGZ1bmN0aW9uLlxuICAgICAqIEBzdW1tYXJ5ICgqIOKGkiAgKiwgKiDihpIgKikg4oaSICBNYXRjaFxuICAgICAqL1xuICAgIGVuZChsLCByKSB7XG5cbiAgICAgICAgYmVvZih7IGwgfSkuZnVuY3Rpb24oKTtcbiAgICAgICAgYmVvZih7IHIgfSkuZnVuY3Rpb24oKTtcblxuICAgICAgICByZXR1cm4gKHRoaXMgaW5zdGFuY2VvZiBVbk1hdGNoZWQpID8gbCh0aGlzLnZhbHVlKSA6IHIodGhpcy52YWx1ZSk7XG5cbiAgICB9XG5cblxufVxuXG4vKipcbiAqIE1hdGNoZWRcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdGNoZWQgZXh0ZW5kcyBNYXRjaCB7XG5cbiAgICBjYXNlT2YoKSB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBVbk1hdGNoZWRcbiAqL1xuZXhwb3J0IGNsYXNzIFVuTWF0Y2hlZCBleHRlbmRzIE1hdGNoIHtcblxuICAgIGNhc2VPZih0eXBlLCBmKSB7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZSA9PT0gdGhpcy52YWx1ZSkgP1xuICAgICAgICAgICAgICAgICAgICBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgaW5zdGFuY2VvZiB0eXBlKSA/XG4gICAgICAgICAgICAgICAgICAgIG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKTtcblxuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGUgPT0gbnVsbCkgP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgKHRoaXMudmFsdWUgPT0gbnVsbCkgPyBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcylcbiAgICAgICAgICAgICAgICA6ICh0aGlzLnZhbHVlID09PSB0eXBlKSA/IG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzKVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG4vKipcbiAqIG1hdGNoIGEgdmFsdWUgYWdhaW5zdCBzb21lIGNvbmRpdGlvbnMuXG4gKiBAc3VtbWFyeSAqIOKGkiAgVW5NYXRjaGVkXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRjaCA9IHYgPT4gbmV3IFVuTWF0Y2hlZCh2KTtcbiJdfQ==
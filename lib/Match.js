'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.UnMatchedPatternError = UnMatchedPatternError;

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * UnMatchedPatternError
 */
function UnMatchedPatternError(pattern) {

    this.message = 'Unable to match the pattern ' + ('\'' + ((typeof pattern === 'undefined' ? 'undefined' : _typeof(pattern)) === 'object' ? pattern.constructor.name : pattern) + '\'!');

    this.stack = new Error(this.message).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace')) Error.captureStackTrace(this, this.constructor);
}

UnMatchedPatternError.prototype = Object.create(Error.prototype);
UnMatchedPatternError.prototype.constructor = UnMatchedPatternError;

exports.default = UnMatchedPatternError;
/**
 * Match provides a pattern matching api for javascript functions.
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
         * end pattern matching and return the result, if nothing matched, an
         * UnmatchedPatternError will be thrown.
         * @summary () →  Match
         */

    }, {
        key: 'end',
        value: function end() {

            if (this instanceof UnMatched) throw new UnMatchedPatternError(this.value);

            return this.value;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYXRjaC5qcyJdLCJuYW1lcyI6WyJVbk1hdGNoZWRQYXR0ZXJuRXJyb3IiLCJwYXR0ZXJuIiwibWVzc2FnZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsInN0YWNrIiwiRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImNhcHR1cmVTdGFja1RyYWNlIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiTWF0Y2giLCJ2YWx1ZSIsIlVuTWF0Y2hlZCIsIk1hdGNoZWQiLCJ0eXBlIiwiZiIsIm1hdGNoIiwidiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztRQUdnQkEscUIsR0FBQUEscUI7Ozs7Ozs7O0FBSGhCOzs7QUFHTyxTQUFTQSxxQkFBVCxDQUErQkMsT0FBL0IsRUFBd0M7O0FBRTNDLFNBQUtDLE9BQUwsR0FBZSwwQ0FDTixRQUFPRCxPQUFQLHlDQUFPQSxPQUFQLE9BQW1CLFFBQW5CLEdBQTZCQSxRQUFRRSxXQUFSLENBQW9CQyxJQUFqRCxHQUF3REgsT0FEbEQsVUFBZjs7QUFHQSxTQUFLSSxLQUFMLEdBQWMsSUFBSUMsS0FBSixDQUFVLEtBQUtKLE9BQWYsQ0FBRCxDQUEwQkcsS0FBdkM7QUFDQSxTQUFLRCxJQUFMLEdBQVksS0FBS0QsV0FBTCxDQUFpQkMsSUFBN0I7O0FBRUEsUUFBSUUsTUFBTUMsY0FBTixDQUFxQixtQkFBckIsQ0FBSixFQUNJRCxNQUFNRSxpQkFBTixDQUF3QixJQUF4QixFQUE4QixLQUFLTCxXQUFuQztBQUlQOztBQUVESCxzQkFBc0JTLFNBQXRCLEdBQWtDQyxPQUFPQyxNQUFQLENBQWNMLE1BQU1HLFNBQXBCLENBQWxDO0FBQ0FULHNCQUFzQlMsU0FBdEIsQ0FBZ0NOLFdBQWhDLEdBQThDSCxxQkFBOUM7O2tCQUVlQSxxQjtBQUNmOzs7OztJQUlhWSxLLFdBQUFBLEs7QUFFVCxtQkFBWUMsS0FBWixFQUFtQjtBQUFBOztBQUVmLGFBQUtBLEtBQUwsR0FBYUEsS0FBYjtBQUVIOztBQUVEOzs7Ozs7OztpQ0FJUzs7QUFFTCxtQkFBTyxJQUFQO0FBRUg7O0FBRUQ7Ozs7Ozs7OzhCQUtNOztBQUVGLGdCQUFJLGdCQUFnQkMsU0FBcEIsRUFDSSxNQUFNLElBQUlkLHFCQUFKLENBQTBCLEtBQUthLEtBQS9CLENBQU47O0FBRUosbUJBQU8sS0FBS0EsS0FBWjtBQUVIOzs7Ozs7QUFLTDs7Ozs7SUFHYUUsTyxXQUFBQSxPOzs7Ozs7Ozs7OztpQ0FFQTs7QUFFTCxtQkFBTyxJQUFQO0FBRUg7Ozs7RUFOd0JILEs7O0FBVTdCOzs7OztJQUdhRSxTLFdBQUFBLFM7Ozs7Ozs7Ozs7OytCQUVGRSxJLEVBQU1DLEMsRUFBRzs7QUFFWiwyQkFBZUQsSUFBZix5Q0FBZUEsSUFBZjs7QUFFSSxxQkFBSyxRQUFMO0FBQ0EscUJBQUssUUFBTDtBQUNBLHFCQUFLLFNBQUw7QUFDSSwyQkFBUUEsU0FBUyxLQUFLSCxLQUFmLEdBQ0gsSUFBSUUsT0FBSixDQUFZRSxFQUFFLEtBQUtKLEtBQVAsQ0FBWixDQURHLEdBQzBCLElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQURqQzs7QUFHSixxQkFBSyxVQUFMO0FBQ0ksMkJBQVEsS0FBS0EsS0FBTCxZQUFzQkcsSUFBdkIsR0FDSCxJQUFJRCxPQUFKLENBQVlFLEVBQUUsS0FBS0osS0FBUCxDQUFaLENBREcsR0FDMEIsSUFBSUMsU0FBSixDQUFjLEtBQUtELEtBQW5CLENBRGpDOztBQUdKLHFCQUFLLFFBQUw7QUFDSSwyQkFBUUcsUUFBUSxJQUFULEdBQ0YsS0FBS0gsS0FBTCxJQUFjLElBQWYsR0FBdUIsSUFBSUUsT0FBSixDQUFZRSxFQUFFLEtBQUtKLEtBQVAsQ0FBWixDQUF2QixHQUFvRCxJQUFJQyxTQUFKLENBQWMsSUFBZCxDQURqRCxHQUVGLEtBQUtELEtBQUwsS0FBZUcsSUFBaEIsR0FBd0IsSUFBSUQsT0FBSixDQUFZRSxFQUFFLEtBQUtKLEtBQVAsQ0FBWixDQUF4QixHQUFxRCxJQUFJQyxTQUFKLENBQWMsSUFBZCxDQUZ6RDs7QUFJSjtBQUNJLDJCQUFPLElBQUlBLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQUFQOztBQWxCUjtBQXNCSDs7OztFQTFCMEJELEs7O0FBOEIvQjs7Ozs7O0FBSU8sSUFBTU0sd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQUssSUFBSUosU0FBSixDQUFjSyxDQUFkLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6Ik1hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVbk1hdGNoZWRQYXR0ZXJuRXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFVuTWF0Y2hlZFBhdHRlcm5FcnJvcihwYXR0ZXJuKSB7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBgVW5hYmxlIHRvIG1hdGNoIHRoZSBwYXR0ZXJuIGAgK1xuICAgICAgICBgJyR7IHR5cGVvZiBwYXR0ZXJuID09PSAnb2JqZWN0Jz8gcGF0dGVybi5jb25zdHJ1Y3Rvci5uYW1lIDogcGF0dGVybiB9JyFgO1xuXG4gICAgdGhpcy5zdGFjayA9IChuZXcgRXJyb3IodGhpcy5tZXNzYWdlKSkuc3RhY2s7XG4gICAgdGhpcy5uYW1lID0gdGhpcy5jb25zdHJ1Y3Rvci5uYW1lO1xuXG4gICAgaWYgKEVycm9yLmhhc093blByb3BlcnR5KCdjYXB0dXJlU3RhY2tUcmFjZScpKVxuICAgICAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCB0aGlzLmNvbnN0cnVjdG9yKTtcblxuXG5cbn1cblxuVW5NYXRjaGVkUGF0dGVybkVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblVuTWF0Y2hlZFBhdHRlcm5FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBVbk1hdGNoZWRQYXR0ZXJuRXJyb3I7XG5cbmV4cG9ydCBkZWZhdWx0IFVuTWF0Y2hlZFBhdHRlcm5FcnJvclxuLyoqXG4gKiBNYXRjaCBwcm92aWRlcyBhIHBhdHRlcm4gbWF0Y2hpbmcgYXBpIGZvciBqYXZhc2NyaXB0IGZ1bmN0aW9ucy5cbiAqIEBhYnN0cmFjdFxuICovXG5leHBvcnQgY2xhc3MgTWF0Y2gge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYXNlT2ZcbiAgICAgKiBAc3VtbWFyeSAoY2xhc3N8c3RyaW5nfGJvb2xlYW58bnVtYmVyLCBjbGFzc3xzdHJpbmd8Ym9vbGVhbnxudW1iZXIg4oaSICAqKSDihpIgIE1hdGNoXG4gICAgICovXG4gICAgY2FzZU9mKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZW5kIHBhdHRlcm4gbWF0Y2hpbmcgYW5kIHJldHVybiB0aGUgcmVzdWx0LCBpZiBub3RoaW5nIG1hdGNoZWQsIGFuXG4gICAgICogVW5tYXRjaGVkUGF0dGVybkVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAqIEBzdW1tYXJ5ICgpIOKGkiAgTWF0Y2hcbiAgICAgKi9cbiAgICBlbmQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVbk1hdGNoZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVW5NYXRjaGVkUGF0dGVybkVycm9yKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBNYXRjaGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaGVkIGV4dGVuZHMgTWF0Y2gge1xuXG4gICAgY2FzZU9mKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG59XG5cbi8qKlxuICogVW5NYXRjaGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBVbk1hdGNoZWQgZXh0ZW5kcyBNYXRjaCB7XG5cbiAgICBjYXNlT2YodHlwZSwgZikge1xuXG4gICAgICAgIHN3aXRjaCAodHlwZW9mIHR5cGUpIHtcblxuICAgICAgICAgICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICBjYXNlICdib29sZWFuJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGUgPT09IHRoaXMudmFsdWUpID9cbiAgICAgICAgICAgICAgICAgICAgbmV3IE1hdGNoZWQoZih0aGlzLnZhbHVlKSkgOiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpO1xuXG4gICAgICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0aGlzLnZhbHVlIGluc3RhbmNlb2YgdHlwZSkgP1xuICAgICAgICAgICAgICAgICAgICBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlID09IG51bGwpID9cbiAgICAgICAgICAgICAgICAgICAgKHRoaXMudmFsdWUgPT0gbnVsbCkgPyBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcykgOlxuICAgICAgICAgICAgICAgICAgICAodGhpcy52YWx1ZSA9PT0gdHlwZSkgPyBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcylcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbn1cblxuLyoqXG4gKiBtYXRjaCBhIHZhbHVlIGFnYWluc3Qgc29tZSBjb25kaXRpb25zLlxuICogQHN1bW1hcnkgKiDihpIgIFVuTWF0Y2hlZFxuICovXG5leHBvcnQgY29uc3QgbWF0Y2ggPSB2ID0+IG5ldyBVbk1hdGNoZWQodik7XG4iXX0=
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.match = exports.UnMatched = exports.Matched = exports.Match = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.UnMatchedPatternError = UnMatchedPatternError;

var _util = require('../util');

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * UnMatchedPatternError
 */
function UnMatchedPatternError(pattern) {

    this.message = 'Unable to match value ' + ('\'' + ((typeof pattern === 'undefined' ? 'undefined' : _typeof(pattern)) === 'object' ? '(object) ' + pattern.constructor.name : pattern) + '\' with a pattern!');

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
    }, {
        key: 'orElse',
        value: function orElse() {

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
        key: 'orElse',


        /**
         * orElse matches when all other options have been exhausted.
         * @param {function} f
         * @return {Matched}
         * @summary { (*→ *) →  Matched }
         */
        value: function orElse(f) {

            if (typeof f !== 'function') throw new TypeError('orElse(): expected a function got \'' + (typeof f === 'undefined' ? 'undefined' : _typeof(f)) + '\'');

            return new Matched(f(this.value));
        }
    }, {
        key: 'caseOf',
        value: function caseOf(type, f) {

            (0, _util.isFunction)(f);

            switch (typeof type === 'undefined' ? 'undefined' : _typeof(type)) {

                case 'string':
                case 'number':
                case 'boolean':
                    return type === this.value ? new Matched(f(this.value)) : new UnMatched(this.value);

                case 'function':
                    return this.value instanceof type ? new Matched(f(this.value)) : new UnMatched(this.value);

                case 'object':
                    return type == null ? this.value == null ? new Matched(f(this.value)) : new UnMatched(this.value) : this.value === type ? new Matched(f(this.value)) : new UnMatched(this.value);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9mcGwvY29udHJvbC9NYXRjaC5qcyJdLCJuYW1lcyI6WyJVbk1hdGNoZWRQYXR0ZXJuRXJyb3IiLCJwYXR0ZXJuIiwibWVzc2FnZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsInN0YWNrIiwiRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImNhcHR1cmVTdGFja1RyYWNlIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiTWF0Y2giLCJ2YWx1ZSIsIlVuTWF0Y2hlZCIsIk1hdGNoZWQiLCJmIiwiVHlwZUVycm9yIiwidHlwZSIsIm1hdGNoIiwidiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFJZ0JBLHFCLEdBQUFBLHFCOztBQUpoQjs7Ozs7Ozs7QUFDQTs7O0FBR08sU0FBU0EscUJBQVQsQ0FBK0JDLE9BQS9CLEVBQXdDOztBQUUzQyxTQUFLQyxPQUFMLEdBQWUsb0NBQ04sUUFBT0QsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFuQixHQUE2QixjQUFhQSxRQUFRRSxXQUFSLENBQW9CQyxJQUE5RCxHQUFxRUgsT0FEL0QseUJBQWY7O0FBR0EsU0FBS0ksS0FBTCxHQUFjLElBQUlDLEtBQUosQ0FBVSxLQUFLSixPQUFmLENBQUQsQ0FBMEJHLEtBQXZDO0FBQ0EsU0FBS0QsSUFBTCxHQUFZLEtBQUtELFdBQUwsQ0FBaUJDLElBQTdCOztBQUVBLFFBQUlFLE1BQU1DLGNBQU4sQ0FBcUIsbUJBQXJCLENBQUosRUFDSUQsTUFBTUUsaUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsS0FBS0wsV0FBbkM7QUFFUDs7QUFFREgsc0JBQXNCUyxTQUF0QixHQUFrQ0MsT0FBT0MsTUFBUCxDQUFjTCxNQUFNRyxTQUFwQixDQUFsQztBQUNBVCxzQkFBc0JTLFNBQXRCLENBQWdDTixXQUFoQyxHQUE4Q0gscUJBQTlDOztrQkFFZUEscUI7QUFDZjs7Ozs7SUFJYVksSyxXQUFBQSxLO0FBRVQsbUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFFZixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs7aUNBSVM7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7Ozs4QkFLTTs7QUFFRixnQkFBSSxnQkFBZ0JDLFNBQXBCLEVBQ0ksTUFBTSxJQUFJZCxxQkFBSixDQUEwQixLQUFLYSxLQUEvQixDQUFOOztBQUVKLG1CQUFPLEtBQUtBLEtBQVo7QUFFSDs7Ozs7O0FBS0w7Ozs7O0lBR2FFLE8sV0FBQUEsTzs7Ozs7Ozs7OztFQUFnQkgsSzs7QUFFN0I7Ozs7O0lBR2FFLFMsV0FBQUEsUzs7Ozs7Ozs7Ozs7OztBQUVUOzs7Ozs7K0JBTU9FLEMsRUFBRzs7QUFFTixnQkFBSSxPQUFPQSxDQUFQLEtBQWEsVUFBakIsRUFDSSxNQUFNLElBQUlDLFNBQUosa0RBQTJERCxDQUEzRCx5Q0FBMkRBLENBQTNELFVBQU47O0FBRUosbUJBQU8sSUFBSUQsT0FBSixDQUFZQyxFQUFFLEtBQUtILEtBQVAsQ0FBWixDQUFQO0FBRUg7OzsrQkFFTUssSSxFQUFNRixDLEVBQUc7O0FBRVosa0NBQVdBLENBQVg7O0FBRUEsMkJBQWVFLElBQWYseUNBQWVBLElBQWY7O0FBRUkscUJBQUssUUFBTDtBQUNBLHFCQUFLLFFBQUw7QUFDQSxxQkFBSyxTQUFMO0FBQ0ksMkJBQVFBLFNBQVMsS0FBS0wsS0FBZixHQUNILElBQUlFLE9BQUosQ0FBWUMsRUFBRSxLQUFLSCxLQUFQLENBQVosQ0FERyxHQUMwQixJQUFJQyxTQUFKLENBQWMsS0FBS0QsS0FBbkIsQ0FEakM7O0FBR0oscUJBQUssVUFBTDtBQUNJLDJCQUFRLEtBQUtBLEtBQUwsWUFBc0JLLElBQXZCLEdBQ0gsSUFBSUgsT0FBSixDQUFZQyxFQUFFLEtBQUtILEtBQVAsQ0FBWixDQURHLEdBQzBCLElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQURqQzs7QUFHSixxQkFBSyxRQUFMO0FBQ0ksMkJBQVFLLFFBQVEsSUFBVCxHQUNGLEtBQUtMLEtBQUwsSUFBYyxJQUFmLEdBQXVCLElBQUlFLE9BQUosQ0FBWUMsRUFBRSxLQUFLSCxLQUFQLENBQVosQ0FBdkIsR0FBb0QsSUFBSUMsU0FBSixDQUFjLEtBQUtELEtBQW5CLENBRGpELEdBRUYsS0FBS0EsS0FBTCxLQUFlSyxJQUFoQixHQUF3QixJQUFJSCxPQUFKLENBQVlDLEVBQUUsS0FBS0gsS0FBUCxDQUFaLENBQXhCLEdBQXFELElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQUZ6RDs7QUFJSjtBQUNJLDJCQUFPLElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQUFQOztBQWxCUjtBQXNCSDs7OztFQTNDMEJELEs7O0FBK0MvQjs7Ozs7O0FBSU8sSUFBTU8sd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQUssSUFBSUwsU0FBSixDQUFjTSxDQUFkLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6Ik1hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwnO1xuLyoqXG4gKiBVbk1hdGNoZWRQYXR0ZXJuRXJyb3JcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIFVuTWF0Y2hlZFBhdHRlcm5FcnJvcihwYXR0ZXJuKSB7XG5cbiAgICB0aGlzLm1lc3NhZ2UgPSBgVW5hYmxlIHRvIG1hdGNoIHZhbHVlIGAgK1xuICAgICAgICBgJyR7IHR5cGVvZiBwYXR0ZXJuID09PSAnb2JqZWN0Jz8gJyhvYmplY3QpICcgK3BhdHRlcm4uY29uc3RydWN0b3IubmFtZSA6IHBhdHRlcm4gfScgd2l0aCBhIHBhdHRlcm4hYDtcblxuICAgIHRoaXMuc3RhY2sgPSAobmV3IEVycm9yKHRoaXMubWVzc2FnZSkpLnN0YWNrO1xuICAgIHRoaXMubmFtZSA9IHRoaXMuY29uc3RydWN0b3IubmFtZTtcblxuICAgIGlmIChFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSlcbiAgICAgICAgRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGhpcywgdGhpcy5jb25zdHJ1Y3Rvcik7XG5cbn1cblxuVW5NYXRjaGVkUGF0dGVybkVycm9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcblVuTWF0Y2hlZFBhdHRlcm5FcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBVbk1hdGNoZWRQYXR0ZXJuRXJyb3I7XG5cbmV4cG9ydCBkZWZhdWx0IFVuTWF0Y2hlZFBhdHRlcm5FcnJvclxuLyoqXG4gKiBNYXRjaCBwcm92aWRlcyBhIHBhdHRlcm4gbWF0Y2hpbmcgYXBpIGZvciBqYXZhc2NyaXB0IGZ1bmN0aW9ucy5cbiAqIEBhYnN0cmFjdFxuICovXG5leHBvcnQgY2xhc3MgTWF0Y2gge1xuXG4gICAgY29uc3RydWN0b3IodmFsdWUpIHtcblxuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjYXNlT2ZcbiAgICAgKiBAc3VtbWFyeSAoY2xhc3N8c3RyaW5nfGJvb2xlYW58bnVtYmVyLCBjbGFzc3xzdHJpbmd8Ym9vbGVhbnxudW1iZXIg4oaSICAqKSDihpIgIE1hdGNoXG4gICAgICovXG4gICAgY2FzZU9mKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgb3JFbHNlKCkge1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZW5kIHBhdHRlcm4gbWF0Y2hpbmcgYW5kIHJldHVybiB0aGUgcmVzdWx0LCBpZiBub3RoaW5nIG1hdGNoZWQsIGFuXG4gICAgICogVW5tYXRjaGVkUGF0dGVybkVycm9yIHdpbGwgYmUgdGhyb3duLlxuICAgICAqIEBzdW1tYXJ5ICgpIOKGkiAgTWF0Y2hcbiAgICAgKi9cbiAgICBlbmQoKSB7XG5cbiAgICAgICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBVbk1hdGNoZWQpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVW5NYXRjaGVkUGF0dGVybkVycm9yKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuXG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBNYXRjaGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBNYXRjaGVkIGV4dGVuZHMgTWF0Y2gge31cblxuLyoqXG4gKiBVbk1hdGNoZWRcbiAqL1xuZXhwb3J0IGNsYXNzIFVuTWF0Y2hlZCBleHRlbmRzIE1hdGNoIHtcblxuICAgIC8qKlxuICAgICAqIG9yRWxzZSBtYXRjaGVzIHdoZW4gYWxsIG90aGVyIG9wdGlvbnMgaGF2ZSBiZWVuIGV4aGF1c3RlZC5cbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBmXG4gICAgICogQHJldHVybiB7TWF0Y2hlZH1cbiAgICAgKiBAc3VtbWFyeSB7ICgq4oaSICopIOKGkiAgTWF0Y2hlZCB9XG4gICAgICovXG4gICAgb3JFbHNlKGYpIHtcblxuICAgICAgICBpZiAodHlwZW9mIGYgIT09ICdmdW5jdGlvbicpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBvckVsc2UoKTogZXhwZWN0ZWQgYSBmdW5jdGlvbiBnb3QgJyR7dHlwZW9mIGZ9J2ApO1xuXG4gICAgICAgIHJldHVybiBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKTtcblxuICAgIH1cblxuICAgIGNhc2VPZih0eXBlLCBmKSB7XG5cbiAgICAgICAgaXNGdW5jdGlvbihmKTtcblxuICAgICAgICBzd2l0Y2ggKHR5cGVvZiB0eXBlKSB7XG5cbiAgICAgICAgICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICAgICAgICBjYXNlICdudW1iZXInOlxuICAgICAgICAgICAgY2FzZSAnYm9vbGVhbic6XG4gICAgICAgICAgICAgICAgcmV0dXJuICh0eXBlID09PSB0aGlzLnZhbHVlKSA/XG4gICAgICAgICAgICAgICAgICAgIG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKTtcblxuICAgICAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgICAgICAgIHJldHVybiAodGhpcy52YWx1ZSBpbnN0YW5jZW9mIHR5cGUpID9cbiAgICAgICAgICAgICAgICAgICAgbmV3IE1hdGNoZWQoZih0aGlzLnZhbHVlKSkgOiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpO1xuXG4gICAgICAgICAgICBjYXNlICdvYmplY3QnOlxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZSA9PSBudWxsKSA/XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnZhbHVlID09IG51bGwpID8gbmV3IE1hdGNoZWQoZih0aGlzLnZhbHVlKSkgOiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpIDpcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMudmFsdWUgPT09IHR5cGUpID8gbmV3IE1hdGNoZWQoZih0aGlzLnZhbHVlKSkgOiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpXG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBVbk1hdGNoZWQodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG59XG5cbi8qKlxuICogbWF0Y2ggYSB2YWx1ZSBhZ2FpbnN0IHNvbWUgY29uZGl0aW9ucy5cbiAqIEBzdW1tYXJ5ICog4oaSICBVbk1hdGNoZWRcbiAqL1xuZXhwb3J0IGNvbnN0IG1hdGNoID0gdiA9PiBuZXcgVW5NYXRjaGVkKHYpO1xuIl19
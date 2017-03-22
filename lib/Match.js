'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.match = exports.UnMatched = exports.Matched = exports.Match = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.UnMatchedPatternError = UnMatchedPatternError;

var _util = require('./util');

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYXRjaC5qcyJdLCJuYW1lcyI6WyJVbk1hdGNoZWRQYXR0ZXJuRXJyb3IiLCJwYXR0ZXJuIiwibWVzc2FnZSIsImNvbnN0cnVjdG9yIiwibmFtZSIsInN0YWNrIiwiRXJyb3IiLCJoYXNPd25Qcm9wZXJ0eSIsImNhcHR1cmVTdGFja1RyYWNlIiwicHJvdG90eXBlIiwiT2JqZWN0IiwiY3JlYXRlIiwiTWF0Y2giLCJ2YWx1ZSIsIlVuTWF0Y2hlZCIsIk1hdGNoZWQiLCJmIiwiVHlwZUVycm9yIiwidHlwZSIsIm1hdGNoIiwidiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7UUFJZ0JBLHFCLEdBQUFBLHFCOztBQUpoQjs7Ozs7Ozs7QUFDQTs7O0FBR08sU0FBU0EscUJBQVQsQ0FBK0JDLE9BQS9CLEVBQXdDOztBQUUzQyxTQUFLQyxPQUFMLEdBQWUsMENBQ04sUUFBT0QsT0FBUCx5Q0FBT0EsT0FBUCxPQUFtQixRQUFuQixHQUE2QkEsUUFBUUUsV0FBUixDQUFvQkMsSUFBakQsR0FBd0RILE9BRGxELFVBQWY7O0FBR0EsU0FBS0ksS0FBTCxHQUFjLElBQUlDLEtBQUosQ0FBVSxLQUFLSixPQUFmLENBQUQsQ0FBMEJHLEtBQXZDO0FBQ0EsU0FBS0QsSUFBTCxHQUFZLEtBQUtELFdBQUwsQ0FBaUJDLElBQTdCOztBQUVBLFFBQUlFLE1BQU1DLGNBQU4sQ0FBcUIsbUJBQXJCLENBQUosRUFDSUQsTUFBTUUsaUJBQU4sQ0FBd0IsSUFBeEIsRUFBOEIsS0FBS0wsV0FBbkM7QUFFUDs7QUFFREgsc0JBQXNCUyxTQUF0QixHQUFrQ0MsT0FBT0MsTUFBUCxDQUFjTCxNQUFNRyxTQUFwQixDQUFsQztBQUNBVCxzQkFBc0JTLFNBQXRCLENBQWdDTixXQUFoQyxHQUE4Q0gscUJBQTlDOztrQkFFZUEscUI7QUFDZjs7Ozs7SUFJYVksSyxXQUFBQSxLO0FBRVQsbUJBQVlDLEtBQVosRUFBbUI7QUFBQTs7QUFFZixhQUFLQSxLQUFMLEdBQWFBLEtBQWI7QUFFSDs7QUFFRDs7Ozs7Ozs7aUNBSVM7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOzs7aUNBRVE7O0FBRUwsbUJBQU8sSUFBUDtBQUVIOztBQUVEOzs7Ozs7Ozs4QkFLTTs7QUFFRixnQkFBSSxnQkFBZ0JDLFNBQXBCLEVBQ0ksTUFBTSxJQUFJZCxxQkFBSixDQUEwQixLQUFLYSxLQUEvQixDQUFOOztBQUVKLG1CQUFPLEtBQUtBLEtBQVo7QUFFSDs7Ozs7O0FBS0w7Ozs7O0lBR2FFLE8sV0FBQUEsTzs7Ozs7Ozs7OztFQUFnQkgsSzs7QUFFN0I7Ozs7O0lBR2FFLFMsV0FBQUEsUzs7Ozs7Ozs7Ozs7OztBQUVUOzs7Ozs7K0JBTU9FLEMsRUFBRzs7QUFFTixnQkFBSSxPQUFPQSxDQUFQLEtBQWEsVUFBakIsRUFDSSxNQUFNLElBQUlDLFNBQUosa0RBQTJERCxDQUEzRCx5Q0FBMkRBLENBQTNELFVBQU47O0FBRUosbUJBQU8sSUFBSUQsT0FBSixDQUFZQyxFQUFFLEtBQUtILEtBQVAsQ0FBWixDQUFQO0FBRUg7OzsrQkFFTUssSSxFQUFNRixDLEVBQUc7O0FBRVosa0NBQVdBLENBQVg7O0FBRUEsMkJBQWVFLElBQWYseUNBQWVBLElBQWY7O0FBRUkscUJBQUssUUFBTDtBQUNBLHFCQUFLLFFBQUw7QUFDQSxxQkFBSyxTQUFMO0FBQ0ksMkJBQVFBLFNBQVMsS0FBS0wsS0FBZixHQUNILElBQUlFLE9BQUosQ0FBWUMsRUFBRSxLQUFLSCxLQUFQLENBQVosQ0FERyxHQUMwQixJQUFJQyxTQUFKLENBQWMsS0FBS0QsS0FBbkIsQ0FEakM7O0FBR0oscUJBQUssVUFBTDtBQUNJLDJCQUFRLEtBQUtBLEtBQUwsWUFBc0JLLElBQXZCLEdBQ0gsSUFBSUgsT0FBSixDQUFZQyxFQUFFLEtBQUtILEtBQVAsQ0FBWixDQURHLEdBQzBCLElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQURqQzs7QUFHSixxQkFBSyxRQUFMO0FBQ0ksMkJBQVFLLFFBQVEsSUFBVCxHQUNGLEtBQUtMLEtBQUwsSUFBYyxJQUFmLEdBQXVCLElBQUlFLE9BQUosQ0FBWUMsRUFBRSxLQUFLSCxLQUFQLENBQVosQ0FBdkIsR0FBb0QsSUFBSUMsU0FBSixDQUFjLEtBQUtELEtBQW5CLENBRGpELEdBRUYsS0FBS0EsS0FBTCxLQUFlSyxJQUFoQixHQUF3QixJQUFJSCxPQUFKLENBQVlDLEVBQUUsS0FBS0gsS0FBUCxDQUFaLENBQXhCLEdBQXFELElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQUZ6RDs7QUFJSjtBQUNJLDJCQUFPLElBQUlDLFNBQUosQ0FBYyxLQUFLRCxLQUFuQixDQUFQOztBQWxCUjtBQXNCSDs7OztFQTNDMEJELEs7O0FBK0MvQjs7Ozs7O0FBSU8sSUFBTU8sd0JBQVEsU0FBUkEsS0FBUTtBQUFBLFdBQUssSUFBSUwsU0FBSixDQUFjTSxDQUFkLENBQUw7QUFBQSxDQUFkIiwiZmlsZSI6Ik1hdGNoLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbCc7XG4vKipcbiAqIFVuTWF0Y2hlZFBhdHRlcm5FcnJvclxuICovXG5leHBvcnQgZnVuY3Rpb24gVW5NYXRjaGVkUGF0dGVybkVycm9yKHBhdHRlcm4pIHtcblxuICAgIHRoaXMubWVzc2FnZSA9IGBVbmFibGUgdG8gbWF0Y2ggdGhlIHBhdHRlcm4gYCArXG4gICAgICAgIGAnJHsgdHlwZW9mIHBhdHRlcm4gPT09ICdvYmplY3QnPyBwYXR0ZXJuLmNvbnN0cnVjdG9yLm5hbWUgOiBwYXR0ZXJuIH0nIWA7XG5cbiAgICB0aGlzLnN0YWNrID0gKG5ldyBFcnJvcih0aGlzLm1lc3NhZ2UpKS5zdGFjaztcbiAgICB0aGlzLm5hbWUgPSB0aGlzLmNvbnN0cnVjdG9yLm5hbWU7XG5cbiAgICBpZiAoRXJyb3IuaGFzT3duUHJvcGVydHkoJ2NhcHR1cmVTdGFja1RyYWNlJykpXG4gICAgICAgIEVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRoaXMsIHRoaXMuY29uc3RydWN0b3IpO1xuXG59XG5cblVuTWF0Y2hlZFBhdHRlcm5FcnJvci5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5Vbk1hdGNoZWRQYXR0ZXJuRXJyb3IucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVW5NYXRjaGVkUGF0dGVybkVycm9yO1xuXG5leHBvcnQgZGVmYXVsdCBVbk1hdGNoZWRQYXR0ZXJuRXJyb3Jcbi8qKlxuICogTWF0Y2ggcHJvdmlkZXMgYSBwYXR0ZXJuIG1hdGNoaW5nIGFwaSBmb3IgamF2YXNjcmlwdCBmdW5jdGlvbnMuXG4gKiBAYWJzdHJhY3RcbiAqL1xuZXhwb3J0IGNsYXNzIE1hdGNoIHtcblxuICAgIGNvbnN0cnVjdG9yKHZhbHVlKSB7XG5cbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY2FzZU9mXG4gICAgICogQHN1bW1hcnkgKGNsYXNzfHN0cmluZ3xib29sZWFufG51bWJlciwgY2xhc3N8c3RyaW5nfGJvb2xlYW58bnVtYmVyIOKGkiAgKikg4oaSICBNYXRjaFxuICAgICAqL1xuICAgIGNhc2VPZigpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIG9yRWxzZSgpIHtcblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVuZCBwYXR0ZXJuIG1hdGNoaW5nIGFuZCByZXR1cm4gdGhlIHJlc3VsdCwgaWYgbm90aGluZyBtYXRjaGVkLCBhblxuICAgICAqIFVubWF0Y2hlZFBhdHRlcm5FcnJvciB3aWxsIGJlIHRocm93bi5cbiAgICAgKiBAc3VtbWFyeSAoKSDihpIgIE1hdGNoXG4gICAgICovXG4gICAgZW5kKCkge1xuXG4gICAgICAgIGlmICh0aGlzIGluc3RhbmNlb2YgVW5NYXRjaGVkKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFVuTWF0Y2hlZFBhdHRlcm5FcnJvcih0aGlzLnZhbHVlKTtcblxuICAgICAgICByZXR1cm4gdGhpcy52YWx1ZTtcblxuICAgIH1cblxuXG59XG5cbi8qKlxuICogTWF0Y2hlZFxuICovXG5leHBvcnQgY2xhc3MgTWF0Y2hlZCBleHRlbmRzIE1hdGNoIHt9XG5cbi8qKlxuICogVW5NYXRjaGVkXG4gKi9cbmV4cG9ydCBjbGFzcyBVbk1hdGNoZWQgZXh0ZW5kcyBNYXRjaCB7XG5cbiAgICAvKipcbiAgICAgKiBvckVsc2UgbWF0Y2hlcyB3aGVuIGFsbCBvdGhlciBvcHRpb25zIGhhdmUgYmVlbiBleGhhdXN0ZWQuXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gZlxuICAgICAqIEByZXR1cm4ge01hdGNoZWR9XG4gICAgICogQHN1bW1hcnkgeyAoKuKGkiAqKSDihpIgIE1hdGNoZWQgfVxuICAgICAqL1xuICAgIG9yRWxzZShmKSB7XG5cbiAgICAgICAgaWYgKHR5cGVvZiBmICE9PSAnZnVuY3Rpb24nKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihgb3JFbHNlKCk6IGV4cGVjdGVkIGEgZnVuY3Rpb24gZ290ICcke3R5cGVvZiBmfSdgKTtcblxuICAgICAgICByZXR1cm4gbmV3IE1hdGNoZWQoZih0aGlzLnZhbHVlKSk7XG5cbiAgICB9XG5cbiAgICBjYXNlT2YodHlwZSwgZikge1xuXG4gICAgICAgIGlzRnVuY3Rpb24oZik7XG5cbiAgICAgICAgc3dpdGNoICh0eXBlb2YgdHlwZSkge1xuXG4gICAgICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICAgICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgICAgICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgICAgICAgICAgIHJldHVybiAodHlwZSA9PT0gdGhpcy52YWx1ZSkgP1xuICAgICAgICAgICAgICAgICAgICBuZXcgTWF0Y2hlZChmKHRoaXMudmFsdWUpKSA6IG5ldyBVbk1hdGNoZWQodGhpcy52YWx1ZSk7XG5cbiAgICAgICAgICAgIGNhc2UgJ2Z1bmN0aW9uJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHRoaXMudmFsdWUgaW5zdGFuY2VvZiB0eXBlKSA/XG4gICAgICAgICAgICAgICAgICAgIG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKTtcblxuICAgICAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gKHR5cGUgPT0gbnVsbCkgP1xuICAgICAgICAgICAgICAgICAgICAodGhpcy52YWx1ZSA9PSBudWxsKSA/IG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKSA6XG4gICAgICAgICAgICAgICAgICAgICh0aGlzLnZhbHVlID09PSB0eXBlKSA/IG5ldyBNYXRjaGVkKGYodGhpcy52YWx1ZSkpIDogbmV3IFVuTWF0Y2hlZCh0aGlzLnZhbHVlKVxuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVW5NYXRjaGVkKHRoaXMudmFsdWUpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxufVxuXG4vKipcbiAqIG1hdGNoIGEgdmFsdWUgYWdhaW5zdCBzb21lIGNvbmRpdGlvbnMuXG4gKiBAc3VtbWFyeSAqIOKGkiAgVW5NYXRjaGVkXG4gKi9cbmV4cG9ydCBjb25zdCBtYXRjaCA9IHYgPT4gbmV3IFVuTWF0Y2hlZCh2KTtcbiJdfQ==
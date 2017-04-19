"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * UnMatchedPatternError
 */
function UnMatchedPatternError(pattern) {
    this.message = "Unable to match value " +
        ("'" + (typeof pattern === 'object' ? '(object) ' + pattern.constructor.name : pattern) + "' with a pattern!");
    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;
    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);
}
exports.UnMatchedPatternError = UnMatchedPatternError;
UnMatchedPatternError.prototype = Object.create(Error.prototype);
UnMatchedPatternError.prototype.constructor = UnMatchedPatternError;
/**
 * Matched
 */
var Matched = (function () {
    function Matched(value) {
        this.value = value;
    }
    Matched.prototype.caseOf = function (_t, _f) {
        return this;
    };
    Matched.prototype.orElse = function (_f) {
        return this;
    };
    Matched.prototype.end = function () {
        return this.value;
    };
    return Matched;
}());
exports.Matched = Matched;
/**
 * UnMatched
 */
var UnMatched = (function () {
    function UnMatched(value) {
        this.value = value;
    }
    UnMatched.prototype.caseOf = function (t, f) {
        if (typeof t === 'boolean') {
            if (typeof this.value === 'boolean')
                if (t === this.value)
                    return new Matched(f(this.value));
        }
        else if (typeof t === 'number') {
            if (typeof this.value === 'number')
                if (t === this.value)
                    return new Matched(f(this.value));
        }
        else if (typeof t === 'string') {
            if (typeof this.value === 'string')
                if (t === this.value)
                    return new Matched(f(this.value));
        }
        else if (t == null) {
            if (this.value == null)
                return new Matched(f(this.value));
        }
        else if (this.value instanceof t) {
            return new Matched(f(this.value));
        }
        return new UnMatched(this.value);
    };
    UnMatched.prototype.orElse = function (f) {
        return new Matched(f(this.value));
    };
    UnMatched.prototype.end = function () {
        throw new UnMatchedPatternError(this.value);
        return this.value;
    };
    return UnMatched;
}());
exports.UnMatched = UnMatched;
/**
 * match a value against some conditions.
 */
exports.match = function (t) { return new UnMatched(t); };
//# sourceMappingURL=Match.js.map
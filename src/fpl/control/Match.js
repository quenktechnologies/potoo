import { isFunction } from '../util';
/**
 * UnMatchedPatternError
 */
export function UnMatchedPatternError(pattern) {

    this.message = `Unable to match value ` +
        `'${ typeof pattern === 'object'? '(object) ' +pattern.constructor.name : pattern }' with a pattern!`;

    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

UnMatchedPatternError.prototype = Object.create(Error.prototype);
UnMatchedPatternError.prototype.constructor = UnMatchedPatternError;

export default UnMatchedPatternError
/**
 * Match provides a pattern matching api for javascript functions.
 * @abstract
 */
export class Match {

    constructor(value) {

        this.value = value;

    }

    /**
     * caseOf
     * @summary (class|string|boolean|number, class|string|boolean|number →  *) →  Match
     */
    caseOf() {

        return this;

    }

    orElse() {

        return this;

    }

    /**
     * end pattern matching and return the result, if nothing matched, an
     * UnmatchedPatternError will be thrown.
     * @summary () →  Match
     */
    end() {

        if (this instanceof UnMatched)
            throw new UnMatchedPatternError(this.value);

        return this.value;

    }


}

/**
 * Matched
 */
export class Matched extends Match {}

/**
 * UnMatched
 */
export class UnMatched extends Match {

    /**
     * orElse matches when all other options have been exhausted.
     * @param {function} f
     * @return {Matched}
     * @summary { (*→ *) →  Matched }
     */
    orElse(f) {

        if (typeof f !== 'function')
            throw new TypeError(`orElse(): expected a function got '${typeof f}'`);

        return new Matched(f(this.value));

    }

    caseOf(type, f) {

        isFunction(f);

        switch (typeof type) {

            case 'string':
            case 'number':
            case 'boolean':
                return (type === this.value) ?
                    new Matched(f(this.value)) : new UnMatched(this.value);

            case 'function':
                return (this.value instanceof type) ?
                    new Matched(f(this.value)) : new UnMatched(this.value);

            case 'object':
                return (type == null) ?
                    (this.value == null) ? new Matched(f(this.value)) : new UnMatched(this.value) :
                    (this.value === type) ? new Matched(f(this.value)) : new UnMatched(this.value)

            default:
                return new UnMatched(this.value);

        }

    }

}

/**
 * match a value against some conditions.
 * @summary * →  UnMatched
 */
export const match = v => new UnMatched(v);

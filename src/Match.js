/**
 * UnMatchedPatternError
 */
export function UnMatchedPatternError(pattern) {

    this.message = `Unable to match the pattern ` +
        `'${ typeof pattern === 'object'? pattern.constructor.name : pattern }'!`;

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
export class Matched extends Match {

    caseOf() {

        return this;

    }

}

/**
 * UnMatched
 */
export class UnMatched extends Match {

    caseOf(type, f) {

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
                    (this.value == null) ? new Matched(f(this.value)) : new UnMatched(this) :
                    (this.value === type) ? new Matched(f(this.value)) : new UnMatched(this)

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

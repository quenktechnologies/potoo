import beof from 'beof';

/**
 * Match provides an api for functional match expressions.
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
     * end executes the left function if the value was unmatched and returns the result
     * otherwise does the same with the right function.
     * @summary (* →  *, * → *) →  Match
     */
    end(l, r) {

        beof({ l }).function();
        beof({ r }).function();

        return (this instanceof UnMatched) ? l(this.value) : r(this.value);

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
                           (this.value == null) ? new Matched(f(this.value)) : new UnMatched(this)
                : (this.value === type) ? new Matched(f(this.value)) : new UnMatched(this)

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

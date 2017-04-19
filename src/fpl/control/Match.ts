export interface Type<T> { new (...args): T }

export interface Match<A> {

    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<B>;

    orElse<B>(f: (a: A) => B): Match<B>;

    end(): A;

}

/**
 * UnMatchedPatternError
 */
export function UnMatchedPatternError(pattern) {

    this.message = `Unable to match value ` +
        `'${typeof pattern === 'object' ? '(object) ' + pattern.constructor.name : pattern}' with a pattern!`;

    this.stack = (new Error(this.message)).stack;
    this.name = this.constructor.name;

    if (Error.hasOwnProperty('captureStackTrace'))
        Error.captureStackTrace(this, this.constructor);

}

UnMatchedPatternError.prototype = Object.create(Error.prototype);
UnMatchedPatternError.prototype.constructor = UnMatchedPatternError;

/**
 * Matched
 */
export class Matched<A> implements Match<A> {

    value: A;

    constructor(value: A) {

        this.value = value;

    }

    caseOf<B>(t: string, f: (a: string) => B): Match<A>;
    caseOf<B>(t: number, f: (a: number) => B): Match<A>;
    caseOf<B>(t: boolean, f: (a: boolean) => B): Match<A>;
    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<A | B>;
    caseOf<B>(_t: any, _f: (a: any) => B): Match<A | B> {

        return this;

    }

    orElse<B>(_f: (a: A) => B): Match<A> {

        return this;

    }

    end(): A {

        return this.value;

    }

}

/**
 * UnMatched
 */
export class UnMatched<A> implements Match<A> {

    value: A;

    constructor(value: A) {

        this.value = value;

    }

    caseOf<B>(t: string, f: (a: string) => B): Match<A | B>;
    caseOf<B>(t: number, f: (a: number) => B): Match<A | B>;
    caseOf<B>(t: boolean, f: (a: boolean) => B): Match<A | B>;
    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<A | B>;
    caseOf<B>(t: any, f: (a: any) => B): Match<A | B> {

        if (typeof t === 'boolean') {

            if (typeof this.value === 'boolean')
                if (t === this.value)
                    return new Matched(f(this.value));

        } else if (typeof t === 'number') {

            if (typeof this.value === 'number')
                if (t === this.value)
                    return new Matched(f(this.value));

        } else if (typeof t === 'string') {
            if (typeof this.value === 'string')
                if (t === this.value)
                    return new Matched(f(this.value));

        } else if (t == null) {

            if (this.value == null)
                return new Matched(f(this.value));


        } else if (this.value instanceof t) {
            return new Matched(f(this.value));
        }

        return new UnMatched(this.value);

    }

    orElse<B>(f: (a: A) => B): Match<B> {

        return new Matched(f(this.value));

    }

    end(): A {

        throw new UnMatchedPatternError(this.value);

        return this.value;

    }

}

/**
 * match a value against some conditions.
 */
export const match = <A>(t: A): Match<A> => new UnMatched(t);

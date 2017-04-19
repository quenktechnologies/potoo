export interface Type<T> {
    new (...args: any[]): T;
}
export interface Match<A> {
    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<B>;
    orElse<B>(f: (a: A) => B): Match<B>;
    end(): A;
}
/**
 * UnMatchedPatternError
 */
export declare function UnMatchedPatternError(pattern: any): void;
/**
 * Matched
 */
export declare class Matched<A> implements Match<A> {
    value: A;
    constructor(value: A);
    caseOf<B>(t: string, f: (a: string) => B): Match<A>;
    caseOf<B>(t: number, f: (a: number) => B): Match<A>;
    caseOf<B>(t: boolean, f: (a: boolean) => B): Match<A>;
    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<A | B>;
    orElse<B>(_f: (a: A) => B): Match<A>;
    end(): A;
}
/**
 * UnMatched
 */
export declare class UnMatched<A> implements Match<A> {
    value: A;
    constructor(value: A);
    caseOf<B>(t: string, f: (a: string) => B): Match<A | B>;
    caseOf<B>(t: number, f: (a: number) => B): Match<A | B>;
    caseOf<B>(t: boolean, f: (a: boolean) => B): Match<A | B>;
    caseOf<T, B>(t: Type<T>, f: (a: T) => B): Match<A | B>;
    orElse<B>(f: (a: A) => B): Match<B>;
    end(): A;
}
/**
 * match a value against some conditions.
 */
export declare const match: <A>(t: A) => Match<A>;

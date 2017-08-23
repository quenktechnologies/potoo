export declare type Candidate<T> = string | number | boolean | object | {
    new (...args: any[]): T;
};
export declare type Matched<T> = string | number | boolean | T;
export interface Handler<T> {
    (t: Matched<T>): void;
}
export declare const kinda: (o1: any, o2: any) => boolean;
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    type: Candidate<T>;
    handler: Handler<T>;
    constructor(type: Candidate<T>, handler: Handler<T>);
    _execute(m: any): void;
    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: any): boolean;
}

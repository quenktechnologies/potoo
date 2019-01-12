import { Constructor } from '@quenk/noni/lib/data/type/constructor';
import { Pattern } from '@quenk/noni/lib/data/type';
import { Message } from '../message';
/**
 * Handler function type for Cases.
 */
export declare type Handler<T> = (t: T) => void;
/**
 * Case is provided for situations where it is better to extend
 * the Case class instead of creating new instances.
 */
export declare abstract class Case<T> {
    pattern: Pattern<T>;
    handler: Handler<T>;
    constructor(pattern: NumberConstructor, f: (value: number) => void);
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void);
    constructor(pattern: StringConstructor, f: (value: string) => void);
    constructor(pattern: object, f: (value: {
        [P in keyof T]: Message;
    }) => void);
    constructor(pattern: string, f: (value: string) => void);
    constructor(pattern: number, f: (value: number) => void);
    constructor(pattern: boolean, f: (value: boolean) => void);
    constructor(pattern: Constructor<T>, f: (value: T) => void);
    /**
     * match a message against a pattern.
     *
     * A successful match results in a side effect.
     */
    match(m: Message): boolean;
}
/**
 * ClassCase allows for the selective matching of patterns
 * for processing messages
 */
export declare class ClassCase<T> extends Case<T> {
}
/**
 * DefaultCase matches any message value.
 */
export declare class DefaultCase<T> extends Case<T> {
    handler: Handler<T>;
    constructor(handler: Handler<T>);
    match(m: Message): boolean;
}

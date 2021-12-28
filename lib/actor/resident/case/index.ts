import { test, Type } from '@quenk/noni/lib/data/type';
import { Constructor } from '@quenk/noni/lib/data/type/constructor';
import { Pattern } from '@quenk/noni/lib/data/type';

import { Message } from '../../message';
import { Eff } from '../../';

export { Pattern }

/**
 * Handler function type for Cases.
 */
export type Handler<T> = (t: T) => Eff;

/**
 * Case is provided for situations where it is better to extend 
 * the Case class instead of creating new instances.
 */
export class Case<T> {

    constructor(pattern: NumberConstructor, f: (value: number) => void)
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void)
    constructor(pattern: StringConstructor, f: (value: string) => void)
    constructor(pattern: object, f: (value: { [P in keyof T]: Message }) => void)
    constructor(pattern: string, f: (value: string) => void)
    constructor(pattern: number, f: (value: number) => void)
    constructor(pattern: boolean, f: (value: boolean) => void)
    constructor(pattern: Constructor<T>, f: (value: T) => void)
    constructor(public pattern: Pattern<T>, public handler: Handler<T>) { }

    /**
     * test whether the supplied message satisfies the Case test.
     */
    test(m: Message): boolean {

        return test(m, this.pattern);

    }

    /**
     * apply the handler to the message.
     */
    apply(m: Message): Eff {

        return this.handler(m);

    }

}

/**
 * caseOf is a helper for constructing Case classes.
 *
 * It should be used instead of "new Case(...)"
 */
export function caseOf(pattern: NumberConstructor,
    handler: (value: number) => void): Case<number>
export function caseOf(pattern: BooleanConstructor,
    handler: (value: boolean) => void): Case<boolean>;
export function caseOf(pattern: StringConstructor,
    handler: (value: string) => void): Case<string>;
export function caseOf<T>(pattern: object,
    handler: (value: { [P in keyof T]: Message }) => void): Case<object>;
export function caseOf(pattern: string,
    handler: (value: string) => void): Case<string>;
export function caseOf(pattern: number,
    handler: (value: number) => void): Case<number>;
export function caseOf(pattern: boolean,
    handler: (value: boolean) => void): Case<boolean>;
export function caseOf<T>(pattern: Constructor<T>,
    handler: (value: T) => void): Case<Constructor<T>>;
export function caseOf<T>(pattern: Pattern<T>,
    handler: Handler<T>) : Case<Pattern<T>> 
export function caseOf(pattern:Type, handler:Handler<Type>){
    return new Case(pattern, handler);
}

/**
 * Default matches any message value.
 */
export class Default<T> extends Case<T> {

    constructor(public handler: Handler<T>) {

        super(Object, handler);

    }

    test(_: Message): boolean {

        return true;

    }

    apply(m: Message): Eff {

        return this.handler(m);

    }

}

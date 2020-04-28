import { test } from '@quenk/noni/lib/data/type';
import { Constructor } from '@quenk/noni/lib/data/type/constructor';
import { Pattern } from '@quenk/noni/lib/data/type';

import { Message } from '../message';
import { Eff } from '../';

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

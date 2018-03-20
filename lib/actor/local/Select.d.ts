import { Maybe } from 'afpl/lib/monad/Maybe';
import { System, Envelope } from '../../system';
import { Case } from '.';
/**
 * Select is for selective receives.
 */
export declare class Select<T> {
    cases: Case<T>[];
    system: System;
    constructor(cases: Case<T>[], system: System);
    apply(e: Envelope): Maybe<Select<T>>;
    merge<A>(cases: Case<T>[]): Select<T | A>;
}

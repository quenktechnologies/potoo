import { Pattern, kindOf } from '@quenk/kindof';
import { Message } from '../../../system';
import { Handler } from '../';

/**
 * CaseFunction is a function that given a value produces a Case.
 */
export type CaseFunction<A, M> = (a: A) => Case<M>;

/**
 * CaseListFunction is a function given a value produces a list of Cases.
 */
export type CaseListFunction<A, M> = (a: A) => Case<M>[];

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(public type: Pattern, public handler: Handler<T>) { }

    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: Message): boolean {

        let r = kindOf(m, this.type);

        //setTimeout is needed to keep things going.

        if (r)
            setTimeout(() => this.handler(m), 0);

        return r;

    }

}

/**
 * combine two or more CaseFunctions to produce a single function that when
 * given a value produces an array of Cases.
 */
export const combine = <A, M>(...fs: CaseFunction<A, M>[])
    : CaseListFunction<A, M> => (a: A) => fs.map(f => f(a));

/**
 * combineA combines two or more CaseListFunctions to produce a single function
 * that when given a value produces a combined array of Cases.
 */
export const combineA = <A, M>(...fs: CaseListFunction<A, M>[])
    : CaseListFunction<A, M> => (a: A) => fs.reduce((p, f) => p.concat(f(a)), []);

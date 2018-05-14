import { Pattern } from '@quenk/kindof';
import { Message } from '../../../system';
import { Handler } from '../';
/**
 * CaseFunction is a function that given a value produces a Case.
 */
export declare type CaseFunction<A, M> = (a: A) => Case<M>;
/**
 * CaseListFunction is a function given a value produces a list of Cases.
 */
export declare type CaseListFunction<A, M> = (a: A) => Case<M>[];
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    type: Pattern;
    handler: Handler<T>;
    constructor(type: Pattern, handler: Handler<T>);
    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: Message): boolean;
}
/**
 * combine two or more CaseFunctions to produce a single function that when
 * given a value produces an array of Cases.
 */
export declare const combine: <A, M>(...fs: CaseFunction<A, M>[]) => CaseListFunction<A, M>;
/**
 * combineA combines two or more CaseListFunctions to produce a single function
 * that when given a value produces a combined array of Cases.
 */
export declare const combineA: <A, M>(...fs: CaseListFunction<A, M>[]) => CaseListFunction<A, M>;
export declare const combineA3: <A, M, N, O>(f: CaseListFunction<A, M>, g: CaseListFunction<A, N>, h: CaseListFunction<A, O>) => (a: A) => (Case<M> | Case<N> | Case<O>)[];

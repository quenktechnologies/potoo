/**
 * identity is the famed identity function.
 */
export declare const identity: <A>(a: A) => A;
/**
 * merge two objects easily
 */
export declare const merge: (o1: Object, o2: Object) => Object;
/**
 * reduce an object
 */
export declare const reduce: <A>(o: Object, f: (A: any, string: any, Object: any) => A, i: A) => A;
/**
 * pipe the results of one function into the following.
 */
export declare const pipe: <A, B>(..._f: ((a: A) => B)[]) => (a: A) => B;
/**
 * compose k functions into one.
 */
export declare const composeK: <A, B>(..._f: ((a: A) => B)[]) => (a: A) => B;
/**
 * compose two functions into one.
 */
export declare const compose: <A, B, C>(f: (a: B) => C, g: (a: A) => B) => (x: A) => C;
/**
 * fling removes a key from an object
 * @param {string} key
 * @param {object} object
 * @return {Object}
 * @summary {(string,Object) →  Object}
 */
export declare const fling: (s: any, o: any) => {};
/**
 * head returns the item at index 0 of an array
 * @param {Array} list
 * @return {*}
 * @summary { Array →  * }
 */
export declare const head: (list: any) => any;
/**
 * tail returns the last item in an array
 * @param {Array} list
 * @return {*}
 * @summary {Array →  *}
 */
export declare const tail: (list: any) => any;
/**
 * partial is a poor man's way of turning a function of arity 1-3 into
 * a function that accepts one argumment. Recognizes a Function.length of 3 max
 * @summary {(Function, *) →  (* →  *)}
 */
export declare const partial: <A>(f: Function, a: A) => (b: any, c: any, d: any) => any;
/**
 * constant given a value, return a function that always returns this value.
 * @summary constant X →  * →  X
 *
 */
export declare const constant: <A>(a: A) => (any: any) => A;

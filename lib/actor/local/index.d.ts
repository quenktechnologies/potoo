import { Envelope } from '../../system';
import { Case } from './Case';
export { Case };
export { Local } from './Local';
export { Dynamic } from './Dynamic';
export { Parent } from './Parent';
export { Receive } from './Receive';
export { Select } from './Select';
export { Static } from './Static';
export { Pending } from './Pending';
/**
 * This module provides some primitives for local actors, that is
 * actors that run in the same runtime of the system are generally
 * not concurrent.
 */
export declare type ConsumeResult = Behaviour | null;
/**
 * Behaviour of a dynamic actor.
 */
export interface Behaviour {
    consume<M>(e: Envelope<M>): ConsumeResult;
}
/**
 * Cases means either one Case or an array of them.
 */
export declare type Cases<T> = Case<T> | Case<T>[];
export declare type Candidate<T> = string | number | boolean | object | {
    new (...args: any[]): T;
};
export declare type Matched<T> = string | number | boolean | T;
export interface Handler<T> {
    (t: Matched<T>): void;
}

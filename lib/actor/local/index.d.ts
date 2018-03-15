import { Envelope } from '../../system';
import { Case } from './Case';
export { Case };
export { Local } from './Local';
export { Mutable } from './Mutable';
export { Parent } from './Parent';
export { Receive } from './Receive';
export { Select } from './Select';
export { Immutable } from './Immutable';
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
 * Cases is a list of Case instances that will be applied to a message
 * one by one until one matches.
 */
export declare type Cases<T> = Case<T>[];
/**
 * Handler for a Case.
 */
export interface Handler<T> {
    (t: T): void;
}

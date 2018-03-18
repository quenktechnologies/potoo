import * as Promise from 'bluebird';
import { Envelope } from '../../system';
import { Case } from './Case';
import { Actor, Template, Address } from '..';
export { Case };
export { Resident } from './Resident';
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
    consume(e: Envelope): ConsumeResult;
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
/**
 * LocalActor is an actor that exists in the current runtime.
 */
export interface LocalActor extends Actor {
    /**
     * self retrieves the path of this actor from the system.
     */
    self: () => Address;
    /**
     * spawn a new child actor.
     */
    spawn(t: Template): Address;
    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): LocalActor;
    /**
     * ask for a reply from a message sent to an address.
     */
    ask<M, R>(ref: string, m: M, time: number): Promise<R>;
    /**
     * kill another actor.
     */
    kill(addr: Address): LocalActor;
    /**
     * exit instructs the system to kill of this actor.
     */
    exit(): void;
}
/**
 * SelectiveLocalActor provides an API for preforming selective receives.
 */
export interface SelectiveLocalActor extends LocalActor {
    /**
     * select the next message to be processed, applying each Case
     * until one matches.
     */
    select<T>(c: Cases<T>): SelectiveLocalActor;
}

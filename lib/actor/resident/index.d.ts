import { Err } from '@quenk/noni/lib/control/error';
import { Context } from '../system/vm/runtime/context';
import { System } from '../system';
import { Address, AddressMap } from '../address';
import { Message } from '../message';
import { Templates, Spawnable } from '../template';
import { Actor, Instance, Eff } from '../';
import { Case } from './case';
import { Api } from './api';
/**
 * Reference to an actor address.
 */
export declare type Reference = (m: Message) => void;
/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<S extends System> extends Api<S>, Actor {
}
/**
 * AbstractResident implementation.
 */
export declare abstract class AbstractResident<S extends System> implements Resident<S> {
    system: S;
    constructor(system: S);
    self: () => Address;
    abstract init(c: Context): Context;
    abstract select<T>(_: Case<T>[]): AbstractResident<S>;
    abstract run(): void;
    notify(): void;
    accept(_: Message): void;
    spawn(t: Spawnable<S>): Address;
    spawnGroup(group: string | string[], tmpls: Templates<S>): AddressMap;
    tell<M>(ref: Address, m: M): AbstractResident<S>;
    raise(e: Err): AbstractResident<S>;
    kill(addr: Address): AbstractResident<S>;
    exit(): void;
    start(addr: Address): Eff;
    stop(): void;
}
/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Immutable<T, S extends System> extends AbstractResident<S> {
    /**
     * receive is a static list of Case classes
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];
    init(c: Context): Context;
    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T, S>;
}
/**
 * Temp automatically removes itself from the system after a succesfull match
 * of any of its cases.
 */
export declare abstract class Temp<T, S extends System> extends Immutable<T, S> {
    init(c: Context): Context;
}
/**
 * Mutable actors can change their behaviour after message processing.
 */
export declare abstract class Mutable<S extends System> extends AbstractResident<S> {
    receive: Case<void>[];
    init(c: Context): Context;
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<S>;
}
/**
 * ref produces a function for sending messages to an actor address.
 */
export declare const ref: <S extends System>(res: Resident<S>, addr: Address) => Reference;
/**
 * spawn an actor using the Spawn script.
 */
export declare const spawn: <S extends System>(sys: S, i: Instance, t: Spawnable<S>) => Address;

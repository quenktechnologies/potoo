import { Address } from '../address';
import { Message } from '../message';
import { Envelope } from '../mailbox';
import { System } from '../system';
import { Template } from '../template';
import { Context } from '../context';
import { Case } from './case';
import { Actor } from '../';
import { Api } from './api';
/**
 * Reference to an actor address.
 */
export declare type Reference = (m: Message) => void;
/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<C extends Context, S extends System<C>> extends Api<C, S>, Actor<C> {
}
/**
 * AbstractResident implementation.
 */
export declare abstract class AbstractResident<C extends Context, S extends System<C>> implements Resident<C, S> {
    system: System<C>;
    constructor(system: System<C>);
    abstract init(c: C): C;
    self(): string;
    accept({ to, from, message }: Envelope): this;
    spawn(t: Template<C, S>): Address;
    tell<M>(ref: Address, m: M): AbstractResident<C, S>;
    abstract select<T>(_: Case<T>[]): AbstractResident<C, S>;
    kill(addr: Address): AbstractResident<C, S>;
    exit(): void;
    stop(): void;
    abstract run(): void;
}
/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export declare abstract class Immutable<T, C extends Context, S extends System<C>> extends AbstractResident<C, S> {
    /**
     * receive is a static list of Case classes
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];
    init(c: C): C;
    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T, C, S>;
}
/**
 * Mutable actors can change their behaviour after message processing.
 */
export declare abstract class Mutable<C extends Context, S extends System<C>> extends AbstractResident<C, S> {
    receive: Case<void>[];
    init(c: C): C;
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<C, S>;
}
/**
 * ref produces a function for sending messages to an actor address.
 */
export declare const ref: <C extends Context, S extends System<C>>(res: Resident<C, S>, addr: string) => Reference;

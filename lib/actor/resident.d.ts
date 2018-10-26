import { Address } from './address';
import { Message } from './message';
import { Envelope } from './system/mailbox';
import { System } from './system';
import { Template } from './template';
import { Actor } from './';
/**
 * Ref function type.
 */
export declare type Ref = (addr: Address) => Reference;
/**
 * Self function type.
 */
export declare type Self = () => Address;
/**
 * Reference to an actor address.
 */
export declare type Reference = (m: Message) => void;
export declare type Cons<T> = {
    new (...args: Message[]): T;
};
/**
 * Pattern supported by Case classes.
 */
export declare type Pattern = any;
/**
 * Handler function type for Cases.
 */
export declare type Handler<T> = (t: T) => void;
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    pattern: Pattern;
    handler: Handler<T>;
    constructor(pattern: Cons<T>, f: (value: T) => void);
    constructor(pattern: NumberConstructor, f: (value: number) => void);
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void);
    constructor(pattern: StringConstructor, f: (value: string) => void);
    constructor(pattern: object, f: (value: {
        [P in keyof T]: Message;
    }) => void);
    constructor(pattern: string, f: (value: string) => void);
    constructor(pattern: number, f: (value: number) => void);
    constructor(pattern: boolean, f: (value: boolean) => void);
    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: Message): boolean;
}
/**
 * AbstractCase is provided for situations where
 * it is better to extend the Case class instead of creating
 * new instances.
 */
export declare abstract class AbstractCase<T> extends Case<T> {
    pattern: Message;
    constructor(pattern: Message);
    /**
     * apply consumes a successfully matched message.
     */
    abstract apply(m: T): void;
}
/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident extends Actor {
    /**
     * ref provides a handle for sending mesages to an address.
     */
    ref: Ref;
    /**
     * self retrieves the path of this actor from the system.
     */
    self: Self;
    /**
     * spawn a new child actor.
     */
    spawn(t: Template): Address;
    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Resident;
    /**
     * select the next message to be processed, applying each Case
     * until one matches.
     */
    select<T>(c: Case<T>[]): Resident;
    /**
     * kill a child actor.
     */
    kill(addr: Address): Resident;
    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;
}
/**
 * AbstractResident impleemntation.
 */
export declare abstract class AbstractResident implements Resident {
    system: System;
    constructor(system: System);
    ref: (addr: string) => (m: any) => AbstractResident;
    self: () => string;
    accept({to, from, message}: Envelope): this;
    spawn(t: Template): Address;
    tell<M>(ref: Address, m: M): AbstractResident;
    abstract select<T>(_: Case<T>[]): AbstractResident;
    kill(addr: Address): AbstractResident;
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
export declare abstract class Immutable<T> extends AbstractResident {
    /**
     * receive is a static list of Case classes
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];
    /**
     * onRun hook.
     *
     * Use this instead of overriding the run hook.
     */
    onRun(): void;
    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T>;
    /**
     * run installs an Immutable's behaviour.
     *
     * If this method is overriden super.run() must be called in
     * order for messages to be handled.
     */
    run(): void;
}
/**
 * Mutable actors can change their behaviour after message processing.
 */
export declare abstract class Mutable<T> extends AbstractResident {
    /**
     * receive is a static list of Case classes
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];
    /**
     * onRun hook.
     *
     * Use this instead of overriding the run hook.
     */
    onRun(): void;
    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<T>;
    /**
     * run the actor.
     *
     * If the receive property is populated the actor will
     * automatically start receiving.
     */
    run(): void;
}
import { Constructor } from '@quenk/noni/lib/data/type/constructor';
import { Pattern } from '@quenk/noni/lib/data/type';
import { Address } from './address';
import { Message } from './message';
import { Envelope } from './mailbox';
import { System } from './system';
import { Template } from './template';
import { Context } from './context';
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
/**
 * Handler function type for Cases.
 */
export declare type Handler<T> = (t: T) => void;
/**
 * Case is provided for situations where
 * it is better to extend the Case class instead of creating
 * new instances.
 */
export declare abstract class Case<T> {
    pattern: Pattern<T>;
    constructor(pattern: Pattern<T>);
    /**
     * match a message against a pattern.
     *
     * A successful match results in a side effect.
     */
    match(m: Message): boolean;
    /**
     * apply consumes a successfully matched message.
     */
    abstract apply<V>(m: T): V;
    abstract apply<V>(m: object): V;
    abstract apply<V>(m: string): V;
    abstract apply<V>(m: number): V;
    abstract apply<V>(m: boolean): V;
    abstract apply<V>(m: Message): V;
}
/**
 * CaseClass allows for the selective matching of patterns
 * for processing messages
 */
export declare class CaseClass<T> extends Case<T> {
    pattern: Pattern<T>;
    handler: Handler<T>;
    constructor(pattern: Constructor<T>, f: (value: T) => void);
    constructor(pattern: NumberConstructor, f: (value: number) => void);
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void);
    constructor(pattern: StringConstructor, f: (value: string) => void);
    constructor(pattern: object, f: (value: {
        [P in keyof T]: Message;
    }) => void);
    constructor(pattern: string, f: (value: string) => void);
    constructor(pattern: number, f: (value: number) => void);
    constructor(pattern: boolean, f: (value: boolean) => void);
    apply(m: Message): void;
}
/**
 * Resident is an actor that exists in the current runtime.
 */
export interface Resident<C extends Context, S extends System<C>> extends Actor<C> {
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
     *
    spawn(t: Template<C, S>): Address;

    /**
     * tell a message to an actor address.
     */
    tell<M>(ref: string, m: M): Resident<C, S>;
    /**
     * select the next message to be processed, applying each Case
     * until one matches.
     */
    select<T>(c: Case<T>[]): Resident<C, S>;
    /**
     * kill a child actor.
     */
    kill(addr: Address): Resident<C, S>;
    /**
     * exit instructs the system to kill off this actor.
     */
    exit(): void;
}
/**
 * AbstractResident implementation.
 */
export declare abstract class AbstractResident<C extends Context, S extends System<C>> implements Resident<C, S> {
    system: System<C>;
    constructor(system: System<C>);
    ref: (addr: string) => (m: any) => AbstractResident<C, S>;
    self: () => string;
    abstract init(c: C): C;
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

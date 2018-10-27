import { test } from '@quenk/noni/lib/data/type';
import { fromBoolean } from '@quenk/noni/lib/data/either';
import { fromArray, just } from '@quenk/noni/lib/data/maybe';
import { noop } from '@quenk/noni/lib/data/function';
import { ADDRESS_DISCARD, Address, isRestricted, make } from './address';
import { Message } from './message';
import { Envelope } from './system/mailbox';
import { Spawn } from './system/op/spawn';
import { Tell } from './system/op/tell';
import { Kill } from './system/op/kill';
import { Drop } from './system/op/drop';
import { Receive } from './system/op/receive';
import { System, NullSystem } from './system';
import { Template } from './template';
import { Actor, Initializer } from './';

/**
 * Ref function type.
 */
export type Ref = (addr: Address) => Reference;

/**
 * Self function type.
 */
export type Self = () => Address;

/**
 * Reference to an actor address.
 */
export type Reference = (m: Message) => void;

export type Cons<T> = { new(...args: Message[]): T };

/**
 * Pattern supported by Case classes.
 */
export type Pattern = any;

/**
 * Handler function type for Cases.
 */
export type Handler<T> = (t: T) => void;

/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export class Case<T> {

    constructor(pattern: Cons<T>, f: (value: T) => void)
    constructor(pattern: NumberConstructor, f: (value: number) => void)
    constructor(pattern: BooleanConstructor, f: (value: boolean) => void)
    constructor(pattern: StringConstructor, f: (value: string) => void)
    constructor(pattern: object, f: (value: { [P in keyof T]: Message }) => void)
    constructor(pattern: string, f: (value: string) => void)
    constructor(pattern: number, f: (value: number) => void)
    constructor(pattern: boolean, f: (value: boolean) => void)
    constructor(public pattern: Pattern, public handler: Handler<T>) { }

    /**
     * match checks if the supplied type satisfies this Case
     */
    match(m: Message): boolean {

        if (test(m, this.pattern)) {

            this.handler(m);
            return true;

        } else {

            return false;

        }

    }

}

/**
 * AbstractCase is provided for situations where
 * it is better to extend the Case class instead of creating
 * new instances.
 */
export abstract class AbstractCase<T> extends Case<T> {

    constructor(public pattern: Message) {

        super(pattern, (m: Message) => this.apply(m));

    }

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
export abstract class AbstractResident implements Resident {

    constructor(public system: System) { }

    ref = (addr: Address) => (m: Message) => this.tell(addr, m);

    self = () => this.system.identify(this);

    abstract init(): Initializer;

    accept({ to, from, message }: Envelope) {

        this.system.exec(new Drop(to, from, message));
        return this;

    }

    spawn(t: Template): Address {

        this.system.exec(new Spawn(this, t));

        return isRestricted(t.id) ?
            ADDRESS_DISCARD :
            make(this.self(), t.id);

    }

    tell<M>(ref: Address, m: M): AbstractResident {

        this.system.exec(new Tell(ref, this.self(), m));
        return this;

    }

    abstract select<T>(_: Case<T>[]): AbstractResident;

    kill(addr: Address): AbstractResident {

        this.system.exec(new Kill(addr, this));
        return this;

    }

    exit(): void {

        this.kill(this.self());

    }

    stop(): void {

        this.system = new NullSystem();

    }

    abstract run(): void;

}

/**
 * Immutable actors do not change their behaviour after receiving
 * a message.
 *
 * Once the receive property is provided, all messages will be
 * filtered by it.
 */
export abstract class Immutable<T> extends AbstractResident {

    /**
     * receive is a static list of Case classes 
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];

    init(): Initializer {

        return [        ibehaviour(this),            { immutable: true, buffered: true }        ];

    }

    /**
     * select noop.
     */
    select<M>(_: Case<M>[]): Immutable<T> {

        return this;

    }

}

/**
 * Mutable actors can change their behaviour after message processing.
 */
export abstract class Mutable<T> extends AbstractResident {

    /**
     * receive is a static list of Case classes 
     * that the actor will always use to process messages.
     */
    abstract receive: Case<T>[];

    init(): Initializer {

        return [

          (this.receive.length > 0) ? mbehaviour(this.receive) : undefined,
            { immutable: false, buffered: true }

        ];

    }

    /**
     * select allows for selectively receiving messages based on Case classes.
     */
    select<M>(cases: Case<M>[]): Mutable<T> {

        this.system.exec(new Receive(this.self(), false, mbehaviour(cases)));
        return this;

    }

}

const mbehaviour = <T>(cases: Case<T>[]) => (m: Message) =>
    fromBoolean(cases.some(c => c.match(m)))
        .lmap(() => m)
        .map(noop);

const ibehaviour = <T>(i: Immutable<T>) => (m: Message) =>
    fromBoolean(i.receive.some(c => c.match(m)))
        .lmap(() => m)
        .map(noop);

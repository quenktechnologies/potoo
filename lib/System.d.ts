import * as Promise from 'bluebird';
export declare const INFO = 6;
export declare const WARN = 5;
export declare const ERROR = 1;
/**
 * DuplicateActorPathError
 */
export declare function DuplicateActorPathError(path: any): void;
/**
 * Message is an envelope for user messages.
 */
export declare class Message<M> {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}
/**
 * makeChildPath creates a child path given an actor and a child id
 */
export declare const makeChildPath: (id: string, parent: string) => string;
/**
 * Template represents the minimum amount of information required to create
 * a new actor instance.
 */
export declare abstract class Template {
    id: string;
    constructor(id: string);
    abstract create(path: string, s: System): Context;
}
/**
 * Context represents an actor's context within the system.
 *
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
export declare abstract class Context {
    path: string;
    constructor(path: string);
    abstract feed<M>(m: Message<M>): any;
    abstract start(): any;
}
/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class PendingContext extends Context {
    askee: string;
    original: Context;
    resolve: Function;
    system: System;
    constructor(askee: string, original: Context, resolve: Function, system: System);
    feed<M>(m: Message<M>): void;
    start(): void;
}
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export declare class LocalContext extends Context {
    path: string;
    actorFn: (c: LocalContext) => LocalActor;
    system: System;
    behaviour: Behaviour;
    mailbox: Message<any>[];
    isClearing: boolean;
    constructor(path: string, actorFn: (c: LocalContext) => LocalActor, system: System, behaviour?: Behaviour, mailbox?: Message<any>[], isClearing?: boolean);
    _clear(): boolean;
    _set(b: Behaviour): LocalContext;
    discard<M>(m: Message<M>): void;
    spawn(t: Template): string;
    tell<M>(ref: string, m: M): void;
    ask<M>(ref: string, m: M): Promise<M>;
    select<T>(c: Case<T>[]): void;
    receive<M>(f: (m: M) => void): void;
    feed<M>(m: Message<M>): void;
    start(): void;
}
export interface Handler<T> {
    (t: T): void;
}
/**
 * Case allows for the selective matching of patterns
 * for processing messages
 */
export declare class Case<T> {
    t: T;
    h: Handler<T>;
    constructor(t: T, h: Handler<T>);
    /**
     * matches checks if the supplied type satisfies this Case
     */
    matches<M>(m: M): boolean;
    /**
     * apply the function of this Case to a message
     */
    apply(m: T): void;
}
/**
 * Behaviour of an actor
 */
export interface Behaviour {
    willConsume<M>(m: M): boolean;
    consume<M>(m: M): void;
}
/**
 * MatchAny accepts any value.
 */
export declare class MatchAny<M> implements Behaviour {
    f: (m: M) => void;
    constructor(f: (m: M) => void);
    static create<M>(f: (m: M) => void): MatchAny<M>;
    willConsume(_: M): boolean;
    consume(m: M): void;
}
/**
 * MatchCase
 */
export declare class MatchCase<T> implements Behaviour {
    cases: Case<T>[];
    constructor(cases: Case<T>[]);
    willConsume<M>(m: M): boolean;
    consume(m: T): void;
}
/**
 * LocalTemplate is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
export declare class LocalTemplate extends Template {
    id: string;
    actorFn: (c: LocalContext) => LocalActor;
    constructor(id: string, actorFn: (c: LocalContext) => LocalActor);
    /**
     * from constructs a new Template using the specified parameters.
     */
    static from(id: string, fn: (c: LocalContext) => LocalActor): LocalTemplate;
    create(path: string, s: System): Context;
}
/**
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
export declare class LocalActor {
    context: LocalContext;
    constructor(context: LocalContext);
    /**
     * run is called each time the actor is created.
     */
    run(): void;
    /**
     * self returns the address of this actor.
     */
    self(): string;
    /**
     * spawn a new child actor using the passed template.
     */
    spawn(t: Template): string;
    /**
     * tell sends a message to another actor within the system.
     *
     * The message is sent in a fire and forget fashion.
     */
    tell<M>(ref: string, m: M): void;
    /**
     * ask is an alternative to tell that produces a Promise
     * that is only resolved when the destination sends us
     * a reply.
     */
    ask<M>(ref: string, m: M): any;
    /**
     * select selectively receives the next message in the mailbox.
     */
    select<T>(c: Case<T>[]): void;
    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    receive<M>(f: (m: M) => void): void;
}
/**
 * ASEvent is the superclass of all events generated by
 * the system.
 */
export declare class ASEvent {
}
/**
 * Logger is an interface for intercepting events generated
 * by the actor system.
 */
export interface Logger {
    info(e: ASEvent): any;
    warn(e: ASEvent): any;
    error(e: ASEvent): any;
}
/**
 * ChildSpawnedEvent
 */
export declare class ChildSpawnedEvent extends ASEvent {
    address: string;
    constructor(address: string);
}
/**
 * MessageSentEvent
 */
export declare class MessageSentEvent<M> extends ASEvent {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}
/**
 * MessageDroppedEvent
 */
export declare class MessageDroppedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageReceivedEvent
 */
export declare class MessageReceivedEvent<M> extends MessageSentEvent<M> {
}
/**
 * ReceiveStartedEvent
 */
export declare class ReceiveStartedEvent extends ASEvent {
    path: string;
    constructor(path: string);
}
/**
 * SelectStartedEvent
 */
export declare class SelectStartedEvent extends ReceiveStartedEvent {
}
export interface Configuration {
    log: LoggingPolicy;
}
export interface LoggingPolicy {
    level: number;
    logger: Logger;
}
/**
 * LoggingLogic contains the logic for system logging.
 */
export declare class LoggingLogic {
    policy: LoggingPolicy;
    constructor(policy: LoggingPolicy);
    static createFrom(p: LoggingPolicy): LoggingLogic;
    /**
     * childSpawned
     */
    childSpawned(ref: string): void;
    /**
     * messageDropped
     */
    messageDropped<M>(m: Message<M>): void;
    /**
     * messageSent
     */
    messageSent<M>(m: Message<M>): void;
    /**
     * messageReceived
     */
    messageReceived<M>(m: Message<M>): void;
    /**
     * receiveStarted
     */
    receiveStarted(path: string): void;
    /**
     * selectStarted
     */
    selectStarted(path: string): void;
}
/**
 * System is a system of actors.
 */
export declare class System {
    config: Configuration;
    actors: object;
    logging: LoggingLogic;
    path: string;
    constructor(config?: Configuration, actors?: object, logging?: LoggingLogic, path?: string);
    /**
     * create a new system
     */
    static create(c?: Configuration): System;
    /**
     * spawn a new top level actor within the system.
     */
    spawn(t: Template): System;
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(t: Template, parent: string): string;
    /**
     * dropMessage drops a message.
     */
    dropMessage<M>(m: Message<M>): void;
    /**
     * putContext replaces an actor's context within the system.
     */
    putContext(path: string, context: Context): void;
    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of
     * communication. The message may be processed or stored
     * depending on the target actor's state at the time.
     * If the target actor does not exist, the message is dropped.
     */
    putMessage<M>(to: string, from: string, message: M): void;
    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    askMessage<M>(to: string, from: string, m: M): any;
}
export declare const system: (c?: Configuration) => System;

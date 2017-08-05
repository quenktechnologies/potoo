import * as Promise from 'bluebird';
export declare const INFO = 6;
export declare const WARN = 5;
export declare const ERROR = 1;
/**
 * DuplicateActorPathError
 */
export declare class DuplicateActorPathError extends Error {
    constructor(path: string);
}
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
 * ActorConf represents the minimum amount of information required to create
 * a new actor instance.
 */
export declare abstract class ActorConf<M> {
    id: string;
    constructor(id: string);
    abstract create(path: string, s: System): Context<M>;
}
/**
 * Context represents an actor's context within the system.
 *
 * It stores interesting data as well as provides methods for manipulating
 * the actor's behaviour.
 */
export declare abstract class Context<M> {
    path: string;
    constructor(path: string);
    abstract feed(m: Message<M>): void;
    abstract start(): void;
}
/**
 * PendingContext is used as a placeholder for an actor awaiting a reply.
 *
 * This actor will drop all incomming messages not from the target.
 */
export declare class PendingContext<M> extends Context<M> {
    askee: string;
    original: Context<M>;
    resolve: (m: M) => void;
    system: System;
    constructor(askee: string, original: Context<M>, resolve: (m: M) => void, system: System);
    feed(m: Message<M>): void;
    start(): void;
}
/**
 * LocalContext represents the context of a single local actor.
 *
 * It provides methods for putting the actor model axioms to use.
 */
export declare class LocalContext<M> extends Context<M> {
    path: string;
    actorFn: (c: LocalContext<M>) => LocalActor<M>;
    system: System;
    behaviour: Behaviour<M>;
    mailbox: Message<M>[];
    isClearing: boolean;
    constructor(path: string, actorFn: (c: LocalContext<M>) => LocalActor<M>, system: System, behaviour?: Behaviour<M>, mailbox?: Message<M>[], isClearing?: boolean);
    _clear(): boolean;
    _set(b: Behaviour<M>): LocalContext<M>;
    discard<M>(m: Message<M>): void;
    spawn(t: ActorConf<M>): string;
    tell<M>(ref: string, m: M): void;
    ask<M>(ref: string, m: M): Promise<M>;
    select(c: Case<M>[]): void;
    receive(f: (m: any) => void): void;
    feed(m: Message<M>): void;
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
    t: {
        new (...a: any[]): T;
    } | T;
    h: Handler<T>;
    constructor(t: {
        new (...a: any[]): T;
    } | T, h: Handler<T>);
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
export interface Behaviour<M> {
    willConsume<A>(m: A): boolean;
    consume(m: M): void;
}
/**
 * MatchAny accepts any value.
 */
export declare class MatchAny<M> implements Behaviour<M> {
    f: (m: M) => void;
    constructor(f: (m: M) => void);
    static create<A>(f: (m: A) => void): MatchAny<A>;
    willConsume<A>(_: A): boolean;
    consume(m: M): void;
}
/**
 * MatchCase
 */
export declare class MatchCase<M> implements Behaviour<M> {
    cases: Case<M>[];
    constructor(cases: Case<M>[]);
    willConsume<A>(m: A): boolean;
    consume(m: M): void;
}
/**
 * LocalConf is a template for creating a local actor.
 * @property {string} id
 * @property {function} start
 */
export declare class LocalConf<M> extends ActorConf<M> {
    id: string;
    actorFn: (c: LocalContext<M>) => LocalActor<M>;
    constructor(id: string, actorFn: (c: LocalContext<M>) => LocalActor<M>);
    /**
     * from constructs a new ActorConf using the specified parameters.
     */
    static from<M>(id: string, fn: (c: LocalContext<M>) => LocalActor<M>): LocalConf<M>;
    create(path: string, s: System): Context<M>;
}
/**
 * LocalActor represents an actor in the same address space as the running
 * script.
 *
 * This is the class client code would typically extend and utilize.
 */
export declare class LocalActor<M> {
    context: LocalContext<M>;
    constructor(context: LocalContext<M>);
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
    spawn(t: ActorConf<M>): string;
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
    ask<M>(ref: string, m: M): Promise<M>;
    /**
     * select selectively receives the next message in the mailbox.
     */
    select(c: Case<M>[]): void;
    /**
     * receive the next message in this actor's mail queue using
     * the provided behaviour.
     */
    receive(f: (m: any) => void): void;
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
    info(e: ASEvent): void;
    warn(e: ASEvent): void;
    error(e: ASEvent): void;
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
export interface ActorMap {
    [key: string]: Context<any>;
}
/**
 * System is a system of actors.
 */
export declare class System {
    config: Configuration;
    actors: ActorMap;
    logging: LoggingLogic;
    path: string;
    constructor(config?: Configuration, actors?: ActorMap, logging?: LoggingLogic, path?: string);
    /**
     * create a new system
     */
    static create(c?: Configuration): System;
    /**
     * spawn a new top level actor within the system.
     */
    spawn(t: ActorConf<any>): System;
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(t: ActorConf<any>, parent: string): string;
    /**
     * dropMessage drops a message.
     */
    dropMessage<M>(m: Message<M>): void;
    /**
     * putContext replaces an actor's context within the system.
     */
    putContext(path: string, context: Context<any>): void;
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
    askMessage<M>(to: string, from: string, m: M): Promise<M>;
}
export declare const system: (c?: Configuration) => System;

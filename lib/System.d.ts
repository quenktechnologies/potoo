import * as Promise from 'bluebird';
import * as Events from './Events';
import * as Actor from './Actor';
export declare const INFO = 6;
export declare const WARN = 5;
export declare const ERROR = 1;
/**
 * Configuration for the System
 */
export interface Configuration {
    log: LoggingPolicy;
}
/**
 * Logger is an interface for intercepting events generated
 * by the actor system.
 */
export interface Logger {
    info(e: Events.ASEvent): void;
    warn(e: Events.ASEvent): void;
    error(e: Events.ASEvent): void;
}
/**
 * LoggingPolicy sets what the system should log
 */
export interface LoggingPolicy {
    level: number;
    logger: Logger;
}
/**
 * ContextMap a map of actor contexts.
 */
export interface ActorMap {
    [key: string]: Actor.Actor;
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
    messageDropped(m: Actor.Message): void;
    /**
     * messageSent
     */
    messageSent(m: Actor.Message): void;
    /**
     * messageAccepted
     */
    messageAccepted(m: Actor.Message): void;
    /**
     * messageReceived
     */
    messageReceived(m: Actor.Message): void;
    /**
     * messageRejected
     */
    messageRejected(m: Actor.Message): void;
    /**
     * receiveStarted
     */
    receiveStarted(path: string): void;
    /**
     * selectStarted
     */
    selectStarted(path: string): void;
    /**
     * actorRemoved
     */
    actorRemoved(path: string, reason: number, asker: string): void;
}
/**
 * System is a system of actors.
 */
export declare class System implements Actor.Actor {
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
     * getPath turns an actor into its path
     */
    getPath(a: Actor.Actor): string;
    /**
     * spawn a new top level actor within the system.
     */
    spawn(t: Actor.Conf, args?: any[]): System;
    /**
     * putChild creates a new child actor for a parent within the system.
     */
    putChild(t: Actor.Conf, parent: Actor.Actor, args?: any[]): string;
    /**
     * dropMessage drops a message.
     */
    dropMessage(m: Actor.Message): void;
    /**
     * putContext replaces an actor's context within the system.
     */
    putActor(path: string, actor: Actor.Actor): void;
    /**
     * putMessage places a message into an actor's context.
     *
     * Messages are enveloped to help the system keep track of
     * communication. The message may be processed or stored
     * depending on the target actor's state at the time.
     * If the target actor does not exist, the message is dropped.
     */
    putMessage(m: Actor.Message): void;
    /**
     * askMessage allows an actor to ignore incomming messages unless
     * they have been sent by a specific actor.
     */
    askMessage<M>(m: Actor.Message): Promise<M>;
    /**
     * removeActor removes an actor from the system.
     * @todo should we require an actor be a child before removing?
     */
    removeActor(actor: string, reason: number, asker: string): void;
    run(): void;
    stop(): void;
    accept(m: Actor.Message): void;
}

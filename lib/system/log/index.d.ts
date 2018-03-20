import * as event from './event';
import { Envelope } from '..';
/**
 * This module provides some logging primitives for the system.
 */
/**
 * INFO log level.
 */
export declare const INFO = 6;
/**
 * WARN log level.
 */
export declare const WARN = 5;
/**
 * ERROR log level.
 */
export declare const ERROR = 1;
/**
 * Logger is an interface for intercepting events generated
 * by the actor system.
 */
export interface Logger {
    /**
     * info log.
     */
    info(e: event.Event): void;
    /**
     * warn log.
     */
    warn(e: event.Event): void;
    /**
     * error log.
     */
    error(e: event.Event): void;
}
/**
 * LogPolicy sets what the system should log
 */
export interface LogPolicy {
    /**
     * level of the events to be logged.
     */
    level: number;
    /**
     * logger is the actual logging implemention.
     *
     * It MUST correspond to the basic info,warn and error api of the javascript console.
     */
    logger: Logger;
}
/**
 * LogLogic provides methods for telling the story of the system
 * and its actor's lifecycles.
 *
 */
export interface LogLogic {
    /**
     * log an event.
     *
     * If the event level is less than the current policy level
     * then it will not be logged.
     */
    log(e: event.Event): LogLogic;
    /**
     * error
     */
    error(e: Error): LogLogic;
}
/**
 * SystemLogLogic implementation.
 */
export declare class SystemLogLogic implements LogLogic {
    policy: LogPolicy;
    constructor(policy: LogPolicy);
    static createFrom(p: LogPolicy): SystemLogLogic;
    /**
     * log an event.
     *
     * If the event level is less than the current policy level
     * then it will not be logged.
     */
    log(e: event.Event): SystemLogLogic;
    /**
     * error
     */
    error(e: Error): SystemLogLogic;
    /**
     * childSpawned
     */
    childSpawned(ref: string): void;
    /**
     * messageDropped
     */
    messageDropped(e: Envelope): void;
    /**
     * messageSent
     */
    messageSent(e: Envelope): void;
    /**
     * messageAccepted
     */
    messageAccepted(e: Envelope): void;
    /**
     * messageReceived
     */
    messageReceived(e: Envelope): void;
    /**
     * messageRejected
     */
    messageRejected(e: Envelope): void;
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
    actorRemoved(path: string): void;
}

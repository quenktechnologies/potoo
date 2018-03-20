import * as event from './event';
import { Envelope } from '..';

/**
 * This module provides some logging primitives for the system.
 */

/**
 * INFO log level.
 */
export const INFO = 6;

/**
 * WARN log level.
 */
export const WARN = 5;

/**
 * ERROR log level.
 */
export const ERROR = 1;

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
export class SystemLogLogic implements LogLogic {

    constructor(public policy: LogPolicy) { }

    static createFrom(p: LogPolicy) : SystemLogLogic {

        return new SystemLogLogic(p);

    }

    /**
     * log an event.
     *
     * If the event level is less than the current policy level
     * then it will not be logged.
     */
    log(e: event.Event): SystemLogLogic {

        if (this.policy.level >= e.level)
            if (e.level >= INFO)
                this.policy.logger.info(e);
            else if (e.level >= WARN)
                this.policy.logger.warn(e);
            else if (e.level >= ERROR)
                this.policy.logger.error(e);

        return this;

    }

    /**
     * error
     */
    error(e: Error): SystemLogLogic {

        if (this.policy.level >= ERROR)
            this.policy.logger.error(new event.ErrorEvent(e));

        return this;

    }

    /**
     * childSpawned 
     */
    childSpawned(ref: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.ChildSpawnedEvent(ref));

    }

    /**
     * messageDropped 
     */
    messageDropped(e: Envelope) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new event.MessageDroppedEvent(e.to, e.from, e.message));

    }

    /**
     * messageSent 
     */
    messageSent(e: Envelope) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageSentEvent(e.to, e.from, e.message));

    }

    /**
     * messageAccepted
     */
    messageAccepted(e: Envelope) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageAcceptedEvent(e.to, e.from, e.message));

    }

    /**
     * messageReceived 
     */
    messageReceived(e: Envelope) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageReceivedEvent(e.to, e.from, e.message));

    }

    /**
     * messageRejected
     */
    messageRejected(e: Envelope) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new event.MessageRejectedEvent(e.to, e.from, e.message));

    }

    /**
     * receiveStarted 
     */
    receiveStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.ReceiveStartedEvent(path));

    }

    /**
     * selectStarted 
     */
    selectStarted(path: string) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.SelectStartedEvent(path));

    }

    /**
     * actorRemoved
     */
    actorRemoved(path: string) {

        this.policy.logger.info(new event.ActorRemovedEvent(path))

    }

}

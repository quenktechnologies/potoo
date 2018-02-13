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

    level: number;
    logger: Logger;

}

/**
 * LogLogic provides methods for telling the story of the system
 * and its actor's lifecycles.
 *
 * Actor implementation MUST call the repsective methods
 * as they take action otherwise they will not appear in the system log.
 */
export class LogLogic {

    constructor(public policy: LogPolicy) { }

    static createFrom(p: LogPolicy) {

        return new LogLogic(p);

    }

    /**
     * error
     */
    error(e: Error) {

        if (this.policy.level >= ERROR)
            this.policy.logger.error(new event.ErrorEvent(e));

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
    messageDropped<M>(e: Envelope<M>) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new event.MessageDroppedEvent(e.to, e.from, e.value));

    }

    /**
     * messageSent 
     */
    messageSent<M>(e: Envelope<M>) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageSentEvent(e.to, e.from, e.value));

    }

    /**
     * messageAccepted
     */
    messageAccepted<M>(e: Envelope<M>) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageAcceptedEvent(e.to, e.from, e.value));

    }

    /**
     * messageReceived 
     */
    messageReceived<M>(e: Envelope<M>) {

        if (this.policy.level >= INFO)
            this.policy.logger.info(new event.MessageReceivedEvent(e.to, e.from, e.value));

    }

    /**
     * messageRejected
     */
    messageRejected<M>(e: Envelope<M>) {

        if (this.policy.level >= WARN)
            this.policy.logger.warn(new event.MessageRejectedEvent(e.to, e.from, e.value));

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

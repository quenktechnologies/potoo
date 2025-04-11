import { Address } from '../../../address';
import { Message } from '../../..';
import { LogLevelValue } from '../log';

export const EVENT_MESSGAE_SEND = 'message-send';
export const EVENT_MESSAGE_BOUNCE = 'message-bounce';
export const EVENT_MESSAGE_DROPPED = 'message-dropped';
export const EVENT_MESSAGE_CONSUMED = 'message-consumed';
export const EVENT_ACTOR_ALLOCATED = 'actor-allocated';
export const EVENT_ACTOR_STARTED = 'actor-started';
export const EVENT_ACTOR_STOPPED = 'actor-stopped';
export const EVENT_ACTOR_DEALLOCATED = 'actor-deallocated';
export const EVENT_ACTOR_RECEIVE = 'actor-receive';

/**
 * EventType identifying an event that occurred.
 */
export type EventType = string;

/**
 * InternalEvent is the base class for all potoo events.
 */
export interface InternalEvent {
    /**
     * type of event.
     */
    type: EventType;

    /**
     * level of the event.
     *
     * Used by the log writer to determine when to write the event.
     */
    level: LogLevelValue;

    /**
     * source of the event.
     *
     * All events are associated with either an actor or the system itself.
     */
    source: Address;
}

/**
 * VMEvent is the parent of all events that occur in the VM.
 */
export abstract class VMEvent implements InternalEvent {
    abstract type: EventType;

    abstract level: LogLevelValue;

    constructor(public source: Address) {}
}

/**
 * MessageEvent is the parent of events related to message sending.
 */
export abstract class MessageEvent extends VMEvent {
    constructor(
        public from: Address,
        public to: Address,
        public message: Message
    ) {
        super(from);
    }
}

/**
 * MessageSendEvent is triggered when an actor delivers a message to another
 * actor's thread.
 */
export class MessageSendEvent extends MessageEvent {
    type = EVENT_MESSGAE_SEND;

    level = LogLevelValue.info;
}

/**
 * MessageBounceEvent is triggered when an actor attempts to deliver a message
 * to a thread that no longer exists.
 */
export class MessageBounceEvent extends MessageEvent {
    type = EVENT_MESSAGE_BOUNCE;

    level = LogLevelValue.warn;
}

/**
 * MessageDropEvent is triggered when an actor refuses to process a message it
 * received.
 */
export class MessageDropEvent extends MessageEvent {
    type = EVENT_MESSAGE_DROPPED;

    level = LogLevelValue.warn;
}

/**
 * MessageConsumedEvent is triggered when an actor has consumed a message it
 * received.
 */
export class MessageConsumeEvent extends MessageEvent {
    type = EVENT_MESSAGE_CONSUMED;

    level = LogLevelValue.debug;
}

/**
 * ActorEvent are events related to the lifecycle of an actor.
 */
export abstract class ActorEvent extends VMEvent {
    level = LogLevelValue.info;

    constructor(public address: Address) {
        super(address);
    }
}

/**
 * ActorAllocatedEvent is triggered when an actor is allocated in the system.
 */
export class ActorAllocatedEvent extends ActorEvent {
    type = EVENT_ACTOR_ALLOCATED;
}

/**
 * ActorStartedEvent is triggered when an actor is about to be started by
 * the system.
 */
export class ActorStartedEvent extends ActorEvent {
    type = EVENT_ACTOR_STARTED;
}

/**
 * ActorStoppedEvent is triggered when an actor is stopped by the system.
 */
export class ActorStoppedEvent extends ActorEvent {
    type = EVENT_ACTOR_STOPPED;
}

/**
 * ActorDeallocatedEvent is triggered when an actor is deallocated from the
 * system.
 */
export class ActorDeallocatedEvent extends ActorEvent {
    type = EVENT_ACTOR_DEALLOCATED;
}

/**
 * ActorReceiveEvent is triggered when an actor attempts to receive a message.
 */
export class ActorReceiveEvent extends ActorEvent {
    type = EVENT_ACTOR_RECEIVE;
}

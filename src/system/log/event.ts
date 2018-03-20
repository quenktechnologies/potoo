import * as level from '../log';

/**
 * Event is the superclass of all events logged by the system.
 */
export interface Event {

    /**
     * level of the Event distiguishes its severity.
     */
    level: number;

    /**
     * timestamp of when the event was generated.
     */
    timestamp: number;

}

/**
 * SystemEvent
 */
export abstract class SystemEvent implements Event {

    abstract level: number;

    timestamp = Date.now() / 1000;

}

/**
 * ErrorEvent is generated when an error occurs that does not
 * stop the system from operating.
 *
 * This is typically incorrect actor id names or duplicate actor addresses etc.
 */
export class ErrorEvent extends SystemEvent {

    level = level.ERROR;

    constructor(public error: Error) { super(); }

}

/**
 * ChildSpawnedEvent indicating a child actor has been spawned.
 */
export class ChildSpawnedEvent extends SystemEvent {

    level = level.INFO;

    constructor(public address: string) { super(); }

}

/**
 * MessageSentEvent indicating a message has been sent from one actor to another.
 */
export class MessageSentEvent<M> extends SystemEvent {

    level = level.INFO;

    constructor(public to: string, public from: string, public message: M) { super(); }

}

/**
 * MessageDroppedEvent indicating a message was discarded.
 */
export class MessageDroppedEvent<M> extends MessageSentEvent<M>{

    level = level.WARN;

}

/**
 * MessageAcceptedEvent indicating a message was accepted into a mailbox.
 */
export class MessageAcceptedEvent<M> extends MessageSentEvent<M>{

    level = level.INFO;

}

/**
 * MessageReceivedEvent indicating a message has been processed.
 */
export class MessageReceivedEvent<M> extends MessageSentEvent<M>{

    level = level.INFO;

}

/**
 * MessageRejectedEvent indicating an actor will not receive
 * this or any other messages from the source right now.
 */
export class MessageRejectedEvent<M> extends MessageSentEvent<M>{

    level = level.WARN;

}

/**
 * ReceiveStartedEvent indicates an actor is ready to process messages.
 */
export class ReceiveStartedEvent extends SystemEvent {

    level = level.INFO;

    constructor(public path: string) { super(); }

}

/**
 * SelectStartedEvent indicates an actor is ready to selectively receive messages.
 */
export class SelectStartedEvent extends ReceiveStartedEvent {

    level = level.INFO;

}

/**
 * ActorRemovedEvent indicates an actor was removed from the system.
 */
export class ActorRemovedEvent extends SystemEvent {

    level = level.INFO;

    constructor(public path: string) { super(); }

}

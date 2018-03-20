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
export declare abstract class SystemEvent implements Event {
    abstract level: number;
    timestamp: number;
}
/**
 * ErrorEvent is generated when an error occurs that does not
 * stop the system from operating.
 *
 * This is typically incorrect actor id names or duplicate actor addresses etc.
 */
export declare class ErrorEvent extends SystemEvent {
    error: Error;
    level: number;
    constructor(error: Error);
}
/**
 * ChildSpawnedEvent indicating a child actor has been spawned.
 */
export declare class ChildSpawnedEvent extends SystemEvent {
    address: string;
    level: number;
    constructor(address: string);
}
/**
 * MessageSentEvent indicating a message has been sent from one actor to another.
 */
export declare class MessageSentEvent<M> extends SystemEvent {
    to: string;
    from: string;
    message: M;
    level: number;
    constructor(to: string, from: string, message: M);
}
/**
 * MessageDroppedEvent indicating a message was discarded.
 */
export declare class MessageDroppedEvent<M> extends MessageSentEvent<M> {
    level: number;
}
/**
 * MessageAcceptedEvent indicating a message was accepted into a mailbox.
 */
export declare class MessageAcceptedEvent<M> extends MessageSentEvent<M> {
    level: number;
}
/**
 * MessageReceivedEvent indicating a message has been processed.
 */
export declare class MessageReceivedEvent<M> extends MessageSentEvent<M> {
    level: number;
}
/**
 * MessageRejectedEvent indicating an actor will not receive
 * this or any other messages from the source right now.
 */
export declare class MessageRejectedEvent<M> extends MessageSentEvent<M> {
    level: number;
}
/**
 * ReceiveStartedEvent indicates an actor is ready to process messages.
 */
export declare class ReceiveStartedEvent extends SystemEvent {
    path: string;
    level: number;
    constructor(path: string);
}
/**
 * SelectStartedEvent indicates an actor is ready to selectively receive messages.
 */
export declare class SelectStartedEvent extends ReceiveStartedEvent {
    level: number;
}
/**
 * ActorRemovedEvent indicates an actor was removed from the system.
 */
export declare class ActorRemovedEvent extends SystemEvent {
    path: string;
    level: number;
    constructor(path: string);
}

/**
 * Event is the superclass of all events logged by the system.
 */
export declare class Event {
    /**
     * timestamp of when the event was generated.
     */
    timestamp: number;
}
/**
 * ErrorEvent is generated when an error occurs that does not
 * stop the system from operating.
 *
 * This is typically incorrect actor id names or duplicate actor addresses etc.
 */
export declare class ErrorEvent extends Event {
    error: Error;
    constructor(error: Error);
}
/**
 * ChildSpawnedEvent indicating a child actor has been spawned.
 */
export declare class ChildSpawnedEvent extends Event {
    address: string;
    constructor(address: string);
}
/**
 * MessageSentEvent indicating a message has been sent from one actor to another.
 */
export declare class MessageSentEvent<M> extends Event {
    to: string;
    from: string;
    message: M;
    constructor(to: string, from: string, message: M);
}
/**
 * MessageDroppedEvent indicating a message was discarded.
 */
export declare class MessageDroppedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageAcceptedEvent indicating a message was accepted into a mailbox.
 */
export declare class MessageAcceptedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageReceivedEvent indicating a message has been processed.
 */
export declare class MessageReceivedEvent<M> extends MessageSentEvent<M> {
}
/**
 * MessageRejectedEvent indicating an actor will not receive
 * this or any other messages from the source right now.
 */
export declare class MessageRejectedEvent<M> extends MessageSentEvent<M> {
}
/**
 * ReceiveStartedEvent indicates an actor is ready to process messages.
 */
export declare class ReceiveStartedEvent extends Event {
    path: string;
    constructor(path: string);
}
/**
 * SelectStartedEvent indicates an actor is ready to selectively receive messages.
 */
export declare class SelectStartedEvent extends ReceiveStartedEvent {
}
/**
 * ActorRemovedEvent indicates an actor was removed from the system.
 */
export declare class ActorRemovedEvent extends Event {
    path: string;
    constructor(path: string);
}

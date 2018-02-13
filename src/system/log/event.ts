
/**
 * Event is the superclass of all events logged by the system.
 */
export class Event {

    /**
     * timestamp of when the event was generated.
     */
    timestamp: number = Date.now() / 1000;

}

/**
 * ErrorEvent is generated when an error occurs that does not
 * stop the system from operating.
 *
 * This is typically incorrect actor id names or duplicate actor addresses etc.
 */
export class ErrorEvent extends Event {

    constructor(public error: Error) { super(); }

}

/**
 * ChildSpawnedEvent indicating a child actor has been spawned.
 */
export class ChildSpawnedEvent extends Event {

    constructor(public address: string) { super(); }

}

/**
 * MessageSentEvent indicating a message has been sent from one actor to another.
 */
export class MessageSentEvent<M> extends Event {

    constructor(public to: string, public from: string, public message: M) { super(); }

}

/**
 * MessageDroppedEvent indicating a message was discarded.
 */
export class MessageDroppedEvent<M> extends MessageSentEvent<M>{ }

/**
 * MessageAcceptedEvent indicating a message was accepted into a mailbox.
 */
export class MessageAcceptedEvent<M> extends MessageSentEvent<M>{ }

/**
 * MessageReceivedEvent indicating a message has been processed.
 */
export class MessageReceivedEvent<M> extends MessageSentEvent<M>{ }

/**
 * MessageRejectedEvent indicating an actor will not receive
 * this or any other messages from the source right now.
 */
export class MessageRejectedEvent<M> extends MessageSentEvent<M>{ }

/**
 * ReceiveStartedEvent indicates an actor is ready to process messages.
 */
export class ReceiveStartedEvent extends Event {

    constructor(public path: string) { super(); }

}

/**
 * SelectStartedEvent indicates an actor is ready to selectively receive messages.
 */
export class SelectStartedEvent extends ReceiveStartedEvent { }

/**
 * ActorRemovedEvent indicates an actor was removed from the system.
 */
export class ActorRemovedEvent extends Event {

    constructor(public path: string) { super(); }

}

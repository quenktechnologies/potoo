import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';

import { Address } from '../../address';
import { Message } from '../..';
import { LogWritable } from './log/writer';

export const EVENT_SEND_START = 'message-send-start';
export const EVENT_SEND_OK = 'message-send-ok';
export const EVENT_SEND_FAILED = 'message-send-failed';
export const EVENT_EXEC_INSTANCE_STALE = 'exec-instance-stale';
export const EVENT_EXEC_ACTOR_GONE = 'exec-actor-gone';
export const EVENT_EXEC_ACTOR_CHANGED = 'exec-actor-changed';
export const EVENT_MESSAGE_READ = 'message-read';
export const EVENT_MESSAGE_DROPPED = 'message-dropped';
export const EVENT_ACTOR_CREATED = 'actor-created';
export const EVENT_ACTOR_STARTED = 'actor-started';
export const EVENT_ACTOR_STOPPED = 'actor-stopped';

/**
 * EventType identifying an event that occurred.
 */
export type EventType = string;

/**
 * Handler is the type of function that receives events.
 */
export type Handler<E> = (event: E) => void;

/**
 * EventDispatcher is an interface used by the internal VM components to
 * broadcast interesting events when they occur.
 *
 * Each EventDispatcher is responsible for a specific type of event and contains
 * the listeners that are interested in that event. This interface is not meant
 * to be used for business logic in an application but rather provides a way to
 * inspect and troubleshoot the system.
 *
 * @typeparam T type of arguments the event dispatcher accepts.
 * @typeparam E type of event the dispatcher dispatches.
 */
export interface EventDispatcher<T, E> {
    /**
     * dispatch is a generic function that when called will create and dispatch
     * the event the EventDispatcher is responsible for.
     */
    dispatch: (...args: T[]) => void;

    /**
     * addListener to the EventDispatcher.
     */
    addListener(h: Handler<E>): void;
}

/**
 * InternalEvent is the base class for all potoo events.
 */
export interface InternalEvent {
    /**
     * type of event.
     */
    type: EventType;

    /**
     * source of the event.
     *
     * All events are associated with either an actor or the system itself.
     */
    source: Address;
}

/**
 * MessageDroppedEvent is dispatched when the destination address for a message
 * cannot be found.
 */
class MessageDroppedEvent implements InternalEvent {
    type = EVENT_MESSAGE_DROPPED;

    get source(): Address {
        return this.from;
    }

    constructor(
        public from: Address,
        public to: Address,
        public message: Message
    ) {}
}

/**
 * @private
 */
export class InternalEventDispatcher<T, E> implements EventDispatcher<T, E> {
    constructor(
        public dispatch: (...args: T[]) => void,
        public handlers: Handler<E>[] = []
    ) {}

    addListener(h: Handler<E>) {
        this.handlers.push(h);
    }
}

/**
 * EventCentral holds all of the vm's event dispatchers.
 *
 * Event dispatch is centralized here to make it clearer what events the system
 * is capable of dispatching as well as the ability to prevent some events
 * from ever being generated (TODO). The latter may arise for perf reasons where
 * we may need to avoid creating too many unnecessary GC collected objects.
 *
 * @param log - LogWritable to use for logging events.
 */
export class EventCentral {
    constructor(public _log: Lazy<LogWritable>) {}

    get log(): LogWritable {
        return evaluate(this.log);
    }

    onMessageDropped = new InternalEventDispatcher<
        Address,
        MessageDroppedEvent
    >((from: Address, to: Address, msg: Message) => {
        this.trigger(
            this.onMessageDropped,
            new MessageDroppedEvent(from, to, msg)
        );
    });

    /**
     * @private
     */
    trigger<T, E extends InternalEvent>(
        dispatcher: InternalEventDispatcher<T, E>,
        event: E
    ) {
        this.log.writeEvent(event);
        for (let handler of dispatcher.handlers) handler(event);
    }
}

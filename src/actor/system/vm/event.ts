import { Type } from '@quenk/noni/lib/data/type';

import { Address } from '../../address';
import { LogWritable } from './log';

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
 * EventName identifying an event that occurred.
 */
export type EventName = string;

/**
 * Handler for events.
 */
export type Handler = (addr: Address, evt: string, ...args: Type[]) => void;

/**
 * Handlers is a map of even Handler functions.
 */
export interface Handlers {

    [key: string]: Handler[]

}

/**
 * EventSource is an interface used by the VM to broadcast various events as
 * they occur.
 *
 * External code can use this interface to hook into these events.
 */
export interface EventSource {

    /**
     * on queues an event handler for the target event.
     */
    on(evt: EventName, handler: Handler): void

    /**
     * publish an event (used internally).
     */
    publish(addr: Address, evt: string, ...args: Type[]): void

}

/**
 * Publisher serves as the EventSource implementation for the VM.
 */
export class Publisher implements EventSource {

    constructor(public log: LogWritable, public handlers: Handlers = {}) { }

    on(evt: EventName, handler: Handler) {

        let handlers = this.handlers[evt] || [];

        handlers.push(handler);

        this.handlers[evt] = handlers;

    }

    publish(addr: Address, evt: string, ...args: Type[]) {

        let handlers = this.handlers[evt];

        if (handlers)
            handlers.forEach(handler => handler(addr, evt, ...args));

        this.log.event(addr, evt, ...args);

    }

}

import { Type } from '@quenk/noni/lib/data/type';
import { Address } from '../../address';
import { LogWritable } from './log';
export declare const EVENT_SEND_START = "message-send-start";
export declare const EVENT_SEND_OK = "message-send-ok";
export declare const EVENT_SEND_FAILED = "message-send-failed";
export declare const EVENT_EXEC_INSTANCE_STALE = "exec-instance-stale";
export declare const EVENT_EXEC_ACTOR_GONE = "exec-actor-gone";
export declare const EVENT_EXEC_ACTOR_CHANGED = "exec-actor-changed";
export declare const EVENT_MESSAGE_READ = "message-read";
export declare const EVENT_MESSAGE_DROPPED = "message-dropped";
export declare const EVENT_ACTOR_CREATED = "actor-created";
export declare const EVENT_ACTOR_STARTED = "actor-started";
export declare const EVENT_ACTOR_STOPPED = "actor-stopped";
/**
 * EventName identifying an event that occurred.
 */
export declare type EventName = string;
/**
 * Handler for events.
 */
export declare type Handler = (addr: Address, evt: string, ...args: Type[]) => void;
/**
 * Handlers is a map of even Handler functions.
 */
export interface Handlers {
    [key: string]: Handler[];
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
    on(evt: EventName, handler: Handler): void;
    /**
     * publish an event (used internally).
     */
    publish(addr: Address, evt: string, ...args: Type[]): void;
}
/**
 * Publisher serves as the EventSource implementation for the VM.
 */
export declare class Publisher implements EventSource {
    log: LogWritable;
    handlers: Handlers;
    constructor(log: LogWritable, handlers?: Handlers);
    on(evt: EventName, handler: Handler): void;
    publish(addr: Address, evt: string, ...args: Type[]): void;
}

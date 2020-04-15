import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
import { Address } from '../../address';
import { LogLevel } from './log';
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
 * Handler for events.
 */
export declare type Handler = (addr: Address, evt: string, ...args: Type[]) => void;
/**
 * Handlers is a map of even Handler functions.
 */
export interface Handlers {
    [key: string]: Handler;
}
/**
 * EventInfo holds needed information about events the system can generate.
 */
export interface EventInfo {
    /**
     * level of logging
     */
    level: LogLevel;
}
/**
 * EventInfos map.
 */
export interface EventInfos extends Record<EventInfo> {
}
/**
 * events holds the EventInfo details for all system events.
 */
export declare const events: EventInfos;
/**
 * getLevel provides the LogLevel for an event.
 *
 * If none is configured LOG_LEVEL_DEBUG is used.
 */
export declare const getLevel: (e: string) => number;

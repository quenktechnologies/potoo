import { Type } from '@quenk/noni/lib/data/type';

import { Address } from '../../address';

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
 * Handler for events.
 */
export type Handler = (addr: Address, evt: string, ...args: Type[]) => void;

/**
 * Handlers is a map of even Handler functions.
 */
export interface Handlers {

    [key: string]: Handler

}

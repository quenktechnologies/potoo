import { Record } from '@quenk/noni/lib/data/record';

import {
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARN,
    LogLevel,
    LOG_LEVEL_DEBUG
} from './log';

export const EVENT_SEND_OK = 'message-send-ok';
export const EVENT_SEND_FAILED = 'message-send-failed';
export const EVENT_INVALID_EXEC = 'invalid-exec';
export const EVENT_MESSAGE_READ = 'message-read';
export const EVENT_MESSAGE_DROPPED = 'message-dropped';
export const EVENT_ACTOR_CREATED = 'actor-created';
export const EVENT_ACTOR_STARTED = 'actor-started';
export const EVENT_ACTOR_STOPPED = 'actor-stopped';

/**
 * EventInfo holds needed information about events the system can generate.
 */
export interface EventInfo {

    /**
     * level of logging
     */
    level: LogLevel

}

/**
 * EventInfos map.
 */
export interface EventInfos extends Record<EventInfo> { }

/**
 * events holds the EventInfo details for all system events.
 */
export const events: EventInfos = {

    [EVENT_ACTOR_CREATED]: {

        level: LOG_LEVEL_INFO

    },

    [EVENT_ACTOR_STARTED]: {

        level: LOG_LEVEL_INFO

    },

    [EVENT_SEND_OK]: {

        level: LOG_LEVEL_INFO

    },

    [EVENT_MESSAGE_READ]: {

        level: LOG_LEVEL_INFO

    },

    [EVENT_SEND_FAILED]: {

        level: LOG_LEVEL_WARN

    },

    [EVENT_MESSAGE_DROPPED]: {

        level: LOG_LEVEL_WARN

    },

    [EVENT_INVALID_EXEC]: {

        level: LOG_LEVEL_WARN

    },

    [EVENT_ACTOR_STOPPED]: {

        level: LOG_LEVEL_WARN

    }

}

/**
 * getLevel provides the LogLevel for an event.
 *
 * If none is configured LOG_LEVEL_DEBUG is used.
 */
export const getLevel = (e: string): number => events.hasOwnProperty(e) ?
    events[e].level : LOG_LEVEL_DEBUG;

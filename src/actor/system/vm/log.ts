import * as events from './event';

import { Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';

import { Address } from '../../address';
import { Opcode, Operand, toLog } from './op';
import { Frame } from './frame';
import { SharedThread } from './thread/shared';

export const LOG_LEVEL_TRACE = 8;
export const LOG_LEVEL_DEBUG = 7;
export const LOG_LEVEL_INFO = 6;
export const LOG_LEVEL_NOTICE = 5;
export const LOG_LEVEL_WARN = 4;
export const LOG_LEVEL_ERROR = 3;

/**
 * LogLevel
 */
export type LogLevel = number;

/**
 * LogSink is the interface expected for log message destinations.
 *
 * This is based on the JS console API and as a result `console` is a valid
 * LogSink.
 */
export interface LogSink {
    /**
     * debug level.
     */
    debug(...e: Type[]): void;

    /**
     * info level.
     */
    info(...e: Type[]): void;

    /**
     * warn level.
     */
    warn(...e: Type[]): void;

    /**
     * error level.
     */
    error(...e: Type[]): void;

    /**
     * log level.
     */
    log(...e: Type[]): void;
}

/**
 * LogWritable is the interface used by the VM for logging.
 *
 * It provides convenience methods for writing various types of messages to the
 * log sink.
 */
export interface LogWritable {
    /**
     * level below which we log messages for.
     */
    level: LogLevel;

    /**
     * opcode logs the execution of an opcode once the log level is >=
     * [[LOG_LEVEL_TRACE]].
     */
    opcode(thr: SharedThread, frame: Frame, op: Opcode, operand: Operand): void;

    /**
     * event outputs a system event to the log if predefined [[LogLevel]] for
     * the event is less than or equal to the current log level.
     */
    event(addr: Address, evt: string, ...args: Type[]): void;
}

/**
 * LogWriter provides an implementation of [[LogWritable]] for the VM.
 */
export class LogWriter implements LogWritable {
    constructor(
        public sink: LogSink,
        public level: LogLevel
    ) {}

    opcode(thr: SharedThread, frame: Frame, op: Opcode, operand: Operand) {
        if (this.level >= LOG_LEVEL_TRACE)
            this.sink.debug.apply(this.sink, [
                `[${thr.context.address}]`,
                `(${frame.script.name}#${frame.name})`,
                ...toLog(op, thr, frame, operand)
            ]);
    }

    event(addr: Address, evt: string, ...args: Type[]) {
        let level = getLevel(evt);

        if (this.level >= level) {
            let { sink } = this;

            switch (level) {
                case LOG_LEVEL_DEBUG:
                    sink.debug(addr, evt, args);
                    break;

                case LOG_LEVEL_INFO:
                    sink.info(addr, evt, args);
                    break;

                case LOG_LEVEL_NOTICE:
                case LOG_LEVEL_WARN:
                    sink.warn(addr, evt, args);
                    break;

                case LOG_LEVEL_ERROR:
                    sink.error(addr, evt, args);
                    break;

                default:
                    break;
            }
        }
    }
}

const eventLevels: Record<{ level: number }> = {
    [events.EVENT_ACTOR_CREATED]: {
        level: LOG_LEVEL_INFO
    },

    [events.EVENT_ACTOR_STARTED]: {
        level: LOG_LEVEL_INFO
    },

    [events.EVENT_SEND_START]: {
        level: LOG_LEVEL_INFO
    },

    [events.EVENT_SEND_OK]: {
        level: LOG_LEVEL_INFO
    },

    [events.EVENT_MESSAGE_READ]: {
        level: LOG_LEVEL_INFO
    },

    [events.EVENT_SEND_FAILED]: {
        level: LOG_LEVEL_WARN
    },

    [events.EVENT_MESSAGE_DROPPED]: {
        level: LOG_LEVEL_WARN
    },

    [events.EVENT_EXEC_INSTANCE_STALE]: {
        level: LOG_LEVEL_WARN
    },

    [events.EVENT_EXEC_ACTOR_GONE]: {
        level: LOG_LEVEL_WARN
    }
};

/**
 * getLevel provides the LogLevel for an event.
 *
 * If none is configured LOG_LEVEL_DEBUG is used.
 * @private
 */
const getLevel = (e: string): number =>
    eventLevels.hasOwnProperty(e) ? eventLevels[e].level : LOG_LEVEL_DEBUG;

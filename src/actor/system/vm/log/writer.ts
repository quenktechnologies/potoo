import * as events from '../event';

import { isString, Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';
import { interpolate } from '@quenk/noni/lib/data/string';

import { InternalEvent } from '../event';
import { LogSink } from './sink';
import { LogLevel } from '.';

/**
 * LogWritable is the interface used by the VM for logging.
 *
 * It provides convenience methods for writing various types of messages to the
 * log sink.
 */
export interface LogWritable {
    /**
     * write a message to the log if the level is less than or equal to the
     * current log level.
     */
    write(level: LogLevel, ...args: Type[]): void;

    /**
     * writeEvent writes an InternalEvent to the log.
     *
     * This uses internal logic to format a message for each event.
     */
    writeEvent<E extends InternalEvent>(event: E): void;
}

/**
 * LogTemplate used to format event log messages.
 */
export type LogTemplates = Record<string>;

const defaultTemplates: LogTemplates = {
    [events.EVENT_MESSAGE_BOUNCE]: 'Message from {from} to {to} bounced!',

    [events.EVENT_MESSGAE_SEND]:
        'Message from {from} to {to} delivered successfully!'
};

/**
 * LogWriter provides an implementation of [[LogWritable]] for the VM.
 */
export class LogWriter implements LogWritable {
    constructor(
        public sink: LogSink,
        public logLevel: LogLevel = LogLevel.ERROR,
        public templates: LogTemplates = defaultTemplates
    ) {}

    write(level: LogLevel, ...args: Type[]) {
        if (level > this.logLevel) return;

        let { sink } = this;

        switch (level) {
            case LogLevel.DEBUG:
            case LogLevel.TRACE:
                sink.debug(...args);
                break;

            case LogLevel.NOTICE:
            case LogLevel.WARN:
                sink.warn(...args);
                break;

            case LogLevel.ERROR:
                sink.error(...args);
                break;

            default:
                sink.info(...args);
                break;
        }
    }

    writeEvent(evt: InternalEvent) {
        let message = this.templates[evt.type] || evt;
        this.write(
            evt.level,
            isString(message) ? interpolate(message, evt) : message
        );
    }
}

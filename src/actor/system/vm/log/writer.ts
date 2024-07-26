import * as events from '../event';

import { isString, Type } from '@quenk/noni/lib/data/type';
import { Record } from '@quenk/noni/lib/data/record';
import { interpolate } from '@quenk/noni/lib/data/string';

import { InternalEvent } from '../event';
import { LogLevelValue, LogSink } from '.';

/**
 * LogWritable is the interface used by the VM for logging.
 *
 * It provides convenience methods for writing various types of messages to the
 * log sink.
 */
export interface LogWritable {
    /**
     * level is the current log level.
     */
    level: LogLevelValue;

    /**
     * sink is the destination logs will be written to.
     */
    sink: LogSink;

    /**
     * write a message to the log if the level is less than or equal to the
     * current log level.
     */
    write(level: LogLevelValue, ...args: Type[]): void;

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
        public level: LogLevelValue = LogLevelValue.error,
        public templates: LogTemplates = defaultTemplates
    ) {}

    write(level: LogLevelValue, ...args: Type[]) {
        if (level > this.level) return;

        let { sink } = this;

        switch (level) {
            case LogLevelValue.debug:
            case LogLevelValue.trace:
                sink.debug(...args);
                break;

            case LogLevelValue.notice:
            case LogLevelValue.warn:
                sink.warn(...args);
                break;

            case LogLevelValue.error:
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

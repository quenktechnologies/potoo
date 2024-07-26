import { Type } from '@quenk/noni/lib/data/type';

/**
 * LogLevel is a string indicating the maximum level of messages that should
 * be written to the log sink.
 */
export type LogLevel = 'trace' | 'debug' | 'info' | 'notice' | 'warn' | 'error';

/**
 * LogLevelValue is a numeric representation of a LogLevel.
 */
export enum LogLevelValue {
    trace = 8,
    debug = 7,
    info = 6,
    notice = 5,
    warn = 4,
    error = 3
}

/**
 * LogSink is the interface expected of log message destinations.
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

const logLevelValueEntries = Object.entries(LogLevelValue);

/**
 * toLogLevel converts a LogLevelValue to a LogLevel string.
 *
 * If the value is not valid '<void>' is returned.
 */
export const toLogLevel = (level: LogLevelValue): LogLevel => {
    let entry = logLevelValueEntries.find(([, v]) => v === level);
    return <LogLevel>(entry ? entry[0] : '<void>');
};

/**
 * toLogLevelValue converts a LogLevel to a LogLevelValue.
 *
 * I the LogLevel is not valid LogLevelValue.info is returned.
 */
export const toLogLevelValue = (level: LogLevel | string): LogLevelValue => {
    return LogLevelValue[<LogLevel>level] ?? LogLevelValue.info;
};

import { Type } from '@quenk/noni/lib/data/type';

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

import { Type } from "@quenk/noni/lib/data/type";
export declare const LOG_LEVEL_DEBUG = 7;
export declare const LOG_LEVEL_INFO = 6;
export declare const LOG_LEVEL_NOTICE = 5;
export declare const LOG_LEVEL_WARN = 4;
export declare const LOG_LEVEL_ERROR = 3;
/**
 * LogLevel
 */
export declare type LogLevel = number;
/**
 * Logger facility.
 */
export interface Logger {
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

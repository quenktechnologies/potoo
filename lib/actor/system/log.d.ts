/**
 * DEBUG log level.
 */
export declare const DEBUG = 7;
/**
 * INFO log level.
 */
export declare const INFO = 6;
/**
 * WARN log level.
 */
export declare const WARN = 5;
/**
 * ERROR log level.
 */
export declare const ERROR = 1;
/**
 * Logger facility.
 */
export interface Logger {
    /**
     * info log.
     */
    info(e: any): void;
    /**
     * warn log.
     */
    warn(e: any): void;
    /**
     * error log.
     */
    error(e: any): void;
    /**
     * log
     */
    log(e: any): void;
}
/**
 * LogPolicy for the system.
 */
export interface LogPolicy {
    /**
     * level of the events to be logged.
     */
    level?: number;
    /**
     * logger is the actual logging implemention.
     *
     * It MUST correspond to the basic info,warn and error api of the javascript console.
     */
    logger?: Logger;
}

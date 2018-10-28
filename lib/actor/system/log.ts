/**
 * DEBUG log level.
 */
export const DEBUG = 7;

/**
 * INFO log level.
 */
export const INFO = 6;

/**
 * WARN log level.
 */
export const WARN = 5;

/**
 * ERROR log level.
 */
export const ERROR = 1;

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

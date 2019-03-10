export const DEBUG = 7;
export const INFO = 6;
export const NOTICE = 5;
export const WARN = 4;
export const ERROR = 3;

/**
 * Logger facility.
 */
export interface Logger {

    /**
     * info log.
     */
    info(...e: any[]): void;

    /**
     * warn log.
     */
    warn(...e: any[]): void;

    /**
     * error log.
     */
    error(...e: any[]): void;

    /**
     * log
     */
    log(...e: any[]): void;

}

export declare const DEBUG = 7;
export declare const INFO = 6;
export declare const NOTICE = 5;
export declare const WARN = 4;
export declare const ERROR = 3;
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

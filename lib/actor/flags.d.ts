export declare const FLAG_IMMUTABLE = 1;
export declare const FLAG_BUFFERED = 2;
export declare const FLAG_TEMPORARY = 4;
export declare const FLAG_ROUTER = 8;
/**
 * Flags allow an actor to enable or disable various features provided by
 * the system.
 */
export declare type Flags = number;
/**
 * isImmutable flag test.
 */
export declare const isImmutable: (f: Flags) => boolean;
/**
 * isBuffered flag test.
 */
export declare const isBuffered: (f: Flags) => boolean;
/**
 * isRouter flag test.
 */
export declare const isRouter: (f: Flags) => boolean;

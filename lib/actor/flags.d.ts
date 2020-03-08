export declare const FLAG_IMMUTABLE = 1;
export declare const FLAG_BUFFERED = 2;
export declare const FLAG_ROUTER = 3;
/**
 * Flags allow an actor to enable or disable various features provided by
 * the system.
 */
export declare type Flags = number;
/**
 * isImmutable flag test.
 */
export declare const isImmutable: (f: number) => boolean;
/**
 * isBuffered flag test.
 */
export declare const isBuffered: (f: number) => boolean;
/**
 * isRouter flag test.
 */
export declare const isRouter: (f: number) => boolean;

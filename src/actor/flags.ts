
export const FLAG_IMMUTABLE = 0x1;
export const FLAG_BUFFERED = 0x2;
export const FLAG_TEMPORARY = 0x4
export const FLAG_ROUTER = 0x8;
export const FLAG_RESIDENT = 0x16;

/**
 * Flags allow an actor to enable or disable various features provided by 
 * the system.
 */
export type Flags = number;

/**
 * isImmutable flag test.
 */
export const isImmutable = (f: Flags) =>
    (f & FLAG_IMMUTABLE) === FLAG_IMMUTABLE;

/**
 * isBuffered flag test.
 */
export const isBuffered = (f: Flags) =>
    (f & FLAG_BUFFERED) === FLAG_BUFFERED;

/**
 * isRouter flag test.
 */
export const isRouter = (f: Flags) =>
    (f & FLAG_ROUTER) === FLAG_ROUTER;

/**
 * isResident flag test.
 */
export const isResident = (f: Flags) => (f & FLAG_RESIDENT) === FLAG_RESIDENT;

export const FLAG_IMMUTABLE = 1;
export const FLAG_BUFFERED = 2;
export const FLAG_EXIT_AFTER_RECEIVE = 4;
export const FLAG_ROUTER = 8;
export const FLAG_RESIDENT = 16;
export const FLAG_EXIT_AFTER_RUN = 32;
export const FLAG_VM_THREAD = 64;

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
export const isBuffered = (f: Flags) => (f & FLAG_BUFFERED) === FLAG_BUFFERED;

/**
 * isRouter flag test.
 */
export const isRouter = (f: Flags) => (f & FLAG_ROUTER) === FLAG_ROUTER;

/**
 * isResident flag test.
 */
export const isResident = (f: Flags) => (f & FLAG_RESIDENT) === FLAG_RESIDENT;

/**
 * usesVMThread flag test.
 */
export const usesVMThread = (f: Flags) =>
    (f & FLAG_VM_THREAD) === FLAG_VM_THREAD;

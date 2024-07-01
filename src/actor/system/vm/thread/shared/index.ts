import { Err } from '@quenk/noni/lib/control/error';

import { Thread } from '../';

export const THREAD_STATE_IDLE = 0;
export const THREAD_STATE_RUN = 1;
export const THREAD_STATE_MSG_WAIT = 2;
export const THREAD_STATE_ASYNC_WAIT = 3;
export const THREAD_STATE_ERROR = 4;
export const THREAD_STATE_INVALID = 5;

/**
 * ThreadState is a number corresponding to one of the THREAD_STATE_X constants.
 */
export enum ThreadState {
    IDLE = THREAD_STATE_IDLE,
    RUNNING = THREAD_STATE_RUN,
    MSG_WAIT = THREAD_STATE_MSG_WAIT,
    ASYNC_WAIT = THREAD_STATE_ASYNC_WAIT,
    ERROR = THREAD_STATE_ERROR,
    INVALID = THREAD_STATE_INVALID
}

export const ERR_THREAD_INVALID = 'ERR_THREAD_INVALID';

/**
 * SharedThread is one that shares the JavaScript event loop with other threads.
 *
 * Due to the design of JavaScript engines, only one of these threads can 
 * actively execute at a time meaning the actors have to share execution time
 * via the Scheduler.
 */
export interface SharedThread extends Thread {
    /**
     * state of the Thread.
     *
     * Used by the scheduler to determine execution order.
     */
    state: ThreadState;

    /**
     * raise an error triggering the system's error handling machinery.
     */
    raise(e: Err): Promise<void>;

    /**
     * resume marks the Thread as ready to run again.
     */
    resume(): void;
}

import { Address } from '../../../address';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Actor } from '../../..';

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

/**
 * Thread is an execution context for a single actor.
 *
 * These are not actual OS or green threads but rather an abstraction simulating
 * k
 * one.
 */
export interface Thread extends Actor, Runtime {
    /**
     * vm the Thread belongs to.
     */
    vm: Platform;

    /**
     * address for the Thread (actor) within the system.
     */
    address: Address;

    /**
     * state indicates what state the Thread is currently in.
     */
    state: ThreadState;

    /**
     * die terminates the Thread by marking it invalid.
     */
    die(): void
}

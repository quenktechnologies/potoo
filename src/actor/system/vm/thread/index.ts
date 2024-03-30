import { Future } from '@quenk/noni/lib/control/monad/future';

import { Message } from '../../../message';
import { Context } from '../runtime/context';
import { Job } from '../scheduler';
import { Runtime } from '../runtime';
import { Platform } from '../';

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
 * one.
 */
export interface Thread extends Runtime {
    /**
     * vm the Thread belongs to.
     */
    vm: Platform;

    /**
     * context (actor) of the Thread's actor.
     */
    context: Context;

    /**
     * state indicates what state the Thread is currently in.
     */
    state: ThreadState;

    /**
     * notify the Thread of a new message.
     */
    notify(msg: Message): void;

    /**
     * resume executes a Job on the Thread.
     *
     * This is called by the scheduler to execute one (and only one) job at a
     * time.
     */
    resume(job: Job): void;

    /**
     * die terminates the Thread.
     */
    die(): Future<void>;
}

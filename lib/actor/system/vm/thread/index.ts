import { Err } from '@quenk/noni/lib/control/error';
import { Future } from '@quenk/noni/lib/control/monad/future';
import { Type } from '@quenk/noni/lib/data/type';

import { FunInfo } from '../script/info';
import { Data, Frame } from '../runtime/stack/frame';
import { Script } from '../script';
import { Context } from '../runtime/context';
import { Platform } from '../';
import { Job } from './shared';

export const THREAD_STATE_IDLE = 0;
export const THREAD_STATE_RUN = 1;
export const THREAD_STATE_WAIT = 2;
export const THREAD_STATE_ERROR = 3;
export const THREAD_STATE_INVALID = 4;

/**
 * ThreadState is a number corresponding to one of the THREAD_STATE_X constants.
 */
export type ThreadState = number;

/**
 * Thread represents an execution context for an actor.
 */
export interface Thread {

    /**
     * vm the Thread belongs to.
     */
    vm: Platform,

    /**
     * context (actor) of the Thread's actor.
     */
    context: Context

    /**
     * state indicates what state the Thread is currently in.
     */
    state: ThreadState

    /**
     * raise an error in the VM from this Thread.
     */
    raise(e: Err): void

    /**
     * wait on an asynchronous task to complete before executing any further
     * code for this Thread.
     *
     * This will change the Thread's state to THREAD_STATE_WAIT.
     */
    wait(task: Future<void>): void

    /**
     * die terminates the Thread.
     */
    die(): Future<void>

}

/** 
 * VMThread is the Thread type for actor implementations that rely entirely on
 * the VM.
 *
 * This is used for resident actors and the VM itself (root actor). The reason
 * for this interface is the potential need to implement other thread types to 
 * take advantage of technologies like WebWorkers in the future. For now however, 
 * all Threads found within the system can be expected to be VMThreads. 
 * Furthermore, the only implementation of this is interface is the SharedThread.
 */
export interface VMThread extends Thread {

    /**
     * fstack is the frame stack containing frames for each currently executing
     * function.
     */
    fstack: Frame[]

    /**
     * fsp is the "frame stack pointer" indicating which in the stack is being
     * executed.
     */
    fsp: number

    /**
     * rp is the return pointer used to pass values between frames.
     */
    rp: Data

    /**
     * script this VMThread executes code from.
     */
    script: Script

    /**
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(caller: Frame, func: FunInfo, args: Type[]): void

    /**
     * invokeVM invokes a VM function.
     *
     * The frame specified is the parent frame and arguments will be sourced
     * from its data stack.
     */
    invokeVM(caller: Frame, func: FunInfo): void

    /**
     * resume a thread's execution.
     *
     * This is called by the scheduler to execute one (and only one) job in 
     * the VMThreads internal queue.
     */
    resume(job: Job): void

    /**
     * exec a function by name on this thread.
     *
     * The function must be declared in the thread's Script.
     */
    exec(name: string, args: Data[]): void
}

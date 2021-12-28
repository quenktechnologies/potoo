import { Err } from '@quenk/noni/lib/control/error';

import { Future } from '@quenk/noni/lib/control/monad/future';

import { FunInfo } from '../script/info';
import { Data, Frame } from '../runtime/stack/frame';
import { Script } from '../script';
import { Foreign, PTValue } from '../type';
import { Context } from '../runtime/context';
import { Platform } from '../';
import { ExecutionFrame } from './shared/runner';

export const THREAD_STATE_IDLE = 0;
export const THREAD_STATE_RUN = 1;
export const THREAD_STATE_WAIT = 2;
export const THREAD_STATE_ERROR = 3;

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
 * VMThread is a Thread for actors operating locally for the vm, i.e. resident
 * actors.
 *
 * VMThreads contain a Script that is executed to perform basic actor 
 * functionality. Resident actors use the call() method to execute procedures
 * from this Script when they need to.
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
     * script this VMThread executes from.
     */
    script: Script

    /**
     * invokeForeign invokes a foreign function.
     *
     * The frame specified is the parent frame that will receive it's result.
     */
    invokeForeign(caller: Frame, func: FunInfo, args: PTValue[]): void

    /**
     * invokeVM invokes a VM function.
     *
     * The frame specified is the parent frame and arguments will be sourced
     * from its data stack.
     */
    invokeVM(caller: Frame, func: FunInfo): void

    /**
     * restore sets the thread's internal values using the provided 
     * ExecutionFrame. The thread's state will be updated to THREAD_STATE_RUN.
     */
    restore(eframe: ExecutionFrame): void

    /**
     * processNextFrame instructs the thread to process the next stack frame
     * in the thread's stack.
     *
     * This does not actually execute the frame but prepares the internal
     * values for execution by pointing to the next one. The thread's state is 
     * set to THREAD_STATE_IDLE.
     * 
     * @param rp - The value to set the 
     */
    processNextFrame(rp: Data): void

    /**
     * exec a function by name on this thread.
     *
     * The function must be declared in the thread's Script.
     */
    exec(name: string, args: Foreign[]): void
}

import { Platform } from '../../';
import { StackFrame } from '../../runtime/stack/frame';
import { VMThread } from '../';
/**
 * ExecutionFrame stores the state of the fstack for a VMThread.
 *
 * This is used to both trigger execution of an fstack as well as restore
 * execution in the shared environment. When a VMThread needs to perform an
 * async task for example, it's current state is saved an a new ExecutionFrame
 * is pushed to the runner to continue where it left off.
 */
export declare class ExecutionFrame {
    thread: VMThread;
    fstack: StackFrame[];
    fsp: number;
    rp: number;
    constructor(thread: VMThread, fstack?: StackFrame[], fsp?: number, rp?: number);
}
/**
 * SharedThreadRunner allows multiple Threads to execute their code sequentially
 * in a single JS event loop.
 *
 * In prior versions of the VM, threads executed their code in their own run
 * methods making it possible to have situations where actor state is being
 * mutated before a previous frame is complete.
 *
 * This was less of a problem due to the simplistic use of the VM to date and
 * the queuing done by the VM itself however it did introduce some heap
 * management related bugs due to the immediate execution of spawn scripts.
 *
 * By moving actual execution here and sharing an instance of this class between
 * threads we make it easier to keep execution sequential an reflect the reality
 * of a shared event loop.
 */
export declare class SharedThreadRunner {
    vm: Platform;
    eframes: ExecutionFrame[];
    constructor(vm: Platform, eframes?: ExecutionFrame[]);
    _running: boolean;
    /**
     * enqueue an ExecutionFrame for future execution.
     */
    enqueue(frame: ExecutionFrame): this;
    /**
     * dequeue all ExecutionFrames for the provide thread effectively ending its
     * execution.
     */
    dequeue(thread: VMThread): void;
    run(): void;
}

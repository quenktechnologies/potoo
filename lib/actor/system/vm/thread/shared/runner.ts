import { empty, remove } from '@quenk/noni/lib/data/array';

import { Platform } from '../../';
import { Frame, StackFrame, Data } from '../../runtime/stack/frame';
import { handlers } from '../../runtime/op';
import { OPCODE_MASK, OPERAND_MASK } from '../../runtime';
import {
    THREAD_STATE_IDLE,
    THREAD_STATE_RUN,
    THREAD_STATE_WAIT,
    VMThread
} from '../';

/**
 * ExecutionFrame stores the state of the fstack for a VMThread.
 *
 * This is used to both trigger execution of an fstack as well as restore
 * execution in the shared environment. When a VMThread needs to perform an 
 * async task for example, it's current state is saved an a new ExecutionFrame
 * is pushed to the runner to continue where it left off.
 */
export class ExecutionFrame {

    constructor(
        public thread: VMThread,
        public fstack: StackFrame[] = [],
        public fsp = 0,
        public rp = 0) { }

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
export class SharedThreadRunner {

    constructor(
        public vm: Platform,
        public eframes: ExecutionFrame[] = []) { }

    _running = false;

    /**
     * enqueue an ExecutionFrame for future execution.
     */
    enqueue(frame: ExecutionFrame) {

        this.eframes.push(frame);

        return this;

    }

    /**
     * dequeue all ExecutionFrames for the provide thread effectively ending its
     * execution.
     */
    dequeue(thread: VMThread) {

        this.eframes = this.eframes.filter(frame => frame.thread !== thread);

    }

    run() {

        if (this._running) return;

        this._running = true;

        let eframe;
        while (eframe = this.eframes.find(frame =>
            frame.thread.state === THREAD_STATE_IDLE)) {

            let thread = eframe.thread;

            thread.restore(eframe);

            while (!empty(thread.fstack)) {

                let sp = thread.fsp;

                let frame = <Frame>thread.fstack[sp];

                if (thread.rp != 0)
                    frame.data.push(thread.rp);

                while (!frame.isFinished() &&
                    (thread.state === THREAD_STATE_RUN)) {

                    //execute frame instructions
                    let pos = frame.getPosition();
                    let next = (frame.code[pos] >>> 0);
                    let opcode = next & OPCODE_MASK;
                    let operand = next & OPERAND_MASK;

                    this.vm.logOp(thread, frame, opcode, operand);

                    // TODO: Error if the opcode is invalid, out of range etc.
                    handlers[opcode](thread, frame, operand);

                    if (pos === frame.getPosition()) frame.advance();

                    // frame pointer changed another frame has been pushed
                    // and needs to be executed.
                    if (sp !== thread.fsp) break;

                }

                if (thread.state === THREAD_STATE_WAIT)
                    // Thread is waiting on an async task to complete break out
                    // and handle other threads.
                    break;

                if (sp === thread.fsp)
                    thread.processNextFrame(<Data>frame.data.pop() || 0);

            }

            if (empty(thread.fstack))
                // The thread's frame stack is empty, meaning all execution is 
                // complete. Remove the eframe from the queue.
                this.eframes = remove(this.eframes, eframe);

        }

        this._running = false;

    }

}

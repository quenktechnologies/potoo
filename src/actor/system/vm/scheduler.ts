import { remove } from '@quenk/noni/lib/data/array';

import { Thread, ThreadState } from './thread';

/**
 * Scheduler provides a mechanism for cooperative execution between Thread
 * instances within the VM.
 *
 * Each Thread enqueues itself one or more times when it has work to do. The
 * Scheduler then calls the resume() method of each in a round-robin fashion
 * until the queue is either empty or has no idle Threads.
 *
 * The Scheduler does not wait on a Thread to finish before moving on to the
 * next one. Instead it only calls resulme() on Threads that are in the IDLE
 * state.
 *
 * In prior versions, Threads executed code at will which made it possible
 * for actor state to be mutated while still depended on (when an actor sends a
 * message to itself for example). This created hard to debug errors.
 *
 * By using a scheduler we can ensure that a thread does not ever preempt itself.
 */
export class Scheduler {
    constructor(public queue: Thread[] = []) {}

    _running = false;

    /**
     * enqueue a Thread for future execution.
     */
    enqueue(thread: Thread) {
        this.queue.push(thread);
        this.run();
    }

    /**
     * dequeue a Thread removing all positions it held in the queue.
     */
    dequeue(thread: Thread) {
        this.queue = remove(this.queue, thread);
        // TODO: dispatch event? callback into thread?
    }

    /**
     * run resumes each idle thread in the queue in order.
     *
     * This method is idempotent and can be called as many times as needed.
     */
    run() {
        if (this._running) return;

        this._running = true;

        let idx;
        while (
            (idx = this.queue.findIndex(
                thread => thread.state === ThreadState.IDLE
            )) !== -1
        ) {
            //TODO: dispatch event.
            this.queue[idx].resume();
            this.queue.splice(idx, 1);
        }

        this._running = false;
    }
}

import { empty } from '@quenk/noni/lib/data/array';
import { evaluate, Lazy } from '@quenk/noni/lib/data/lazy';

import { PVM } from '..';
import { Thread } from '.';
import { SharedThread, THREAD_STATE_IDLE } from './shared';

/**
 * ThreadCollector is used to automatically deallocate dead threads from the
 * system.
 *
 * This applies to function actors which are deallocated automatically after t
 * hey execute. However, this deallocation is delayed until all child threads
 * have also been deallocated for the actor.
 */
export class ThreadCollector {
    constructor(
        public vm: Lazy<PVM>,
        public threads: Set<Thread> = new Set()
    ) {}

    /**
     * mark a thread for collection.
     *
     * This assumes the thread is a function actor.
     */
    mark(thread: Thread) {
        this.threads.add(thread);
    }

    /**
     * unmark a thread for collection.
     *
     * This must be called when a thread has been deallocated regardless of
     * method to ensure it does not linger in the collector.
     */
    unmark(thread: Thread) {
        this.threads.delete(thread);
    }

    /**
     * collectr on a Thread.
     *
     * This deallocates the thread if it has no children.
     */
    async collect(thread: Thread) {
        queueMicrotask(async () => {
            if (!this.threads.has(thread)) return;

            let { allocator } = evaluate(this.vm);

            if (
                empty(allocator.getChildren(thread)) &&
                (<SharedThread>thread).state === THREAD_STATE_IDLE
            ) {
                this.unmark(thread);
                await allocator.deallocate(thread);
            }
        });
    }
}

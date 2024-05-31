import { Thread, ThreadState } from './thread';

export const ERR_THREAD_DEQUEUED = 'ERR_THREAD_DEQUEUED';

/**
 * PendingTask tuple type.
 */
export type PendingTask = [Thread, (err?: Error) => void];

export class Task {
    constructor(
        public thread: Thread,
        public abort: (err: Error) => void,
        public exec: () => Promise<void>
    ) {}
}

/**
 * Scheduler provides a mechanism for cooperative execution between Thread
 * instances within the VM.
 *
 * Each Thread enqueues a Task to be executed each time it has work to do.
 * The Scheduler.run() method will execute each of these tasks in a round-robin
 * fashion until the queue is empty or no Threads are in the IDLE state.
 *
 * In prior versions, Threads executed code at will which made it possible
 * for a single actor's state to be mutated while a previous tasks still executed
 * (when an actor sends a  message to itself for example).
 *
 * This led to errors and bugs that were hard to track down. By using scheduling
 * execution we ensure threads do not preempt themselves.
 */
export class Scheduler {
    constructor(
        public queue: Task[] = [],
        public isRunning = false
    ) {}

    /**
     * postTask a Task for future execution.
     * @param task    - The Task to post.
     * @param preempt - If true, the task will be executed before any other
     *                  tasks in the queue belonging to the Thread.
     */
    postTask(task: Task, preempt = false) {
        if (preempt) {
            let idx = this.queue.findIndex(
                ({ thread }) => thread === task.thread
            );
            if (idx != -1) {
                this.queue.splice(idx, 0, task);
            } else {
                this.queue.push(task);
            }
        } else {
            this.queue.push(task);
        }

        this.run();
    }

    /**
     * removeTasks for a Thread.
     *
     * The Tasks will be terminated with an ERR_THREAD_DEQUEUED error.
     */
    removeTasks(thread: Thread) {
        this.queue = this.queue.filter(task => {
            if (task.thread != thread) return true;
            // TODO: dispatch event? callback into thread?
            task.abort(new Error(ERR_THREAD_DEQUEUED));
        });
    }

    /**
     * run queued pending tasks for idle threads.
     *
     * This method only executes if the scheduler is not already running. It
     * does not wait for tasks to be completed before moving on to the next
     * however once a thread is not in the idle state no other tasks will
     * be executed for it.
     */
    run() {
        if (this.isRunning) return;

        this.isRunning = true;

        let idx;
        while (
            (idx = this.queue.findIndex(
                task => task.thread.state === ThreadState.IDLE
            ))
        ) {
            let task = this.queue.splice(idx, 1)[0];

            task.thread.state = ThreadState.RUNNING;

            // TODO: disatch event
            task.exec()
                .then(() => {
                    if (task.thread.state === ThreadState.RUNNING)
                        task.thread.state = ThreadState.IDLE;
                })
                .catch(err => task.abort(err));
        }

        this.isRunning = false;
    }
}

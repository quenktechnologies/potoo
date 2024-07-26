import { expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

import { wait } from '@quenk/noni/lib/control/monad/future';

import { Scheduler, Task } from '../../../../../lib/actor/system/vm/scheduler';
import {
    SharedThread,
    ThreadState
} from '../../../../../lib/actor/system/vm/thread/shared';

describe('Scheduler', () => {
    describe('postTask', () => {
        it('should queue tasks for execution', () => {
            let scheduler = new Scheduler();

            let thread = mockDeep<SharedThread>();

            thread.state = ThreadState.IDLE;

            expect(scheduler.queue).toEqual([]);

            let exec = async () => {};

            let execSpy = jest.fn(exec);

            scheduler.postTask(new Task(thread, () => {}, execSpy));

            expect(execSpy).toBeCalledTimes(1);
        });
    });

    describe('run', () => {
        it('should execute a task', () => {
            let scheduler = new Scheduler();

            let thread = mockDeep<SharedThread>();

            thread.state = ThreadState.IDLE;

            let exec = jest.fn(async () => {});

            scheduler.queue.push(new Task(thread, () => {}, exec));

            scheduler.run();

            expect(exec).toBeCalledTimes(1);

            expect(scheduler.queue.length).toBe(0);
        });

        it('should not execute a task if thread not idle', () => {
            for (let state of [
                ThreadState.ASYNC_WAIT,
                ThreadState.ERROR,
                ThreadState.INVALID,
                ThreadState.MSG_WAIT,
                ThreadState.RUNNING
            ]) {
                let scheduler = new Scheduler();

                let thread = mockDeep<SharedThread>();

                thread.state = state;

                let exec = jest.fn(async () => {});

                scheduler.queue.push(new Task(thread, () => {}, exec));

                scheduler.run();

                expect(exec).not.toBeCalled();

                expect(scheduler.queue.length).toBe(1);
            }
        });

        it('should not run if already running', () => {
            let scheduler = new Scheduler();

            let thread = mockDeep<SharedThread>();

            thread.state = ThreadState.IDLE;

            let exec = jest.fn(async () => {});

            scheduler.queue.push(new Task(thread, () => {}, exec));

            scheduler.isRunning = true;

            scheduler.run();

            expect(exec).not.toBeCalled();

            expect(scheduler.queue.length).toBe(1);
        });

        it('should call the abort handler if the task fails', async () => {
            let scheduler = new Scheduler();

            let thread = mockDeep<SharedThread>();

            thread.state = ThreadState.IDLE;

            let err = new Error('failed');

            let exec = jest.fn(async () => {
                throw err;
            });

            let abort = jest.fn();

            scheduler.queue.push(new Task(thread, abort, exec));

            scheduler.run();

            await wait(100);

            expect(scheduler.queue.length).toBe(0);

            expect(scheduler.isRunning).toBe(false);

            expect(exec).toBeCalledTimes(1);

            expect(abort).toBeCalledWith(err);
        });
    });
});

import { expect, jest } from '@jest/globals';

import { mockDeep } from 'jest-mock-extended';

import { Future, wait } from '@quenk/noni/lib/control/monad/future';

import { Platform } from '../../../../../lib/actor/system/vm';
import { Scheduler } from '../../../../../lib/actor/system/vm/scheduler';
import { ThreadState } from '../../../../../lib/actor/system/vm/thread';
import { SharedThread } from '../../../../../lib/actor/system/vm/thread/shared';
import { Actor } from '../../../../../lib/actor';

describe('shared', () => {
    let platform = mockDeep<Platform>();
    let scheduler = mockDeep<Scheduler>();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    beforeEach(() => {
        scheduler.postTask.mockImplementation(task => task.exec());
    });

    describe('notify', () => {
        it('should enqueue new messages', () => {
            let thread = new SharedThread(platform, scheduler, '/');
            thread.notify('1');
            thread.notify('2');
            thread.notify('3');

            expect(thread.mailbox).toEqual(
                expect.arrayContaining(['1', '2', '3'])
            );
            expect(thread.state).toBe(ThreadState.IDLE);
        });

        it('should move from MSG_WAIT to IDLE', () => {
            let thread = new SharedThread(
                platform,
                scheduler,
                '/',
                [],
                ThreadState.MSG_WAIT
            );
            thread.notify('1');
            expect(thread.state).toBe(ThreadState.IDLE);
        });
    });

    describe('watch', () => {
        it('should work with async functions', async () => {
            let thread = new SharedThread(platform, scheduler, '/');

            let value = 0;

            await thread.watch(async () => {
                value = 12;
            });

            expect(value).toBe(12);

            expect(thread.state).toBe(ThreadState.IDLE);
        });

        it('should raise errors', async () => {
            let error = new Error('fail');
            for (let spec of [
                async () => {
                    throw error;
                },
                () => Promise.reject(error),
                () => Future.raise(error)
            ]) {
                let thread = new SharedThread(platform, scheduler, '/');
                let threadReceived;
                let errorReceived;

                platform.raiseActorError.mockImplementation(
                    async (thread, error) => {
                        threadReceived = thread;
                        errorReceived = error;
                    }
                );

                await thread.watch(spec);

                expect(threadReceived).toBe(thread);
                expect(errorReceived).toBe(error);
                expect(thread.state).toBe(ThreadState.ERROR);
            }
        });
    });

    describe('kill', () => {
        it('should kill the thread', async () => {
            let thread = new SharedThread(platform, scheduler, '/');
            let threadReceived;
            let targetReceived;

            platform.killActor.mockImplementation(async (thread, target) => {
                threadReceived = thread;
                targetReceived = target;
            });

            await thread.kill('/');

            expect(thread.state).toBe(ThreadState.INVALID);
            expect(threadReceived).toBe(thread);
            expect(targetReceived).toBe(thread.address);
        });
    });

    describe('raise', () => {
        it('should raise an error', async () => {
            let thread = new SharedThread(platform, scheduler, '/');
            let threadReceived;
            let errorReceived;

            platform.raiseActorError.mockImplementation(
                async (thread, error) => {
                    threadReceived = thread;
                    errorReceived = error;
                }
            );

            await thread.raise(new Error('fail'));

            expect(threadReceived).toBe(thread);
            expect(errorReceived).toBeInstanceOf(Error);
            expect(thread.state).toBe(ThreadState.ERROR);
        });
    });

    describe('spawn', () => {
        it('should allocate from a template', async () => {
            //TODO: enable test after template refactor.
            let thread = new SharedThread(platform, scheduler, '/');

            let tmpl = { id: 'child', create: () => {} };

            platform.allocateActor.mockResolvedValue('/child');

            let result = await thread.spawn(tmpl);

            expect(platform.allocateActor).toBeCalledWith(thread, tmpl);

            expect(result).toBe('/child');
        });
    });

    describe('tell', () => {
        it('should send a message ', async () => {
            let thread = new SharedThread(platform, scheduler, '/');

            await thread.tell('/foo', 'hello');

            expect(platform.sendActorMessage).toBeCalledWith(
                thread,
                '/foo',
                'hello'
            );
        });
    });

    describe('receive', () => {
        it('should provide messages from the mailbox', async () => {
            let thread = new SharedThread(platform, scheduler, '/');

            thread.mailbox.push('hello');

            let result = await thread.receive();

            expect(scheduler.postTask).toBeCalledTimes(1);

            expect(result).toBe('hello');
        });

        it('should MSG_WAIT if there are no messages', async () => {
            let thread = new SharedThread(platform, scheduler, '/');

            thread.receive();

            await wait(100);

            expect(thread.state).toBe(ThreadState.MSG_WAIT);

            thread.mailbox.push('hello');

            await thread.receive();

            expect(thread.state).toBe(ThreadState.IDLE);
        });
    });

    describe('_assertValid', () => {
        it('should reject when the thread is invalid', () => {
            let childActor = mockDeep<Actor>();

            let thread = new SharedThread(platform, scheduler, '/');
            thread.state = ThreadState.INVALID;

            for (let func of [
                () => thread.spawn({ create: () => childActor }),
                () => thread.tell('/foo', 'hello'),
                () => thread.receive()
            ]) {
                expect(func()).rejects.toThrowError('ERR_THREAD_INVALID');
            }
        });
    });
});

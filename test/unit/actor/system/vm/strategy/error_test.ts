import { expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/err';
import { identity } from '@quenk/noni/lib/data/function';

import { VM } from '../../../../../../lib/actor/system/vm';
import {
    ACTION_IGNORE,
    ACTION_RAISE,
    ACTION_RESTART,
    ACTION_STOP,
    Template,
    TrapAction
} from '../../../../../../lib/actor/template';
import { ADDRESS_SYSTEM } from '../../../../../../lib/actor/address';
import { SupervisorErrorStrategy } from '../../../../../../lib/actor/system/vm/strategy/error';
import { ActorTerminatedErr } from '../../../../../../lib/actor/system/vm/runtime/error';
import { Allocator } from '../../../../../../lib/actor/system/vm/allocator';
import { SharedThread } from '../../../../../../lib/actor/system/vm/thread/shared';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';

describe('SupervisorErrorStrategy', () => {
    const mockAllocator = mockDeep<Allocator>();

    const mockPlatform = mockDeep<VM>();

    mockPlatform.allocator = mockAllocator;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('raise', () => {
        let templates: Record<Template> = {
            '/': { create: identity },
            '/child': { create: identity }
        };

        let threads: Record<SharedThread> = {
            [ADDRESS_SYSTEM]: mockDeep<SharedThread>()
        };

        let err = new Error('fail');

        beforeEach(() => {
            mockAllocator.getTemplate.mockImplementation((address: string) =>
                Maybe.fromNullable(templates[address])
            );
            mockAllocator.getThread.mockImplementation((address: string) =>
                Maybe.fromNullable(threads[address])
            );
        });

        it("should invoke the thread's template handler", async () => {
            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_IGNORE);
            templates['/child'].trap = trap;

            let thread = mockDeep<SharedThread>();

            thread.address = '/child';

            let stategy = new SupervisorErrorStrategy(mockAllocator);

            await stategy.raise(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/child');

            expect(mockAllocator.getTemplate).toHaveBeenCalledTimes(1);

            expect(trap).toHaveBeenCalledWith(err);
        });

        it('should restart the thread', async () => {
            let parentThread = mockDeep<SharedThread>();
            let thread = mockDeep<SharedThread>();
            let newThread = mockDeep<SharedThread>();

            parentThread.address = '/';
            thread.address = '/target';
            newThread.address = '/target';
            threads['/'] = parentThread;
            threads['/target'] = thread;

            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_RESTART);

            let template = { create: identity, trap };
            templates['/target'] = template;

            mockAllocator.reallocate.mockImplementation(
                async (thread: Thread) => {
                    threads[thread.address] = newThread;
                }
            );

            let strategy = new SupervisorErrorStrategy(mockAllocator);

            await strategy.raise(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/target');

            expect(trap).toHaveBeenCalledWith(err);

            expect(threads['/']).toBe(parentThread);

            expect(threads['/target']).toBe(newThread);

            expect(mockAllocator.reallocate).toHaveBeenCalledWith(thread);
        });

        it('should stop the thread', async () => {
            let parentThread = mockDeep<SharedThread>();
            let thread = mockDeep<SharedThread>();

            parentThread.address = '/';
            thread.address = '/target';
            threads['/'] = parentThread;
            threads['/target'] = thread;

            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_STOP);

            let template = { create: identity, trap };
            templates['/target'] = template;

            let strategy = new SupervisorErrorStrategy(mockAllocator);

            await strategy.raise(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/target');

            expect(trap).toHaveBeenCalledWith(err);

            expect(threads['/']).toBe(parentThread);

            expect(mockAllocator.deallocate).toHaveBeenCalledWith(thread);
        });

        it('should raise errors to parent', async () => {
            let parentErr: ActorTerminatedErr = new ActorTerminatedErr(
                '/',
                '/',
                new Error('')
            );
            let parentTrap = jest
                .fn<(err: Err) => TrapAction>()
                .mockImplementation((err: Err) => {
                    parentErr = <ActorTerminatedErr>err;
                    return ACTION_IGNORE;
                });
            templates['/'].trap = parentTrap;

            let parentThread = mockDeep<SharedThread>();
            parentThread.address = '/';
            threads['/'] = parentThread;

            let childTrap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_RAISE);
            templates['/child'].trap = childTrap;

            let childThread = mockDeep<SharedThread>();
            childThread.address = '/child';
            threads['/child'] = childThread;

            let strategy = new SupervisorErrorStrategy(mockAllocator);

            await strategy.raise(childThread, err);

            expect(mockAllocator.getTemplate).toHaveBeenNthCalledWith(
                1,
                '/child'
            );

            expect(mockAllocator.getTemplate).toHaveBeenNthCalledWith(2, '/');

            expect(childTrap).toHaveBeenCalledWith(err);

            expect(parentErr).toBeInstanceOf(ActorTerminatedErr);

            expect(parentErr.originalError).toBe(err);

            expect(mockAllocator.deallocate).toHaveBeenCalledWith(childThread);
        });
    });
});

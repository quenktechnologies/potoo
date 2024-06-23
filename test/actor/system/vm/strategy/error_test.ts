import { expect, jest } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
import { Err } from '@quenk/noni/lib/control/err';

import { Platform } from '../../../../../lib/actor/system/vm';
import {
    ACTION_IGNORE,
    ACTION_RAISE,
    ACTION_RESTART,
    ACTION_STOP,
    Template,
    TrapAction
} from '../../../../../lib/actor/template';
import { Thread } from '../../../../../lib/actor/system/vm/thread';
import { ADDRESS_SYSTEM } from '../../../../../lib/actor/address';
import { SupervisorErrorStrategy } from '../../../../../lib/actor/system/vm/strategy/error';
import { ActorTerminatedErr } from '../../../../../lib/actor/system/vm/runtime/error';
import { Allocator } from '../../../../../lib/actor/system/vm/allocator';

describe('SupervisorErrorStrategy', () => {
    const mockAllocator = mockDeep<Allocator>();

    const mockPlatform = mockDeep<Platform>();

    const getPlatform = () => mockPlatform;

    mockPlatform.allocator = mockAllocator;

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('raise', () => {
        let templates: Record<Template> = {
            '/': { create: () => {} },
            '/child': { create: () => {} }
        };

        let threads: Record<Thread> = {
            [ADDRESS_SYSTEM]: mockDeep<Thread>()
        };

        let err = new Error('fail');

        beforeEach(() => {
            mockAllocator.getTemplate.mockImplementation(address =>
                Maybe.fromNullable(templates[address])
            );
            mockAllocator.getThread.mockImplementation(address =>
                Maybe.fromNullable(threads[address])
            );
        });

        it("should invoke the thread's template handler", async () => {
            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_IGNORE);
            templates['/child'].trap = trap;

            let thread = mockDeep<Thread>();

            thread.address = '/child';

            let stategy = new SupervisorErrorStrategy(getPlatform);

            await stategy.raise(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/child');

            expect(mockAllocator.getTemplate).toHaveBeenCalledTimes(1);

            expect(trap).toHaveBeenCalledWith(err);
        });

        it('should restart the thread', async () => {
            let parentThread = mockDeep<Thread>();
            let thread = mockDeep<Thread>();
            let newThread = mockDeep<Thread>();

            parentThread.address = '/';
            thread.address = '/target';
            newThread.address = '/target';
            threads['/'] = parentThread;
            threads['/target'] = thread;

            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_RESTART);

            let template = { create: () => {}, trap };
            templates['/target'] = template;

            mockAllocator.reallocate.mockImplementation(async thread => {
                threads[thread.address] = newThread;
            });

            let strategy = new SupervisorErrorStrategy(getPlatform);

            await strategy.raise(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/target');

            expect(trap).toHaveBeenCalledWith(err);

            expect(threads['/']).toBe(parentThread);

            expect(threads['/target']).toBe(newThread);

            expect(mockAllocator.reallocate).toHaveBeenCalledWith(thread);
        });

        it('should stop the thread', async () => {
            let parentThread = mockDeep<Thread>();
            let thread = mockDeep<Thread>();

            parentThread.address = '/';
            thread.address = '/target';
            threads['/'] = parentThread;
            threads['/target'] = thread;

            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_STOP);

            let template = { create: () => {}, trap };
            templates['/target'] = template;

            let strategy = new SupervisorErrorStrategy(getPlatform);

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

            let parentThread = mockDeep<Thread>();
            parentThread.address = '/';
            threads['/'] = parentThread;

            let childTrap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_RAISE);
            templates['/child'].trap = childTrap;

            let childThread = mockDeep<Thread>();
            childThread.address = '/child';
            threads['/child'] = childThread;

            let strategy = new SupervisorErrorStrategy(getPlatform);

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

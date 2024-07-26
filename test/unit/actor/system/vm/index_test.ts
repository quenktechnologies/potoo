import { mockDeep } from 'jest-mock-extended';

import { expect, jest } from '@jest/globals';

import { PVM } from '../../../../../lib/actor/system/vm';
import { Allocator } from '../../../../../lib/actor/system/vm/allocator';
import { Scheduler } from '../../../../../lib/actor/system/vm/scheduler';
import { Thread } from '../../../../../lib/actor/system/vm/thread';
import { LogLevelValue, LogSink } from '../../../../../lib/actor/system/vm/log';

describe('PVM', () => {
    const mockScheduler = mockDeep<Scheduler>();

    const mockAllocator = mockDeep<Allocator>();

    const mockParent = mockDeep<Thread>();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('create', () => {
        it('should work', () => {
            let sink = mockDeep<LogSink>();

            let vm = PVM.create({
                log: {
                    level: 'warn',
                    sink
                }
            });

            expect(vm.log.sink).toBe(sink);
            expect(vm.log.level).toBe(LogLevelValue.warn);
        });
    });

    describe('sendMessage', () => {
        it('should deliver a message to an actor', async () => {
            let thread = mockDeep<Thread>();

            thread.notify.mockResolvedValue();

            mockAllocator.getThreads.mockReturnValue([thread]);

            let vm = new PVM(mockAllocator, mockScheduler);

            await vm.sendMessage(mockParent, '/', 'hello');

            expect(mockAllocator.getThreads).toHaveBeenCalledWith(['/']);

            expect(thread.notify).toHaveBeenCalledWith('hello');
        });
    });
});

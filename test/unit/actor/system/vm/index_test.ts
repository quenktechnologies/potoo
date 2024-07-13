import { mockDeep } from 'jest-mock-extended';

import { expect, jest } from '@jest/globals';

import { PVM } from '../../../../../lib/actor/system/vm';
import { Allocator } from '../../../../../lib/actor/system/vm/allocator';
import { Scheduler } from '../../../../../lib/actor/system/vm/scheduler';
import { Thread } from '../../../../../lib/actor/system/vm/thread';

describe('PVM', () => {
    const mockScheduler = mockDeep<Scheduler>();

    const mockAllocator = mockDeep<Allocator>();

    const mockParent = mockDeep<Thread>();

    beforeEach(() => {
        jest.resetAllMocks();
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

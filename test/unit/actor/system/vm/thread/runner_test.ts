import { mockDeep } from 'jest-mock-extended';
import { ADDRESS_SYSTEM } from '../../../../../../lib/actor/address';

import { VM } from '../../../../../../lib/actor/system/vm';
import { EVENT_ACTOR_STARTED } from '../../../../../../lib/actor/system/vm/event';
import { EventDispatcher } from '../../../../../../lib/actor/system/vm/event/dispatcher';
import { GroupMap } from '../../../../../../lib/actor/system/vm/group';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';
import { ThreadCollector } from '../../../../../../lib/actor/system/vm/thread/collector';
import { ThreadRunner } from '../../../../../../lib/actor/system/vm/thread/runner';

describe('ThreadRunner', () => {
    let vm = mockDeep<VM>();
    vm.address = ADDRESS_SYSTEM;

    let mockGroups = mockDeep<GroupMap>();
    vm.groups = mockGroups;

    let events = mockDeep<EventDispatcher>();
    vm.events = events;

    let collector = mockDeep<ThreadCollector>();
    vm.collector = collector;

    describe('runThread', () => {
        it('should start the thread', async () => {
            let runner = new ThreadRunner(vm);

            let thread = mockDeep<Thread>();

            await runner.runThread(thread);

            expect(thread.start).toBeCalled();

            expect(events.dispatchActorEvent).toBeCalledWith(
                thread.address,
                thread.address,
                EVENT_ACTOR_STARTED
            );
        });

        it('should mark run templates for collection', async () => {
            let runner = new ThreadRunner(vm);

            let thread: Thread = mockDeep<Thread>();

            thread.template = { run: async () => {} };

            await runner.runThread(thread);

            expect(collector.mark).toBeCalledWith(thread);

            expect(collector.collect).toBeCalledWith(thread);

            expect(events.dispatchActorEvent).toBeCalledWith(
                thread.address,
                thread.address,
                EVENT_ACTOR_STARTED
            );
        });

        it('should not mark create templates for collection', async () => {
            let runner = new ThreadRunner(vm);

            let thread: Thread = mockDeep<Thread>();

            thread.template = { create: () => thread };

            await runner.runThread(thread);

            expect(thread.start).toBeCalled();

            expect(collector.mark).not.toBeCalledWith(thread);

            expect(events.dispatchActorEvent).toBeCalledWith(
                thread.address,
                thread.address,
                EVENT_ACTOR_STARTED
            );
        });

        it('should catch thrown errors', async () => {
            let runner = new ThreadRunner(vm);

            let thread: Thread = mockDeep<Thread>();

            let msg = '';

            thread.start = jest.fn(async () => {
                throw new Error('eww');
            });

            thread.raise = jest.fn(async (err: Error) => {
                msg = err.message;
            });

            await runner.runThread(thread);

            expect(thread.start).toBeCalled();

            expect(msg).toBe('eww');
        });
    });
});

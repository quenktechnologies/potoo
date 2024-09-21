import { PVM } from '../../lib/actor/system/vm';
import {
    SPAWN_CONCERN_ALLOCATED,
    SPAWN_CONCERN_RECEIVING,
    SPAWN_CONCERN_STARTED,
    SPAWN_CONCERN_STOPPED
} from '../../lib/actor/template';
import { MapAllocator } from '../../lib/actor/system/vm/allocator/map';
import {
    EVENT_ACTOR_ALLOCATED,
    EVENT_ACTOR_RECEIVE,
    EVENT_ACTOR_STARTED,
    EVENT_ACTOR_STOPPED
} from '../../lib/actor/system/vm/event';
import { Runtime } from '../../lib/actor/system/vm/runtime';

export const x = [
    {
        concern: SPAWN_CONCERN_ALLOCATED,
        event: EVENT_ACTOR_ALLOCATED,
        run: async () => {}
    },
    {
        concern: SPAWN_CONCERN_STARTED,
        event: EVENT_ACTOR_STARTED,
        run: async () => {}
    },
    {
        concern: SPAWN_CONCERN_RECEIVING,
        event: EVENT_ACTOR_RECEIVE,
        run: async (ref: Runtime) => {
            ref.receive();
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }
];

describe('vm', () => {
    describe('spawnConcern', () => {
        for (let conf of [
            /*           {
                concern: SPAWN_CONCERN_ALLOCATED,
                event: EVENT_ACTOR_ALLOCATED,
                run: async () => {}
            },
          {
            concern: SPAWN_CONCERN_STARTED,
            event: EVENT_ACTOR_STARTED,
            run: async () => {

            }
          },*/
            {
                concern: SPAWN_CONCERN_RECEIVING,
                event: EVENT_ACTOR_RECEIVE,
                run: async (ref: Runtime) => {
                    await ref.receive();
                }
            },
            {
                concern: SPAWN_CONCERN_STOPPED,
                event: EVENT_ACTOR_STOPPED,
                run: async () => {}
            }
        ]) {
            it(conf.concern, async () => {
                let vm = PVM.create();

                let dispatchSpy = jest.spyOn(vm.events, 'dispatchActorEvent');

                let monitorSpy = jest.spyOn(vm.events, 'monitor');

                let address = await vm.spawn({
                    id: '/',
                    spawnConcern: conf.concern,
                    run: conf.run
                });

                if (conf.concern === SPAWN_CONCERN_STOPPED) {
                    expect(
                        (<MapAllocator>vm.allocator).getThread('/').isNothing()
                    ).toBe(true);
                } else {
                    let thread = (<MapAllocator>vm.allocator)
                        .getThread('/')
                        .get();
                    expect(address).toBe('/');
                    expect(monitorSpy).toHaveBeenCalledWith(thread, conf.event);
                    expect(dispatchSpy).toHaveBeenCalledWith(
                        thread,
                        conf.event
                    );
                }
            });
        }
    });
});

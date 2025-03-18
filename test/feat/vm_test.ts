import { TypeCase } from '@quenk/noni/lib/control/match/case';
import { wait } from '@quenk/noni/lib/control/monad/future';

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
    describe('spawn', () => {
        let vm: PVM;

        beforeEach(() => {
            vm = PVM.create();
        });

        afterEach(async () => {
            await vm.stop();
        });

        it('should allow send, receive, reply', async () => {
            let success = false;

            await vm.spawn({
                id: 'sender',
                run: async actor => {
                    await actor.tell('receiver', 'syn');
                    await actor.receive([
                        new TypeCase('ack', () => {
                            success = true;
                        })
                    ]);
                }
            });

            await vm.spawn({
                id: 'receiver',
                run: async actor => {
                    await actor.receive([
                        new TypeCase('syn', async () => {
                            await actor.tell('sender', 'ack');
                        })
                    ]);
                }
            });

            await wait(100);
            expect(success).toBe(true);
        });

        it('should allow a child to talk to its parent in the run method', async () => {
            // This is really about issue #43

            let success = false;

            await vm.spawn({
                id: 'parent',
                run: async parent => {
                    await parent.spawn({
                        id: 'child',
                        run: async child => {
                            await child.tell(parent.self, 'hello');
                        }
                    });
                    await parent.receive([
                        new TypeCase('hello', () => {
                            success = true;
                        })
                    ]);
                }
            });

            await wait(100);

            expect(success).toBe(true);
        });

        it('should work with function actors', async () => {
            let called = false;
            await vm.spawn(async () => {
                called = true;
            });
            await wait(0);
            expect(called).toBe(true);
        });

        it('should auto exit function actors', async () => {
            let found = false;

            await vm.spawn(async actor => {
                if (<object>vm.allocator.getThreads()[0] === actor)
                    found = true;
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            expect(found).toBe(true);
            expect(vm.allocator.getThreads().length).toBe(0);
        });

        it('should not auto exit if there are children', async () => {
            let packs: number[] = [];
            await vm.spawn({
                id: 'root',
                run: async root => {
                    packs.push(1);
                    await root.spawn(async child => {
                        packs.push(2);
                        await child.spawn(async () => {
                            packs.push(3);
                        });
                    });
                    packs.push(4);
                }
            });

            await wait(0);

            expect(packs).toEqual([1, 2, 4, 3]);
        });

        it('should not auto exit if there are children (concern=stopped)', async () => {
            let packs: number[] = [];
            await vm.spawn({
                id: 'root',
                spawnConcern: SPAWN_CONCERN_STOPPED,
                run: async root => {
                    packs.push(1);
                    await root.spawn({
                        spawnConcern: SPAWN_CONCERN_STOPPED,
                        run: async child => {
                            packs.push(2);
                            await child.spawn({
                                spawnConcern: SPAWN_CONCERN_STOPPED,
                                run: async () => {
                                    packs.push(3);
                                }
                            });
                        }
                    });
                    packs.push(4);
                }
            });
            expect(packs).toEqual([1, 2, 3, 4]);
        });

        it.each([
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
                    await ref.receive();
                }
            },
            {
                concern: SPAWN_CONCERN_STOPPED,
                event: EVENT_ACTOR_STOPPED,
                run: async () => {}
            }
        ])('should handle $concern spawn concern', async conf => {
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
                let thread = (<MapAllocator>vm.allocator).getThread('/').get();
                expect(address).toBe('/');
                expect(monitorSpy).toHaveBeenCalledWith(
                    conf.concern === SPAWN_CONCERN_ALLOCATED ? vm : thread,
                    conf.event
                );

                let target =
                    conf.concern === SPAWN_CONCERN_ALLOCATED
                        ? '$'
                        : thread.address;
                expect(dispatchSpy).toHaveBeenCalledWith(
                    target,
                    thread.address,
                    conf.event
                );
            }
        });
    });
});

import { expect } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

import { Maybe } from '@quenk/noni/lib/data/maybe';
import { wait } from '@quenk/noni/lib/control/monad/future';

import { Actor } from '../../../../../lib/actor';
import { Platform } from '../../../../../lib/actor/system/vm';
import {
    ActorTableEntry,
    MapAllocator
} from '../../../../../lib/actor/system/vm/allocator/map';
import { Thread } from '../../../../../lib/actor/system/vm/thread';
import { SharedThread } from '../../../../../lib/actor/system/vm/thread/shared';
import { GroupMap } from '../../../../../lib/actor/system/vm/group';

describe('MapAllocator', () => {

    let mockGroups = mockDeep<GroupMap>();

    let parent = mockDeep<Thread>();

    let platform = mockDeep<Platform>();

    platform.groups = mockGroups;

    let getPlatform = () => platform;

    let actor = mockDeep<Actor>();

    let childActor = mockDeep<Actor>();

    let parentEntry: ActorTableEntry;

    beforeEach(() => {
        parentEntry = {
            address: '/',
            parent: Maybe.nothing(),
            actor,
            template: { create: () => parentEntry.actor },
            thread: parent,
            children: []
        };
    });

    describe('getTemplate', () => {
        it('should provide the template', () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            let mtemplate = map.getTemplate('/');
            expect(mtemplate.isJust()).toBe(true);
            expect(mtemplate.get()).toBe(parentEntry.template);
        });

        it('should not provide a template when it does not exists', () => {
            let map = new MapAllocator(getPlatform);
            let mtemplate = map.getTemplate('/');
            expect(mtemplate.isJust()).toBe(false);
        });
    });

    describe('getThread', () => {
        it('should provide a thread when it exists', () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);
            let mthread = map.getThread('/');
            expect(mthread.isJust()).toBe(true);
            expect(mthread.get()).toBe(parentEntry.thread);
        });

        it('should not provide a thread when it does not exists', () => {
            let map = new MapAllocator(getPlatform);
            let mthread = map.getThread('/');
            expect(mthread.isJust()).toBe(false);
        });
    });

    describe('getThreads', () => {

        it('should return all matching threads', () => {

          let threadOne = mockDeep<Thread>();
          threadOne.address = '/one';

          let threadTwo = mockDeep<Thread>();
          threadTwo.address = '/two';

          let threadThree = mockDeep<Thread>();
          threadThree.address = '/three';

          let map = new MapAllocator(getPlatform);

          map.actors.set('/one', { address: '/one', thread: threadOne });
          map.actors.set('/two', { address: '/two', thread: threadTwo });
          map.actors.set('/three', { address: '/three', thread: threadThree });

          let threads = map.getThreads(['/one', '/three']);

          expect(threads).toEqual([threadOne, threadThree]);
          
        });
      
    });

    describe('allocate', () => {
        it('should allocate threads for actors', async () => {
            let map = new MapAllocator(getPlatform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                id: 'test',
                create: () => childActor
            });

            await wait(100);

            expect(childActor.start).toBeCalledTimes(1);

            let entry = map.actors.get('/test');

            expect(entry.thread).toBeInstanceOf(SharedThread);

            expect(parentEntry.children).toContain(entry);

            expect(entry.parent.get()).toBe(parentEntry);

            expect(addr).toBe('/test');
        });

        it('should auto assign an id if non specified', async () => {
            let map = new MapAllocator(getPlatform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                create: () => childActor
            });

            expect(addr).toBe('/instance::object::aid::1');
        });

        it('should raise on a restricted character in the id', async () => {
            for (let id of ['', ' ', '$', '?', '$test']) {
                let map = new MapAllocator(getPlatform);

                map.actors.set('/', parentEntry);

                expect(
                    async () =>
                        await map.allocate(parent, {
                            id,
                            create: () => childActor
                        })
                ).rejects.toThrowError();
                expect(parentEntry.children).toEqual([]);
            }
        });

        it('should raise on a duplicated id', async () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            await map.allocate(parent, {
                id: 'child',
                create: () => childActor
            });
            expect(
                async () =>
                    await map.allocate(parent, {
                        id: 'child',
                        create: () => childActor
                    })
            ).rejects.toThrowError();
        });

        it('should assign actors to groups', async () => {
            let map = new MapAllocator(getPlatform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                id: 'test',
                group: 'test',
                create: () => childActor
            });

            await wait(100);

            expect(mockGroups.enroll).toBeCalledWith(addr, 'test');

        });
    });

    describe('reallocate', () => {
        it('should reallocate actors', async () => {
            let map = new MapAllocator(getPlatform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                id: 'test',
                create: () => childActor
            });

            await wait(100);

            expect(childActor.start).toBeCalledTimes(1);

            expect(childActor.stop).toBeCalledTimes(0);

            let thread = map.getThread(addr).get();

            await map.reallocate(thread);

            await wait(100);

            expect(childActor.start).toBeCalledTimes(2);

            expect(childActor.stop).toBeCalledTimes(1);

            let newThread = map.getThread(addr).get();

            expect(newThread).not.toBe(thread);
        });
    });

    describe('deallocate', () => {
        it('should remove an entry for an actor', async () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            await map.deallocate(parent);

            expect(map.actors.has('/')).toBe(false);
            expect(parent.die).toBeCalledTimes(1);
        });

        it('should remove the actor from its parent', async () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            let thread = mockDeep<Thread>();
            let childEntry = {
                address: '/child',
                parent: Maybe.just(parentEntry),
                actor: childActor,
                thread,
                children: []
            };
            map.actors.set('/child', childEntry);
            map.actors.get('/').children.push(childEntry);

            await map.deallocate(thread);

            expect(map.actors.has('/child')).toBe(false);
            expect(map.actors.get('/').children).toEqual([]);
            expect(thread.die).toBeCalledTimes(1);
            expect(map.actors.get('/')).toBe(parentEntry);
            expect(parent.die).not.toBeCalled();
        });

        it('should remove the children of the actor', async () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            let childEntry0 = {
                address: '/a',
                parent: Maybe.just(parentEntry),
                actor: mockDeep<Actor>(),
                template: { create: () => childEntry0.actor },
                thread: mockDeep<Thread>({}),
                children: []
            };
            map.actors.set('/a', childEntry0);
            parentEntry.children.push(childEntry0);

            let childEntry1 = {
                address: '/a/b',
                parent: Maybe.just(childEntry0),
                actor: mockDeep<Actor>(),
                template: { create: () => childEntry1.actor },
                thread: mockDeep<Thread>(),
                children: []
            };
            map.actors.set('/a/b', childEntry1);
            childEntry0.children.push(childEntry1);

            let childEntry2 = {
                address: '/a/b/c',
                parent: Maybe.just(childEntry1),
                actor: mockDeep<Actor>(),
                template: { create: () => childEntry2.actor },
                thread: mockDeep<Thread>(),
                children: []
            };
            map.actors.set('/a/b/c', childEntry2);
            childEntry1.children.push(childEntry2);

            let order: number[] = [];
            childEntry0.thread.die
                .calledWith()
                .mockImplementation(() => order.push(0));
            childEntry1.thread.die
                .calledWith()
                .mockImplementation(() => order.push(1));
            childEntry2.thread.die
                .calledWith()
                .mockImplementation(() => order.push(2));

            await map.deallocate(childEntry0.thread);

            expect(map.actors.has('/')).toBe(true);
            expect(map.actors.has('/a')).toBe(false);
            expect(map.actors.has('/a/b')).toBe(false);
            expect(map.actors.has('/a/b/c')).toBe(false);
            expect(parentEntry.children).toEqual([]);
            expect(childEntry0.thread.die).toBeCalledTimes(1);
            expect(childEntry1.thread.die).toBeCalledTimes(1);
            expect(childEntry2.thread.die).toBeCalledTimes(1);
            expect(order).toEqual(expect.arrayContaining([2, 1, 0]));
            expect(parentEntry.children).toEqual([]);
        });

      it('should unenroll the actor from its group', async () => {
            let map = new MapAllocator(getPlatform);
            map.actors.set('/', parentEntry);

            await map.deallocate(parent);
            expect(mockGroups.unenroll).toBeCalledWith('/');

        });


      })
    });

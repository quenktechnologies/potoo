import { expect } from '@jest/globals';
import { mockDeep } from 'jest-mock-extended';

import { identity } from '@quenk/noni/lib/data/function';
import { wait } from '@quenk/noni/lib/control/monad/future';
import { Maybe } from '@quenk/noni/lib/data/maybe';

import { Actor } from '../../../../../../lib/actor';
import { VM } from '../../../../../../lib/actor/system/vm';
import {
    ActorTableEntry,
    MapAllocator
} from '../../../../../../lib/actor/system/vm/allocator/map';
import { JSThread } from '../../../../../../lib/actor/system/vm/thread/shared/js';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';
import { GroupMap } from '../../../../../../lib/actor/system/vm/group';
import { ADDRESS_SYSTEM } from '../../../../../../lib/actor/address';
import { EventDispatcher } from '../../../../../../lib/actor/system/vm/event/dispatcher';

describe('MapAllocator', () => {
    let mockGroups = mockDeep<GroupMap>();

    let parent = mockDeep<Thread>();

    let platform = mockDeep<VM>();

    platform.groups = mockGroups;

    platform.address = ADDRESS_SYSTEM;

    platform.runTask.mockImplementation((_: Thread, t: () => Promise<void>) =>
        t()
    );

    let events = mockDeep<EventDispatcher>();

    platform.events = events;

    let actor = mockDeep<Actor>();

    let childActor = mockDeep<Actor>();

    let parentEntry: ActorTableEntry;

    beforeEach(() => {
        parent.address = '/';
        parentEntry = {
            address: '/',
            parent: Maybe.nothing(),
            template: { create: () => actor },
            thread: parent,
            children: []
        };
    });

    describe('getTemplate', () => {
        it('should provide the template', () => {
            let map = new MapAllocator(platform);
            map.actors.set('/', parentEntry);

            let mtemplate = map.getTemplate('/');
            expect(mtemplate.isJust()).toBe(true);
            expect(mtemplate.get()).toBe(parentEntry.template);
        });

        it('should not provide a template when it does not exists', () => {
            let map = new MapAllocator(platform);
            let mtemplate = map.getTemplate('/');
            expect(mtemplate.isJust()).toBe(false);
        });
    });

    describe('getThread', () => {
        it('should provide a thread when it exists', () => {
            let map = new MapAllocator(platform);
            map.actors.set('/', parentEntry);
            let mthread = map.getThread('/');
            expect(mthread.isJust()).toBe(true);
            expect(mthread.get()).toBe(parentEntry.thread);
        });

        it('should not provide a thread when it does not exists', () => {
            let map = new MapAllocator(platform);
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

            let map = new MapAllocator(platform);

            map.actors.set('/one', { address: '/one', thread: threadOne });
            map.actors.set('/two', { address: '/two', thread: threadTwo });
            map.actors.set('/three', {
                address: '/three',
                thread: threadThree
            });

            let threads = map.getThreads(['/one', '/three']);

            expect(threads).toEqual([threadOne, threadThree]);
        });
    });

    describe('getChildren', () => {
        it('should return all the child threads', () => {
            let childOne = mockDeep<Thread>();
            childOne.address = '/child/one';

            let childTwo = mockDeep<Thread>();
            childTwo.address = '/child/two';

            let childThree = mockDeep<Thread>();
            childThree.address = '/child/three';

            let map = new MapAllocator(platform);

            parentEntry.children = [
                {
                    address: '/child/one',
                    thread: childOne,
                    parent: Maybe.nothing(),
                    template: { create: () => childOne },
                    children: []
                },
                {
                    address: '/child/two',
                    thread: childTwo,
                    parent: Maybe.nothing(),
                    template: { create: () => childTwo },
                    children: []
                },
                {
                    address: '/child/three',
                    thread: childThree,
                    parent: Maybe.nothing(),
                    template: { create: () => childThree },
                    children: []
                }
            ];

            map.actors.set('/child', parentEntry);
            map.actors.set('/child/one', parentEntry.children[0]);
            map.actors.set('/child/two', parentEntry.children[1]);
            map.actors.set('/child/three', parentEntry.children[2]);

            let threads = map.getChildren(parent);
            expect(threads).toEqual([childOne, childTwo, childThree]);
        });
    });

    describe('allocate', () => {
        it('should allocate threads for actors', async () => {
            let map = new MapAllocator(platform);

            map.actors.set('/', parentEntry);

            let tmpl = {
                id: 'test',
                create: () => childActor
            };

            let addr = await map.allocate(parent, tmpl);

            await wait(100);

            expect(platform.runner.runThread).toBeCalledTimes(1);

            let entry = map.actors.get('/test');

            expect(entry.thread).toBeInstanceOf(JSThread);

            expect(parentEntry.children).toContain(entry);

            expect(entry.parent.get()).toBe(parentEntry);

            expect(addr).toBe('/test');
        });

        it('should auto assign an id if non specified', async () => {
            let map = new MapAllocator(platform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                create: () => childActor
            });

            expect(addr).toBe('/instance::vm::aid::1');
        });

        it('should raise on a restricted character in the id', async () => {
            for (let id of ['', ' ', '$', '?', '$test']) {
                let map = new MapAllocator(platform);

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
            let map = new MapAllocator(platform);
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
            let map = new MapAllocator(platform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                id: 'test',
                group: 'test',
                create: () => childActor
            });

            await wait(100);

            expect(mockGroups.enroll).toBeCalledWith(addr, 'test');
        });

        it('should recognize the vm when spawning from root', async () => {
            let map = new MapAllocator(platform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(platform, {
                id: 'root',
                create: () => childActor
            });

            await wait(100);

            expect(platform.runner.runThread).toBeCalledTimes(1);

            let entry = map.actors.get('root');

            expect(entry.thread).toBeInstanceOf(JSThread);

            expect(entry.parent.isNothing()).toBe(true);

            expect(parentEntry.children.length).toBe(0);

            expect(addr).toBe('root');
        });
    });

    describe('reallocate', () => {
        it('should reallocate actors', async () => {
            let map = new MapAllocator(platform);

            map.actors.set('/', parentEntry);

            let addr = await map.allocate(parent, {
                id: 'test',
                create: () => childActor
            });

            await wait(100);

            expect(platform.runner.runThread).toBeCalledTimes(1);

            let thread = map.getThread(addr).get();

            let stopSpy = jest.spyOn(thread, 'stop');

            await map.reallocate(thread);

            await wait(100);

            expect(platform.runner.runThread).toBeCalledTimes(2);

            expect(stopSpy).toBeCalledTimes(1);

            let newThread = map.getThread(addr).get();

            expect(newThread).not.toBe(thread);
        });
    });

    describe('deallocate', () => {
        it('should remove an entry for an actor', async () => {
            let map = new MapAllocator(platform);
            map.actors.set('/', parentEntry);

            await map.deallocate(parent);

            expect(map.actors.has('/')).toBe(false);
            expect(parent.stop).toBeCalledTimes(1);
        });

        it('should remove the actor from its parent', async () => {
            let map = new MapAllocator(platform);
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
            expect(thread.stop).toBeCalledTimes(1);
            expect(map.actors.get('/')).toBe(parentEntry);
            expect(parent.stop).not.toBeCalled();
        });

        it('should remove the children of the actor', async () => {
            let map = new MapAllocator(platform);
            map.actors.set('/', parentEntry);

            let childEntry0 = {
                address: '/a',
                parent: Maybe.just(parentEntry),
                actor: mockDeep<Actor>(),
                template: { create: () => childEntry0.actor },
                thread: mockDeep<Thread>({}),
                children: <ActorTableEntry[]>[]
            };
            map.actors.set('/a', childEntry0);
            parentEntry.children.push(childEntry0);

            let childEntry1 = {
                address: '/a/b',
                parent: Maybe.just(childEntry0),
                actor: mockDeep<Actor>(),
                template: { create: identity },
                thread: mockDeep<Thread>(),
                children: <ActorTableEntry[]>[]
            };
            map.actors.set('/a/b', childEntry1);
            childEntry0.children.push(childEntry1);

            let childEntry2 = {
                address: '/a/b/c',
                parent: Maybe.just(childEntry1),
                actor: mockDeep<Actor>(),
                template: { create: () => childEntry2.actor },
                thread: mockDeep<Thread>(),
                children: <ActorTableEntry[]>[]
            };
            map.actors.set('/a/b/c', childEntry2);
            childEntry1.children.push(childEntry2);

            let order: number[] = [];
            childEntry0.thread.stop.mockImplementation(async () => {
                order.push(0);
            });
            childEntry1.thread.stop.mockImplementation(async () => {
                order.push(1);
            });
            childEntry2.thread.stop.mockImplementation(async () => {
                order.push(2);
            });

            await map.deallocate(childEntry0.thread);

            expect(map.actors.has('/')).toBe(true);
            expect(map.actors.has('/a')).toBe(false);
            expect(map.actors.has('/a/b')).toBe(false);
            expect(map.actors.has('/a/b/c')).toBe(false);
            expect(parentEntry.children).toEqual([]);
            expect(childEntry0.thread.stop).toBeCalledTimes(1);
            expect(childEntry1.thread.stop).toBeCalledTimes(1);
            expect(childEntry2.thread.stop).toBeCalledTimes(1);
            expect(order).toEqual(expect.arrayContaining([2, 1, 0]));
            expect(parentEntry.children).toEqual([]);
        });

        it('should unenroll the actor from its group', async () => {
            let map = new MapAllocator(platform);
            map.actors.set('/', parentEntry);

            await map.deallocate(parent);
            expect(mockGroups.unenroll).toBeCalledWith('/');
        });
    });
});

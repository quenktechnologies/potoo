import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';

import { expect, jest } from '@jest/globals';

import { mockDeep } from 'jest-mock-extended';

import { PVM } from '../../../../lib/actor/system/vm';
import { Allocator } from '../../../../lib/actor/system/vm/allocator';
import { Scheduler } from '../../../../lib/actor/system/vm/scheduler';
import { Thread } from '../../../../lib/actor/system/vm/thread';
import {
    ACTION_IGNORE,
    ACTION_RAISE,
    ACTION_RESTART,
    ACTION_STOP,
    Template,
    TrapAction
} from '../../../../lib/actor/template';
import { ADDRESS_SYSTEM } from '../../../../lib/actor/address';
import { Err } from '@quenk/noni/lib/control/err';
import { ActorTerminatedErr } from '../../../../lib/actor/system/vm/runtime/error';

describe('PVM', () => {
    const mockScheduler = mockDeep<Scheduler>();

    const mockAllocator = mockDeep<Allocator>();

    const mockParent = mockDeep<Thread>();

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('allocateActor', () => {
        it('should provide the allocated actor address', async () => {
            mockAllocator.allocate.mockResolvedValue('/');

            let vm = new PVM(mockScheduler, mockAllocator);

            let template = {
                create: () => {}
            };

            let address = await vm.allocateActor(mockParent, template);

            expect(address).toBe('/');

            expect(mockAllocator.allocate).toHaveBeenCalledWith(
                vm,
                vm.scheduler,
                mockParent,
                template
            );
        });

        it('should add the actor to a group', async () => {
            mockAllocator.allocate.mockResolvedValue('/');

            let vm = new PVM(mockScheduler, mockAllocator);

            let template = {
                create: () => {},
                group: 'foo'
            };

            let address = await vm.allocateActor(mockParent, template);

            expect(address).toBe('/');

            expect(vm.groups.get('foo')).toEqual(['/']);
        });
    });

    describe('sendActorMessage', () => {
        it('should deliver a message to an actor', async () => {
            let thread = mockDeep<Thread>();

            mockAllocator.getThread.mockReturnValue(Maybe.just(thread));

            let vm = new PVM(mockScheduler, mockAllocator);

            await vm.sendActorMessage(mockParent, '/', 'hello');

            expect(mockAllocator.getThread).toHaveBeenCalledWith('/');

            expect(thread.notify).toHaveBeenCalledWith('hello');
        });
    });

    describe('raiseActorError', () => {
        let templates: Record<Template> = {
            '/': { create: () => {} },
            '/child': { create: () => {} }
        };

        let systemThread = mockDeep<Thread>();
        systemThread.address = ADDRESS_SYSTEM;

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

            let vm = new PVM(mockScheduler, mockAllocator);

            await vm.raiseActorError(thread, err);

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

            mockAllocator.deallocate.mockImplementation(async thread => {
                delete threads[thread.address];
                delete templates[thread.address];
            });

            mockAllocator.allocate.mockImplementation(
                async (_vm, _scheduler, _parent, template) => {
                    threads[thread.address] = newThread;
                    return thread.address;
                }
            );

            let vm = new PVM(mockScheduler, mockAllocator);

            await vm.raiseActorError(thread, err);

            expect(mockAllocator.getTemplate).toHaveBeenCalledWith('/target');

            expect(trap).toHaveBeenCalledWith(err);

            expect(threads['/']).toBe(parentThread);

            expect(threads['/target']).toBe(newThread);

            expect(mockAllocator.deallocate).toHaveBeenCalledWith(thread);

            expect(mockAllocator.allocate).toHaveBeenCalledWith(
                vm,
                mockScheduler,
                parentThread,
                template
            );
        });

        it('should stop the thread', async () => {
            let parentThread = mockDeep<Thread>();
            let thread = mockDeep<Thread>();
            let newThread = mockDeep<Thread>();

            parentThread.address = '/';
            thread.address = '/target';
            threads['/'] = parentThread;
            threads['/target'] = thread;

            let trap = jest
                .fn<() => TrapAction>()
                .mockReturnValueOnce(ACTION_STOP);

            let template = { create: () => {}, trap };
            templates['/target'] = template;

            let vm = new PVM(mockScheduler, mockAllocator);

            await vm.raiseActorError(thread, err);

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

            let vm = new PVM(mockScheduler, mockAllocator);

            await vm.raiseActorError(childThread, err);

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

/*
const mkEntry = (addr = '?', ate: Partial<ActorTableEntry> = {}) => {
    let val = <ActorTableEntry>merge(
        {
            context: newContext(),
            thread: nothing()
        },
        ate
    );

    if (val.thread.isJust()) {
        if (!ate.context) val.context = val.thread.get().context;
        else val.thread.get().context = val.context;
    }

    val.context.address = addr;

    return val;
};

describe('vm', () => {
    describe('PVM', () => {
        describe('exec', () => {
            it('should call exec on Threads', () => {
                let vm = new PVM(newSystem());

                let actor = newInstance();

                let thread = newThread();

                let entry = mkEntry('test', { thread: just(thread) });

                entry.context.actor = actor;

                vm.actors.items['test'] = entry;

                let args = [0, 0, 0];

                vm.exec(actor, 'sum', args);

                assert(thread.mock.wasCalledWith('exec', ['sum', args])).true();
            });

            it('should not call exec given an unknown instances', () => {
                let vm = new PVM(newSystem());

                let actor = newInstance();

                let context = newContext({ actor });

                let thread = just(newThread(context));

                vm.actors.items['test'] = mkEntry('test', { thread });

                vm.actors.items['test'].context.actor = newInstance();

                try {
                    vm.exec(actor, 'sum', [0, 0, 0]);
                } catch (e) {
                    let msg = new UnknownInstanceErr(actor).message;

                    assert((<Error>e).message).equal(msg);
                }

                assert(thread.get().mock.getCalledList().length === 0).true();
            });
        });

        describe('allocate', () => {
            it('should create new Threads', () => {
                let vm = new PVM(newSystem());

                assert(vm.actors.getThread('self').isNothing()).true();

                vm.allocate('self', { id: '0', create: newInstance });

                assert(vm.actors.get('self/0').isJust()).true();
            });

            it('should not allow duplicate ids', () => {
                let vm = new PVM(newSystem());

                assert(vm.actors.getThread('self').isNothing()).true();

                let er1 = vm.allocate('self', { id: '0', create: newInstance });

                assert(er1.isLeft()).false();

                let er2 = vm.allocate('self', { id: '0', create: newInstance });

                assert(er2.isLeft()).true();
            });

            it('should set up routers', () => {
                let vm = new PVM(newSystem());

                let act = newInstance();

                act.mock.setReturnCallback('init', (ctx: Context) => {
                    ctx.flags = ctx.flags | FLAG_ROUTER;

                    return ctx;
                });

                assert(vm.routers.get('self').isNothing()).true();

                vm.allocate('', { id: 'self', create: () => act });

                assert(vm.routers.get('self').isJust()).true();
            });

            it('should add to groups', () => {
                let vm = new PVM(newSystem());

                vm.allocate('', {
                    id: 'self',
                    create: newInstance,
                    group: 'foo'
                });

                assert(vm.groups.get('foo').isJust()).true();

                assert(vm.groups.items['foo']).equate(['self']);
            });
        });

        describe('runActor', () => {
            it('should invoke an actors start method', done => {
                let vm = new PVM(newSystem());

                let act = newInstance();

                let tmpl = { id: 'self', create: () => act };

                assert(vm.allocate('', tmpl).isRight()).true();

                vm.runActor('self');

                tick(() => {
                    assert(act.mock.wasCalled('start')).true();

                    done();
                });
            });
        });

        describe('sendMessage', () => {
            it('should pass messages directly to unbuffered actors', () => {
                let vm = new PVM(newSystem());

                let entry = mkEntry();

                let act = newInstance();

                entry.context.actor = act;

                entry.context.flags = 0;

                vm.actors.items['to'] = entry;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(act.mock.getCalledArgs('accept')).equate(['msg']);
            });

            it('should put messages in mailboxes', () => {
                let vm = new PVM(newSystem());

                let act = newInstance();

                let entry = mkEntry();

                entry.context.actor = act;

                entry.context.flags = FLAG_BUFFERED;

                vm.actors.items['to'] = entry;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(vm.actors.items['to'].context.mailbox).equate(['msg']);

                assert(act.mock.wasCalled('notify')).true();
            });

            it('should return false if actor not found', () => {
                let vm = new PVM(newSystem());

                assert(vm.sendMessage('to', 'from', 'msg')).false();
            });
        });

        describe('raise', () => {
            it("should use the template's trap function", () => {
                let vm = new PVM(newSystem());

                let entry = mkEntry();

                let called = false;

                entry.context.template.trap = () => {
                    called = true;

                    return ACTION_IGNORE;
                };

                vm.actors.items['self'] = entry;

                vm.raise(entry.context.actor, new Error('err'));

                assert(called).true();
            });

            it('should escalate by default', () => {
                let vm = new PVM(newSystem());

                let called = false;

                let entry = mkEntry();

                entry.context.template.trap = () => {
                    called = true;

                    return ACTION_IGNORE;
                };

                vm.actors.items.$ = entry;

                vm.actors.items['self'] = mkEntry('self', {
                    context: newContext({ address: 'self' })
                });

                vm.actors.items['self/0'] = mkEntry('self/0', {
                    context: newContext({ address: 'self/0' })
                });

                vm.actors.items['self/0'].context.template.trap = undefined;

                vm.raise(
                    vm.actors.items['self/0'].context.actor,
                    new Error('err')
                );

                assert(called).true();
            });

            it('should restart actors', done => {
                let vm = new PVM(newSystem());

                let act = newInstance();

                let called = false;

                let entry = mkEntry();

                entry.context.address = 'self';

                entry.context.template.create = () => {
                    called = true;

                    return act;
                };

                entry.context.template.trap = () => ACTION_RESTART;

                vm.actors.items['self'] = entry;

                vm.raise(entry.context.actor, new Error('err'));

                setTimeout(() => {
                    assert(called).true();

                    assert(act.mock.wasCalled('start')).true();

                    done();
                }, 100);
            });

            it('should throw if unhandled', () => {
                let vm = new PVM(newSystem());

                let caught = false;

                let r1 = mkEntry();

                let r2 = mkEntry();

                let r3 = mkEntry();

                r3.context.template.trap = () => ACTION_RAISE;

                r2.context.template.trap = () => ACTION_RAISE;

                r1.context.template.trap = () => ACTION_RAISE;

                vm.actors.items['self'] = r1;

                vm.actors.items['self/2'] = r2;

                vm.actors.items['self/2/3'] = r3;

                try {
                    vm.raise(r3.context.actor, new Error('err'));
                } catch (e) {
                    assert((<Error>e).message).equal('err');
                    caught = true;
                }

                assert(caught).true();
            });

            it('should use invoke the vms trap function', () => {
                let vm = new PVM(newSystem());

                let entry = mkEntry();

                let called = false;

                vm.conf.trap = () => {
                    called = true;

                    return ACTION_IGNORE;
                };

                vm.actors.items['self'] = entry;

                vm.raise(entry.context.actor, new Error('err'));

                assert(called).true();
            });
        });

        describe('kill', () => {
            it('should kill actors with threads', () =>
                doFuture(function* () {
                    let vm = new PVM(newSystem());

                    let thread = newThread();

                    let entry = mkEntry('self', { thread: just(thread) });

                    vm.actors.items['self'] = entry;

                    yield attempt(() =>
                        assert(vm.actors.getThread('self').isJust()).true()
                    );

                    yield vm.kill(entry.context.actor, 'self');

                    yield attempt(() => {
                        assert(vm.actors.getThread('self').isNothing()).true();

                        assert(thread.mock.wasCalled('die')).true();
                    });

                    return pure(undefined);
                }));

            it('should kill actors without threads', () =>
                doFuture(function* () {
                    let vm = new PVM(newSystem());

                    let entry = mkEntry('self');

                    vm.actors.items['self'] = entry;

                    yield attempt(() =>
                        assert(vm.actors.get('self').isJust()).true()
                    );

                    yield vm.kill(entry.context.actor, 'self');

                    yield attempt(() => {
                        assert(vm.actors.get('self').isNothing()).true();

                        assert(
                            (<Type>entry.context.actor).mock.wasCalled('stop')
                        ).true();
                    });

                    return pure(undefined);
                }));

            it('should kill the intended target', () =>
                doFuture(function* () {
                    let vm = new PVM(newSystem());

                    let self = mkEntry('self');

                    let self1 = mkEntry('self/1');

                    let self2 = mkEntry('self/2');

                    vm.actors.items['self'] = self;

                    vm.actors.items['self/1'] = self1;

                    vm.actors.items['self/2'] = self2;

                    yield vm.kill(self1.context.actor, 'self/1');

                    yield attempt(() => {
                        assert(vm.actors.get('self').isJust()).true();

                        assert(vm.actors.get('self/1').isNothing()).true();

                        assert(vm.actors.get('self/2').isJust()).true();

                        assert(
                            (<Type>self.context.actor).mock.wasCalled('stop')
                        ).false();

                        assert(
                            (<Type>self1.context.actor).mock.wasCalled('stop')
                        ).true();

                        assert(
                            (<Type>self2.context.actor).mock.wasCalled('stop')
                        ).false();
                    });

                    return pure(undefined);
                }));

            it('should kill a group', () =>
                doFuture(function* () {
                    let vm = new PVM(newSystem());

                    let self0 = mkEntry('self/0');

                    let self1 = mkEntry('self/1', {
                        thread: just(newThread())
                    });

                    let self2 = mkEntry('self/2');

                    let self3 = mkEntry('self/3');

                    vm.actors.items['self/0'] = self0;

                    vm.actors.items['self/1'] = self1;

                    vm.actors.items['self/2'] = self2;

                    vm.actors.items['self/3'] = self3;

                    vm.groups.items['$us'] = ['self/0', 'self/1', 'self/2'];

                    yield vm.kill(vm, '$us');

                    return attempt(() => {
                        assert(vm.actors.get('self/0').isNothing()).true();

                        assert(vm.actors.get('self/1').isNothing()).true();

                        assert(vm.actors.get('self/2').isNothing()).true();

                        assert(vm.actors.get('self/3').isJust()).true();

                        assert(
                            (<Type>self0.context.actor).mock.wasCalled('stop')
                        ).true();

                        assert(
                            (<Type>self1.thread.get()).mock.wasCalled('die')
                        ).true();

                        assert(
                            (<Type>self2.context.actor).mock.wasCalled('stop')
                        ).true();

                        assert(
                            (<Type>self3.context.actor).mock.wasCalled('stop')
                        ).false();
                    });
                }));

            it('should refuse non-child', () => {
                let thrown = false;

                let escalated = false;

                let vm = new PVM(newSystem());

                vm.actors.items['$'].context.template.trap = () => {
                    escalated = true;

                    return ACTION_IGNORE;
                };

                let e1 = mkEntry('that');

                let e2 = mkEntry('them/0');

                vm.actors.items['that'] = e1;

                vm.actors.items['them/0'] = e2;

                return vm
                    .kill(vm.actors.items['that'].context.actor, 'them/0')
                    .catch(e =>
                        attempt(() => {
                            thrown = true;

                            assert(e.message.startsWith('IllegalStopErr'));
                        })
                    )
                    .finally(() =>
                        attempt(() => {
                            assert(vm.actors.get('them/0').isJust()).true();

                            assert(escalated).true();

                            assert(thrown).true();
                        })
                    );
            });

            it('should reject a group with non-child', () =>
                doFuture(function* () {
                    let thrown = false;

                    let escalated = false;

                    let vm = new PVM(newSystem());

                    vm.actors.items.$.context.template.trap = () => {
                        escalated = true;

                        return ACTION_IGNORE;
                    };

                    let self = mkEntry('self');
                    let self0 = mkEntry('self/0');
                    let self1 = mkEntry('self/1');
                    let self2 = mkEntry('self/2');

                    vm.actors.items['self'] = self;
                    vm.actors.items['self/0'] = self0;
                    vm.actors.items['self/1'] = self1;
                    vm.actors.items['self/2'] = self2;
                    vm.actors.items['them/1'] = mkEntry('them/1');
                    vm.groups.items['$us'] = ['self/0', 'them/1', 'self/2'];

                    return vm
                        .kill(self.context.actor, '$us')
                        .trap(e => {
                            if (e.message.startsWith('IllegalStopErr')) {
                                thrown = true;

                                return pure(undefined);
                            } else {
                                return raise(e);
                            }
                        })
                        .finish(() =>
                            attempt(() => {
                                assert(escalated).true();

                                assert(thrown).true();
                            })
                        );
                }));

            it('should not remove the system from the table', () => {
                let vm = new PVM(newSystem());

                vm.actors.items['self'] = mkEntry();

                return toPromise(
                    vm.kill(vm, ADDRESS_SYSTEM).chain(() =>
                        attempt(() => {
                            assert(
                                vm.actors.getThread('self').isNothing()
                            ).true();

                            assert(
                                vm.actors.getThread(ADDRESS_SYSTEM).isJust()
                            ).true();
                        })
                    )
                );
            });
        });

        describe('stop', () => {
            it('should stop all actors', () =>
                doFuture(function* () {
                    let vm = new PVM(newSystem());

                    let self0 = mkEntry('self/0');

                    let them1 = mkEntry('self/1', {
                        thread: just(newThread())
                    });

                    let self2 = mkEntry('self/2');

                    vm.actors.items['self/0'] = self0;

                    vm.actors.items['them/1'] = them1;

                    vm.actors.items['self/2'] = self2;

                    yield vm.stop();

                    yield attempt(() => {
                        assert(
                            (<Type>self0.context.actor).mock.wasCalledNTimes(
                                'stop',
                                1
                            )
                        ).true();

                        assert(
                            (<Type>them1.thread.get()).mock.wasCalledNTimes(
                                'die',
                                1
                            )
                        ).true();

                        assert(
                            (<Type>self2.context.actor).mock.wasCalledNTimes(
                                'stop',
                                1
                            )
                        ).true();

                        assert(vm.actors.get('self/0').isNothing()).true();

                        assert(vm.actors.get('self/1').isNothing()).true();

                        assert(vm.actors.get('self/2').isNothing()).true();
                    });

                    return pure(undefined);
                }));
        });

        describe('spawn', () => {
            it('should assign random ids', done => {
                let vm = new PVM(newSystem());

                let name = 'actor::1~pvm';

                let onRun = () => {
                    assert(vm.actors.get(name).isJust()).true();

                    done();
                };

                class ChildActor extends Immutable<void> {
                    run() {
                        onRun();
                    }
                }

                vm.spawn(vm, s => new ChildActor(s));
            });
        });
    });
});
*/

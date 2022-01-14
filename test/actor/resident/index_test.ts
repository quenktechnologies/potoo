import { assert } from '@quenk/test/lib/assert';

import { count } from '@quenk/noni/lib/data/record';

import { system, TestSystem } from './fixtures/system';
import {
    Spawner,
    Killer,
    Exiter,
    Group,
    Raiser,
    ShouldWork,
    MutableSelfTalk,
    MutableCrossTalk,
    ImmutableSelfTalk,
    ImmutableCrossTalk,
    DelayOnRun,
    AsyncReceiverMutable,
    AsyncReceiverImmutable,
    AssertSpawnReturnsAddress,
    Parent,
    SomeCallback,
    SomeTask,

} from './fixtures/actors';
import { ACTION_STOP } from '../../../lib/actor/template';
import { Case } from '../../../lib/actor/resident/case';
import { Immutable } from '../../../lib/actor/resident/immutable';

describe('resident', () => {

    describe('AbstractResident', () => {

        describe('spawn', () => {

            it('should work', done => {

                let s = system();

                s.spawn({

                    id: 'spawner',
                    create: sys => new Spawner(<TestSystem>sys, () => {

                        assert(s.vm.state.threads['spawner'])
                            .not.equal(undefined);

                        done();

                    })

                });

            });

            it('should return the address', () => {

                let s = system();

                s.spawn({

                    id: 'spawner',
                    create: sys =>
                        new AssertSpawnReturnsAddress(<TestSystem>sys, 'spawner')

                });

            });

            it('should spawn a tree', () => {

                let s = system();

                s.spawn({

                    id: 'a',

                    create: sys => new Spawner(<TestSystem>sys, () => { }),

                    children: [

                        {

                            id: 'aa',

                            create: sys =>
                                new Spawner(<TestSystem>sys, () => { })

                        },

                        {

                            id: 'ab',

                            create: sys =>
                                new Spawner(<TestSystem>sys, () => { }),

                            children: [

                                {

                                    id: 'aba',

                                    create: sys =>
                                        new Spawner(<TestSystem>sys, () => { })

                                }

                            ]

                        },

                        {

                            id: 'ac',

                            create: sys => new Spawner(<TestSystem>sys, () => { }),

                            children: [

                                {

                                    id: 'aca',

                                    create: sys => new Spawner(<TestSystem>sys, () => { })

                                },
                                {

                                    id: 'acb',

                                    create: sys => new Spawner(<TestSystem>sys, () => { })

                                },
                                {

                                    id: 'acc',

                                    create: sys => new Spawner(<TestSystem>sys, () => { })

                                }

                            ]

                        }

                    ]

                });

                assert(s.vm.state.threads['a']).not.undefined();
                assert(s.vm.state.threads['a/aa']).not.undefined();
                assert(s.vm.state.threads['a/ab']).not.undefined();
                assert(s.vm.state.threads['a/ab/aba']).not.undefined();
                assert(s.vm.state.threads['a/ac']).not.undefined();
                assert(s.vm.state.threads['a/ac/aca']).not.undefined();
                assert(s.vm.state.threads['a/ac/acb']).not.undefined();
                assert(s.vm.state.threads['a/ac/acc']).not.undefined();

            });

        });

        it('should start actors that produce a future', done => {

            let s = system();

            s.spawn({

                id: 'a',
                create: sys => new DelayOnRun(<TestSystem>sys, () => {

                    assert(true).true();

                    done();

                })

            });

        });

        describe('kill', () => {

            it('should kill children', done => {

                let s = system();

                s.spawn({

                    id: 'a',

                    create: sys => new Killer(<TestSystem>sys, k => {

                        assert(s.vm.state.threads['a/targets'])
                            .not.equal(undefined);

                        setTimeout(() => k.kill('a/targets'), 0);

                    })

                });

                setTimeout(() => {

                    assert(s.vm.state.threads['a/targets']).equal(undefined);

                    done();

                }, 500);
            })

            it('should kill grand children', done => {

                let steps = 0;

                let s = system()
                    .spawn({

                        id: 'a',
                        create: sys => new Killer(<TestSystem>sys, k => {

                            setTimeout(() => {

                                assert(s.vm.state.threads['a/targets/a'])
                                    .not.equal(undefined);

                                steps++;

                            }, 200);

                            setTimeout(() => {

                                k.kill('a/targets/a');

                                steps++;

                            }, 300);

                        })
                    })

                setTimeout(() => {

                    assert(steps, 'timeout callbacks executed').equal(2);

                    assert(s.vm.state.threads['a/targets/a']).equal(undefined);

                    done();

                }, 400);
            })

        })

        describe('exit', () => {

            it('should work', done => {

                let s = system()
                    .spawn({

                        id: 'a',
                        create: sys => new Exiter(<TestSystem>sys, () => {

                            setTimeout(() =>
                                assert(s.vm.state.threads['a'])
                                    .not.equal(undefined), 100);

                            setTimeout(() => {

                                assert(s.vm.state.threads['a'])
                                    .equal(undefined);

                                done();

                            }, 300);

                        })
                    })
            })
        })

        describe('group', () => {

            it('should assign actors to a group', done => {

                let s = system()
                    .spawn({

                        id: 'a',
                        create: sys => new Group(<TestSystem>sys)
                    })

                setTimeout(() => {

                    assert(s.vm.state.groups['test'])
                        .equate(['a/b', 'a/c', 'a/d']);

                    done();

                }, 200)
            })

        })

        describe('raise', () => {

            it('should trigger exception handling', done => {

                let ok = false;

                let s = system()
                    .spawn({

                        id: 'raiser',

                        trap: e => {

                            assert(e.message).equal('risen');

                            ok = true;

                            return ACTION_STOP;

                        },

                        create: s => new Raiser(<TestSystem>s)

                    });

                setTimeout(() => {

                    assert(ok).true();

                    assert(s.vm.state.threads['raiser']).undefined();

                    done();

                }, 200);
            })
        })

    })

    describe('Mutable', () => {

        describe('#select', () => {

            it('should work', done => {

                system()
                    .spawn({
                        id: 'selector',
                        create: s => new ShouldWork(<TestSystem>s, done)
                    });

            })

            it('should be able to talk to itself', done => {

                system()
                    .spawn({
                        id: 'MutableSelfTalk',
                        create: s => new MutableSelfTalk(<TestSystem>s, done)
                    });

            });

        })

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new MutableCrossTalk(<TestSystem>s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new MutableCrossTalk(<TestSystem>s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverMutable(<TestSystem>sys, done)

            });

        });

    })

    describe('Immutable', () => {

        it('should be able to talk to itself', done => {

            system()
                .spawn({
                    id: 'selector',
                    create: s => new ImmutableSelfTalk(<TestSystem>s, done)
                });

        });

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new ImmutableCrossTalk(<TestSystem>s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new ImmutableCrossTalk(<TestSystem>s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverImmutable(<TestSystem>sys, done)

            });

        });

        it('should allow a child to talk to its parent in the run method',
            done => {

                // This is really about a issue #43

                let sys = system();

                sys.spawn({

                    id: 'parent',

                    create: s => new Parent(<TestSystem>s, () => {

                        assert(count(sys.vm.heap.objects)).equal(0);

                        assert(count(sys.vm.heap.owners)).equal(0);

                        done();

                    })

                });

            });

        it('should not preempt when exiting', done => {

            class TellTellExit extends Immutable<void> {

                constructor(public s: TestSystem) { super(s); }

                run() {

                    this.tell('telltellitcanexit', 'one');
                    this.tell('telltellitcanexit', 'two');
                    this.tell('telltellitcanexit', 'three');
                    this.tell('telltellitcanexit', 'done');
                    this.exit();

                }

            }

            class TellTellItCanExit extends Immutable<string> {

                constructor(
                    public s: TestSystem,
                    public done: (received: string[]) => void) { super(s); }

                received: string[] = [];

                receive() {

                    return [new Case(String, (str: string) => {

                        if (str === 'done')
                            this.done(this.received);
                        else
                            this.received.push(str);

                    })]

                }

            }

            let sys = system();

            sys.spawn({

                id: 'telltellitcanexit',

                create: () => new TellTellItCanExit(sys, received => {

                    setTimeout(() => {

                        assert(received).equate(['one', 'two', 'three']);

                        assert(sys.vm.state.threads['telltellexit']).undefined();

                        done();

                    }, 100);

                })

            });

            sys.spawn({

                id: 'telltellexit',

                create: () => new TellTellExit(sys)

            });

        });

    })

    describe('Callback', () => {

        it('should exit after a successful message', done => {

            let s = system();

            let wasCalled = false;

            let cb = (msg: string) => {

                assert(msg).equal('done');

                wasCalled = true;

            }

            s.spawn({ id: 'cb', create: () => new SomeCallback(s, cb) });

            s.vm.tell('cb', 'done');

            setTimeout(() => {

                assert(wasCalled).true();

                assert(s.vm.state.threads['cb'], 'callback actor').undefined();

                done();

            }, 100);

        });

    });

    describe('Task', () => {

        it('should exit after run', done => {

            let s = system();

            let wasCalled = false;

            let cb = () => { wasCalled = true; }

            s.spawn({ id: 'task', create: () => new SomeTask(s, cb) });

            setTimeout(() => {

                assert(wasCalled).true();
                assert(s.vm.state.threads['task'], 'task actor').undefined();

                done();

            }, 100);

        });

    });
})

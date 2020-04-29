import { assert } from '@quenk/test/lib/assert';

import { system } from './fixtures/system';
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
    AssertSpawnReturnsAddress
} from './fixtures/actors';
import { ACTION_STOP } from '../../../lib/actor/template';

describe('resident', () => {

    describe('AbstractResident', () => {

        describe('spawn', () => {

            it('should work', done => {

                let s = system();

                s.spawn({

                    id: 'spawner',
                    create: sys => new Spawner(sys, () => {

                        assert(s.vm.state.runtimes['spawner'])
                            .not.equal(undefined);

                        done();

                    })

                });

            });

            it('should return the address', () => {

                let s = system();

                s.spawn({

                    id: 'spawner',
                    create: sys => new AssertSpawnReturnsAddress(sys, 'spawner')

                });

            });

            it('should spawn a tree', () => {

                let s = system();

                s.spawn({

                    id: 'a',

                    create: sys => new Spawner(sys, () => { }),

                    children: [

                        {

                            id: 'aa',

                            create: sys => new Spawner(sys, () => { })

                        },

                        {

                            id: 'ab',

                            create: sys => new Spawner(sys, () => { }),

                            children: [

                                {

                                    id: 'aba',

                                    create: sys => new Spawner(sys, () => { })

                                }

                            ]

                        },

                        {

                            id: 'ac',

                            create: sys => new Spawner(sys, () => { }),

                            children: [

                                {

                                    id: 'aca',

                                    create: sys => new Spawner(sys, () => { })

                                },
                                {

                                    id: 'acb',

                                    create: sys => new Spawner(sys, () => { })

                                },
                                {

                                    id: 'acc',

                                    create: sys => new Spawner(sys, () => { })

                                }

                            ]

                        }

                    ]

                });

                assert(s.vm.state.runtimes['a']).not.undefined();
                assert(s.vm.state.runtimes['a/aa']).not.undefined();
                assert(s.vm.state.runtimes['a/ab']).not.undefined();
                assert(s.vm.state.runtimes['a/ab/aba']).not.undefined();
                assert(s.vm.state.runtimes['a/ac']).not.undefined();
                assert(s.vm.state.runtimes['a/ac/aca']).not.undefined();
                assert(s.vm.state.runtimes['a/ac/acb']).not.undefined();
                assert(s.vm.state.runtimes['a/ac/acc']).not.undefined();

            });

        });

        it('should start actors that produce a future', done => {

            let s = system();

            s.spawn({

                id: 'a',
                create: sys => new DelayOnRun(sys, () => {

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
                    create: sys => new Killer(sys, k => {

                        assert(s.vm.state.runtimes['a/targets'])
                            .not.equal(undefined);

                        setTimeout(() => k.kill('a/targets'), 100);

                    })

                });

                setTimeout(() => {

                    assert(s.vm.state.runtimes['a/targets']).equal(undefined);
                    done();

                }, 200);
            })

            it('should kill grand children', done => {

                let s = system()
                    .spawn({

                        id: 'a',
                        create: sys => new Killer(sys, k => {

                            setTimeout(() =>
                                assert(s.vm.state.runtimes['a/targets/a'])
                                    .not.equal(undefined), 200);

                            setTimeout(() => k.kill('a/targets/a'), 300);

                        })
                    })

                setTimeout(() => {

                    assert(s.vm.state.runtimes['a/targets/a']).equal(undefined);
                    done();

                }, 400);
            })

        })

        describe('exit', () => {

            it('should work', done => {

                let s = system()
                    .spawn({

                        id: 'a',
                        create: sys => new Exiter(sys, () => {

                            setTimeout(() =>
                                assert(s.vm.state.runtimes['a'])
                                    .not.equal(undefined), 100);

                            setTimeout(() => {

                                assert(s.vm.state.runtimes['a'])
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
                        create: sys => new Group(sys)
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

                        create: s => new Raiser(s)

                    });

                setTimeout(() => {

                    assert(ok).true();

                    assert(s.vm.state.runtimes['raiser']).undefined();

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
                        create: s => new ShouldWork(s, done)
                    });

            })

            it('should be able to talk to itself', done => {

                system()
                    .spawn({
                        id: 'MutableSelfTalk',
                        create: s => new MutableSelfTalk(s, done)
                    });

            });

        })

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new MutableCrossTalk(s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new MutableCrossTalk(s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverMutable(sys, done)

            });

        });

    })

    describe('Immutable', () => {

        it('should be able to talk to itself', done => {

            system()
                .spawn({
                    id: 'selector',
                    create: s => new ImmutableSelfTalk(s, done)
                });

        });

        it('should be able to cross talk', done => {

            system()
                .spawn({
                    id: 'a',
                    create: s => new ImmutableCrossTalk(s, 'b')
                })
                .spawn({
                    id: 'b',
                    create: s => new ImmutableCrossTalk(s, 'a', done)
                });

        });

        it('should support async receivers', done => {

            let s = system();

            s.spawn({

                id: 'async',
                create: sys => new AsyncReceiverImmutable(sys, done)

            });

        });

    })

})

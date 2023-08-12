import { assert } from '@quenk/test/lib/assert';

import { Future, delay, raise } from '@quenk/noni/lib/control/monad/future';

import { ACTION_IGNORE, ACTION_STOP } from '../../../lib/actor/template';
import { AbstractResident } from '../../../lib/actor/resident';
import { system, TestSystem } from './fixtures/system';
import {
    Spawner,
    Killer,
    Exiter,
    Group,
    Raiser,
    DelayOnRun,
    AssertSpawnReturnsAddress,
} from './fixtures/actors';

describe('resident', () => {

    describe('AbstractResident', () => {

        describe('spawn', () => {

            it('should work', done => {

                let s = system();

                s.spawn({

                    id: 'spawner',

                    create: sys => new Spawner(<TestSystem>sys, () => {

                        assert(s.vm.actors.getThread('spawner').isJust())
                            .true();

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

                assert(s.vm.actors.getThread('a').isJust()).true();;
                assert(s.vm.actors.getThread('a/aa').isJust()).true();
                assert(s.vm.actors.getThread('a/ab').isJust()).true();
                assert(s.vm.actors.getThread('a/ab/aba').isJust()).true();
                assert(s.vm.actors.getThread('a/ac').isJust()).true();
                assert(s.vm.actors.getThread('a/ac/aca').isJust()).true();
                assert(s.vm.actors.getThread('a/ac/acb').isJust()).true();
                assert(s.vm.actors.getThread('a/ac/acc').isJust()).true();

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

                        assert(s.vm.actors.getThread('a/targets').isJust())
                            .true();

                        setTimeout(() => k.kill('a/targets'), 0);

                    })

                });

                setTimeout(() => {

                    assert(s.vm.actors.getThread('a/targets').isNothing()).true();

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

                                assert(s.vm.actors.getThread('a/targets/a').isJust())
                                    .true();

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

                    assert(s.vm.actors.getThread('a/targets/a').isNothing())
                        .true();

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
                                assert(s.vm.actors.getThread('a').isJust())
                                    .true(), 100);

                            setTimeout(() => {

                                assert(s.vm.actors.getThread('a').isNothing())
                                    .true();

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

                    assert(s.vm.groups.get('test').get())
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

                    assert(s.vm.actors.getThread('raiser').isNothing()).true();

                    done();

                }, 200);
            })
        })

        describe('wait', () => {

            it('should work', done => {

                let sys = system();

                let ft = delay(done);

                class Waiter extends AbstractResident {

                    run() {

                        this.wait(ft);

                    }

                }

                sys.spawn({

                    id: 'future',

                    create: () => new Waiter(sys)
                })

            });

            it('should raise errors', done => {

                let sys = system();

                let ft: Future<void> = raise(new Error('bad things'));

                let Actor = class extends AbstractResident {

                    run() {

                        this.wait(ft);

                    }

                }

                sys.spawn({

                    id: 'future',

                    create: () => new Actor(sys),

                    trap: e => {

                        if (e.message === 'bad things')
                            done();
                        else
                            done(e);

                        return ACTION_IGNORE;

                    }
                })

            })

        })

    })

})

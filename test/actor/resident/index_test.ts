import { assert } from '@quenk/test/lib/assert';

import { Future,delay, raise } from '@quenk/noni/lib/control/monad/future';

import { ACTION_IGNORE, ACTION_STOP } from '../../../lib/actor/template';
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
import { Context } from '../../../lib/actor/system/vm/runtime/context';
import { AbstractResident } from '../../../lib/actor/resident';

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

        describe('wait', () => {

            it('should work', done => {

                let sys = system();

                let ft = delay(done);

                let Actor = class extends AbstractResident {

                    init(c: Context) {

                        return c;

                    }

                    run() {

                        this.wait(ft);

                    }

                }

                sys.spawn({

                    id: 'future',

                    create: () => new Actor(sys)
                })

            });

            it('should raise errors', done => {

                let sys = system();

                let ft: Future<void> = raise(new Error('bad things'));

                let Actor = class extends AbstractResident {

                    init(c: Context) {

                        return c;

                    }

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

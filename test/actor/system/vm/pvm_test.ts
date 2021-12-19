import * as op from '../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';
import { tick } from '@quenk/noni/lib/control/timer';
import {
    raise,
    pure,
    toPromise,
    attempt,
    doFuture
} from '@quenk/noni/lib/control/monad/future';

import { PScript } from '../../../../lib/actor/system/vm/script';
import { PVM } from '../../../../lib/actor/system/vm';
import { newInstance } from './fixtures/instance';
import { newThread } from './fixtures/thread';
import { newSystem } from './fixtures/system';
import { newContext } from './fixtures/context';
import { Context } from '../../../../lib/actor/system/vm/runtime/context';
import {
    FLAG_ROUTER,
    FLAG_BUFFERED
} from '../../../../lib/actor/flags';
import {
    ACTION_IGNORE,
    ACTION_RESTART,
    ACTION_RAISE
} from '../../../../lib/actor/template';
import { ADDRESS_SYSTEM } from '../../../../lib/actor/address';
import { Immutable } from '../../../../lib/actor/resident';
import { UnknownInstanceErr } from '../../../../lib/actor/system/vm/runtime/error';

describe('vm', () => {

    describe('PVM', () => {

        describe('exec', () => {

            it('should call exec on Threads', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let thread = newThread(newContext({ actor }));

                vm.state.threads['test'] = thread;

                let args = [0, 0, 0];

                vm.exec(actor, 'sum', args);

                assert(thread.mock.wasCalledWith('exec', ['sum', args])).true();

            });

            it('should not call exec given an unknown instances', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let thread = newThread(newContext({ actor }));

                vm.state.threads['test'] = thread;

                vm.state.threads['test'].context.actor = newInstance();

                try {

                    vm.exec(actor, 'sum', [0, 0, 0]);

                } catch (e) {

                    let msg = new UnknownInstanceErr(actor).message;

                    assert(e.message).equal(msg);

                }

                assert(thread.mock.getCalledList().length === 0).true();

            });

        });

        describe('allocate', () => {

            it('should create new Threads', () => {

                let vm = new PVM(newSystem());

                assert(vm.state.threads['self']).undefined();

                vm.allocate('self', { id: '0', create: newInstance });

                assert(vm.state.threads['self/0']).not.undefined();

            });

            it('should not allow duplicate ids', () => {

                let vm = new PVM(newSystem());

                assert(vm.state.threads['self']).undefined();

                let er1 = vm.allocate('self', { id: '0', create: newInstance });

                assert(er1.isLeft()).false();

                let er2 = vm.allocate('self', { id: '0', create: newInstance });

                assert(er2.isLeft()).true();

            });

            it('should set up routers', () => {

                let vm = new PVM(newSystem());

                let act = newInstance();

                act.mock.setReturnCallback('init', (ctx: Context) => {

                    ctx.flags = ctx.flags | FLAG_ROUTER
                    return ctx;

                });

                assert(vm.state.routers['self']).undefined();

                vm.allocate('', { id: 'self', create: () => act });

                assert(vm.state.routers['self']).not.undefined();

            });

            it('should add to groups', () => {

                let vm = new PVM(newSystem());

                vm.allocate('', { id: 'self', create: newInstance, group: 'foo' });

                assert(vm.state.groups['foo']).not.undefined();

                assert(vm.state.groups['foo']).equate(['self']);

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

                let r = newThread();

                let act = newInstance();

                r.context.actor = act;

                r.context.flags = 0;

                vm.state.threads['to'] = r;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(act.mock.getCalledArgs('accept')).equate(['msg']);

            });

            it('should put messages in mailboxes', () => {

                let vm = new PVM(newSystem());

                let r = newThread();

                let act = newInstance();

                r.context.actor = act;

                r.context.flags = FLAG_BUFFERED;

                vm.state.threads['to'] = r;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(vm.state.threads['to'].context.mailbox)
                    .equate(['msg']);

                assert(act.mock.wasCalled('notify')).true();

            })

            it('should return false if actor not found', () => {

                let vm = new PVM(newSystem());

                assert(vm.sendMessage('to', 'from', 'msg')).false();

            })

        });

        describe('putRoute', () => {

            it('should flag an address as a router', () => {

                let vm = new PVM(newSystem());

                vm.putRoute('self', 'self');

                assert(vm.state.routers).equate({ 'self': 'self' });

            });

        });

        describe('raise', () => {

            it('should use the template\'s trap function', () => {

                let vm = new PVM(newSystem());
                let r = newThread();
                let called = false;

                r.context.actor = newInstance();

                r.context.template.trap = () => {

                    called = true;
                    return ACTION_IGNORE;

                }

                vm.state.threads['self'] = r;

                vm.raise(r.context.actor, new Error('err'));

                assert(called).true();

            });

            it('should escalate by default', () => {

                let vm = new PVM(newSystem());
                let r = newThread();
                let called = false;

                r.context.template.trap = () => {

                    called = true;
                    return ACTION_IGNORE;

                }

                vm.state.threads['self'] = r;
                vm.state.threads['self/0'] = newThread();
                vm.state.threads['self/0'].context.template.trap = undefined;

                vm.raise(vm.state.threads['self/0'].context.actor,
                    new Error('err'));

                assert(called).true();

            });

            it('should restart actors', done => {

                let vm = new PVM(newSystem());
                let act = newInstance();
                let r = newThread();
                let called = false;

                r.context.template.create = () => {

                    called = true;
                    return act

                };

                r.context.template.trap = () => ACTION_RESTART;

                vm.state.threads['self'] = r;
                vm.raise(r.context.actor, new Error('err'));

                setTimeout(() => {

                    assert(called).true();
                    assert(act.mock.wasCalled('start')).true();
                    done();

                }, 100);

            });

            it('should throw if unhandled', () => {

                let vm = new PVM(newSystem());
                let caught = false;

                let r1 = newThread();

                let r2 = newThread();

                let r3 = newThread();

                r3.context.template.trap = () => ACTION_RAISE;
                r2.context.template.trap = () => ACTION_RAISE;
                r1.context.template.trap = () => ACTION_RAISE;

                vm.state.threads['self'] = r1;
                vm.state.threads['self/2'] = r2;
                vm.state.threads['self/2/3'] = r3;

                try {

                    vm.raise(r3.context.actor, new Error('err'));

                } catch (e) {

                    assert(e.message).equal('err');
                    caught = true;

                }

                assert(caught).true();

            });

        });

        describe('kill', () => {

            it('should kill the intended target', () => doFuture(function*() {

                let vm = new PVM(newSystem());
                let r0 = newThread();
                let r1 = newThread();
                let r2 = newThread();

                vm.state.threads['self'] = r0;
                vm.state.threads['self/1'] = r1;
                vm.state.threads['self/2'] = r2;

                yield vm.kill(r0.context.actor, 'self/1');

                yield attempt(() => {

                    assert(vm.state.threads['self']).not.undefined();
                    assert(vm.state.threads['self/1']).undefined();
                    assert(vm.state.threads['self/2']).not.undefined();

                    assert(r0.mock.wasCalled('die')).false();
                    assert(r1.mock.wasCalled('die')).true();
                    assert(r2.mock.wasCalled('die')).false();

                });

                return pure(undefined);

            }));

            it('should kill a group', () => {

                let vm = new PVM(newSystem());

                let self0 = newThread(newContext({ address: 'self/0' }));
                let self1 = newThread(newContext({ address: 'self/1' }));
                let self2 = newThread(newContext({ address: 'self/2' }));

                vm.state.threads['self/0'] = self0;
                vm.state.threads['self/1'] = self1;
                vm.state.threads['self/2'] = self2;

                vm.state.groups['us'] = ['self/0', 'self/1', 'self/2'];

                return toPromise(
                    vm
                        .kill(vm, '$us')
                        .chain(() => attempt(() => {

                            assert(vm.state.threads['self/0']).undefined();
                            assert(vm.state.threads['self/1']).undefined();
                            assert(vm.state.threads['self/2']).undefined();

                            assert(self0.mock.wasCalled('die')).true();
                            assert(self1.mock.wasCalled('die')).true();
                            assert(self2.mock.wasCalled('die')).true();

                        })));

            });

            it('should refuse non-child', () => {

                let thrown = false;

                let escalated = false;

                let vm = new PVM(newSystem());

                vm.state.threads['$'].context.template.trap = () => {

                    escalated = true;

                    return ACTION_IGNORE;

                }


                vm.state.threads['that'] = newThread();

                vm.state.threads['them/0'] = newThread();

                return vm
                    .kill(vm.state.threads['that'].context.actor, 'them/0')
                    .catch(e => attempt(() => {

                        thrown = true;

                        assert(e.message.startsWith('IllegalStopErr'));

                    }))
                    .finally(() =>
                        attempt(() => {

                            assert(vm.state.threads['them/0']).not.undefined();

                            assert(escalated).true();

                            assert(thrown).true();

                        }));

            });

            it('should reject a group with non-child', () => {

                let thrown = false;
                let escalated = false;

                let vm = new PVM(newSystem());

                vm.state.threads['$'].context.template.trap = () => {

                    escalated = true;

                    return ACTION_IGNORE;

                }

                let self = newThread();
                let self0 = newThread();
                let self1 = newThread();
                let self2 = newThread();

                vm.state.threads['self'] = self;
                vm.state.threads['self/0'] = self0;
                vm.state.threads['them/1'] = self1;
                vm.state.threads['self/2'] = self2;

                vm.state.groups['us'] = ['self/0', 'them/1', 'self/2'];

                return toPromise(
                    vm
                        .kill(self.context.actor, '$us')
                        .catch(e => {

                            if (e.message.startsWith('IllegalStopErr')) {

                                thrown = true;
                                return pure(undefined);

                            } else {

                                return raise(e);

                            }

                        })
                        .finally(() => attempt(() => {
                        
                          assert(escalated).true();

                          assert(thrown).true();

                        })))

            });

            it('should not remove the system from state', () => {

                let vm = new PVM(newSystem());

                vm.state.threads['self'] = newThread();

                return toPromise(
                    vm
                        .kill(vm, ADDRESS_SYSTEM)
                        .chain(() => attempt(() => {

                            assert(vm.state.threads['self']).undefined();

                            assert(vm.state.threads[ADDRESS_SYSTEM])
                                .not.undefined();

                        })));

            });

        });

        describe('stop', () => {

            it('should stop all actors', () => doFuture(function*() {

                let vm = new PVM(newSystem());
                let ok = false;

                let self0 = newThread();
                let self1 = newThread();
                let self2 = newThread();

                vm.state.threads['self/0'] = self0;
                vm.state.threads['them/1'] = self1;
                vm.state.threads['self/2'] = self2;

                yield vm.stop();

                yield attempt(() => {

                    assert(self0.mock.wasCalled('die')).true();
                    assert(self1.mock.wasCalled('die')).true();
                    assert(self2.mock.wasCalled('die')).true();

                    assert(vm.state.threads['self/0']).undefined();
                    assert(vm.state.threads['self/1']).undefined();
                    assert(vm.state.threads['self/2']).undefined();

                });

                return pure(undefined);

            }));
        });

        describe('spawn', () => {

            it('should assign random ids', done => {

                let vm = new PVM(newSystem());

                let name = 'actor::1~pvm';

                let onRun = () => {

                    assert(vm.state.threads[name]).not.undefined();

                    done();

                }

                class ChildActor extends Immutable<void> {

                    run() {

                        onRun();

                    }

                }

                assert(vm.state.threads[name]).undefined();

                vm.spawn(vm, s => new ChildActor(s));

            });

        });

    });

});

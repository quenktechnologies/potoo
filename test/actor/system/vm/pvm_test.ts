import * as op from '../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { PScript } from '../../../../lib/actor/system/vm/script';
import { PVM } from '../../../../lib/actor/system/vm';
import { newInstance } from './fixtures/instance';
import { newRuntime } from './fixtures/runtime';
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
import { just, nothing } from '@quenk/noni/lib/data/maybe';

const add2Five = new PScript('add2Five', [[], []], [], [
    op.PUSHUI8 | 0x5,
    op.PUSHUI16 | 0xc000,
    op.ADDUI32
]);

describe('vm', () => {

    describe('PVM', () => {

        describe('exec', () => {

            it('should execute scripts', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let rtime = newRuntime(newContext({ actor }));

                vm.state.runtimes['test'] = rtime;

                vm.exec(actor, add2Five);

                assert(rtime.mock.getCalledList()).equate(['exec']);

            });

            it('should not execute scripts from unknown instances', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let rtime = newRuntime(newContext({ actor }));

                vm.state.runtimes['test'] = rtime;

                vm.state.runtimes['test'].context.actor = newInstance();

                vm.exec(actor, add2Five);

                assert(rtime.mock.getCalledList().length === 0).true();

            });

            it('should queue scripts if running', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let rtime = newRuntime(newContext({ actor }));

                let turn = 0;

                let done = false;

                rtime.mock.setReturnCallback('exec', () => {

                    if (turn === 0) {

                        vm.exec(actor, new PScript('<test>'));

                        assert(vm.runQ.length).equal(1);

                        turn = turn + 1;

                        return nothing();

                    } else {

                        done = true;

                        return just(12);

                    }

                });

                vm.state.runtimes['test'] = rtime;

                vm.exec(actor, new PScript('<test2>'));

                assert(done).true();

            });

            it('should no execute blocked actors', () => {

                let vm = new PVM(newSystem());
                let unblocked = newRuntime();
                let blocked = newRuntime();

                vm.state.runtimes['unblocked'] = unblocked;
                vm.state.runtimes['blocked'] = blocked;
                vm.blocked = ['blocked'];

                vm.exec(blocked.context.actor, new PScript('<test2>'));
                vm.exec(unblocked.context.actor, new PScript('<test2>'));

                assert(blocked.mock.wasCalled('exec')).false();
                assert(unblocked.mock.wasCalled('exec')).true();

            });

        });

        describe('allocate', () => {

            it('should create new Runtimes', () => {

                let vm = new PVM(newSystem());

                assert(vm.state.runtimes['self']).undefined();

                vm.allocate('self', { id: '0', create: newInstance });

                assert(vm.state.runtimes['self/0']).not.undefined();

            });

            it('should not allow duplicate ids', () => {

                let vm = new PVM(newSystem());

                assert(vm.state.runtimes['self']).undefined();

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

        describe('run', () => {

            it('should invoke an actors run method', () => {

                let vm = new PVM(newSystem());

                let act = newInstance();

                let tmpl = { id: 'self', create: () => act };

                assert(vm.allocate('', tmpl).isRight()).true();

                assert(vm.runActor('self').isRight()).true();

                assert(act.mock.wasCalled('start')).true();

            });

        });

        describe('sendMessage', () => {

            it('should pass messages directly to unbuffered actors', () => {

                let vm = new PVM(newSystem());

                let r = newRuntime();

                let act = newInstance();

                r.context.actor = act;

                r.context.flags = 0;

                vm.state.runtimes['to'] = r;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(act.mock.getCalledArgs('accept')).equate(['msg']);

            });

            it('should put messages in mailboxes', () => {

                let vm = new PVM(newSystem());

                let r = newRuntime();

                let act = newInstance();

                r.context.actor = act;

                r.context.flags = FLAG_BUFFERED;

                vm.state.runtimes['to'] = r;

                assert(vm.sendMessage('to', 'from', 'msg')).true();

                assert(vm.state.runtimes['to'].context.mailbox)
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
                let r = newRuntime();
                let called = false;

                r.context.template.trap = () => {

                    called = true;
                    return ACTION_IGNORE;

                }

                vm.state.runtimes['self'] = r;

                vm.raise('self', new Error('err'));

                assert(called).true();

            });

            it('should escalate by default', () => {

                let vm = new PVM(newSystem());
                let r = newRuntime();
                let called = false;

                r.context.template.trap = () => {

                    called = true;
                    return ACTION_IGNORE;

                }

                vm.state.runtimes['self'] = r;
                vm.state.runtimes['self/0'] = newRuntime();
                vm.state.runtimes['self/0'].context.template.trap = undefined;

                vm.raise('self/0', new Error('err'));

                assert(called).true();

            });

            it('should restart actors', () => {

                let vm = new PVM(newSystem());
                let act = newInstance();
                let r = newRuntime();
                let called = false;

                r.context.template.create = () => {

                    called = true;
                    return act

                };

                r.context.template.trap = () => ACTION_RESTART;

                vm.state.runtimes['self'] = r;
                vm.raise('self', new Error('err'));

                assert(called).true();
                assert(act.mock.wasCalled('start')).true();

            });

            it('should throw if unhandled', () => {

                let vm = new PVM(newSystem());
                let caught = false;

                let r1 = newRuntime();

                let r2 = newRuntime();

                let r3 = newRuntime();

                r3.context.template.trap = () => ACTION_RAISE;
                r2.context.template.trap = () => ACTION_RAISE;
                r1.context.template.trap = () => ACTION_RAISE;

                vm.state.runtimes['self'] = r1;
                vm.state.runtimes['self/2'] = r2;
                vm.state.runtimes['self/2/3'] = r3;

                try {

                    vm.raise('self/2/3', new Error('err'));

                } catch (e) {

                    assert(e.message).equal('err');
                    caught = true;

                }

                assert(caught).true();

            });

        });

    });

});

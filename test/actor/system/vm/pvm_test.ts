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

const add2Five = new PScript([[], []], [], [
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

                let rtime = newRuntime('test', newContext({ actor }));

                vm.state.runtimes['test'] = rtime;

                let result = vm.exec(actor, add2Five);

                assert(rtime.mock.getCalledList()).equate([

                    'invokeMain', 'run'

                ]);

            });

            it('should not execute scripts from unknown instances', () => {

                let vm = new PVM(newSystem());

                let actor = newInstance();

                let rtime = newRuntime('test', newContext({ actor }));

                vm.state.runtimes['test'] = rtime;

                vm.state.runtimes['test'].context.actor = newInstance();

                vm.exec(actor, add2Five);

                assert(rtime.mock.getCalledList().length === 0).true();

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

                let act = newInstance();

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

                assert(vm.sendMessage('to', 'msg')).true();

                assert(act.mock.getCalledArgs('accept')).equate(['msg']);

            });

            it('should put messages in mailboxes', () => {

                let vm = new PVM(newSystem());

                let r = newRuntime();

                let act = newInstance();

                r.context.actor = act;

                r.context.flags = FLAG_BUFFERED;

                vm.state.runtimes['to'] = r;

                assert(vm.sendMessage('to', 'msg')).true();

                assert(vm.state.runtimes['to'].context.mailbox)
                    .equate(['msg']);

                assert(act.mock.wasCalled('notify')).true();

            })

            it('should return false if actor not found', () => {

                let vm = new PVM(newSystem());

                assert(vm.sendMessage('to', 'msg')).false();

            })

        });

        describe('putRoute', () => {

            it('should flag an address as a router', () => {

                let vm = new PVM(newSystem());

                vm.putRoute('self', 'self');

                assert(vm.state.routers).equate({ 'self': 'self' });

            });

        });


    });

});

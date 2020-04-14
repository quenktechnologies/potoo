import * as op from '../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { StackFrame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Thread } from '../../../../../lib/actor/system/vm/runtime/thread';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { PScript, INFO_TYPE_FUNCTION } from '../../../../../lib/actor/system/vm/script';
import { newPlatform } from '../fixtures/vm';
import { newContext } from '../fixtures/context';
import { newRuntime } from '../fixtures/runtime';
import { just } from '@quenk/noni/lib/data/maybe';

let foreignFunc = {

    infoType: INFO_TYPE_FUNCTION,

    type: 0,

    builtin: true,

    name: 'func',

    foreign: true,

    argc: 0,

    code: [],

    exec: (n: number) => n * n

}

describe('runtime', () => {

    describe('Thread', () => {

        describe('run', () => {

            it('should execute instructions', () => {

                let frm = new StackFrame('main', new PScript('test'),
                    newContext(), new Heap(), [

                    op.PUSHUI8 | 0x5,
                    op.PUSHUI16 | 0xc000,
                    op.ADDUI32

                ]);

                let p = new Thread(newPlatform(),
                    new Heap(),
                    newContext(),
                    [frm], []);

                let mresult = p.run();

                assert(p.fstack.length).equal(0);
                assert(mresult.isJust()).true();

                //TODO: review need for data type on integers
                assert(mresult.get()).equal(0xc005);

            })

        })

        describe('invokeForeign', () => {

            it('it should call foreign functions', () => {

                let heap = new Heap();

                let frame = new StackFrame(
                    'main',
                    new PScript('test'),
                    newContext(),
                    heap, []);

                let p = new Thread(
                    newPlatform(),
                    heap,
                    newContext(),
                    [], []);

                p.invokeForeign(frame, foreignFunc, [12]);

                assert(heap.get(<number>frame.data.pop()).get().value).equal(144);

            })

        })

        describe('kill', () => {

            it('should kill the intended target', () => {

                let vm = newPlatform();

                let ctx = newContext();

                let p = new Thread(
                    vm,
                    new Heap(),
                    ctx,
                    [], []);

                ctx.address = 'self';

                vm.state.runtimes['self/0'] = newRuntime();

                assert(p.kill('self/0').isRight()).true();

                assert(vm.mock.getCalledArgs('kill')).equate(['self/0']);

            });

            it('should kill a group', () => {

                let vm = newPlatform();
                let ctx = newContext();
                let self0 = newRuntime();
                let self1 = newRuntime();
                let self2 = newRuntime();

                let p = new Thread(
                    vm,
                    new Heap(),
                    ctx,
                    [], []);

                ctx.address = 'self';

                vm.state.runtimes['self/0'] = self0;
                vm.state.runtimes['self/1'] = self1;
                vm.state.runtimes['self/2'] = self2;

                vm.state.groups['us'] = ['self/0', 'self/1', 'self/2'];

                vm.mock.setReturnValue('getGroup', just(vm.state.groups['us']));

                assert(p.kill('$us').isRight()).true();

                assert(vm.mock.wasCalledNTimes('kill', 3)).true();

            });

            it('should refuse non-child', () => {

                let vm = newPlatform();

                let ctx = newContext();

                let p = new Thread(
                    vm,
                    new Heap(),
                    ctx,
                    [], []);

                ctx.address = 'self';

                vm.state.runtimes['them/0'] = newRuntime();

                assert(p.kill('them/0').isLeft()).true();

                assert(vm.mock.wasCalled('kill')).false();

            });

            it('should reject a group with non-child', () => {

                let vm = newPlatform();
                let ctx = newContext();
                let self0 = newRuntime();
                let self1 = newRuntime();
                let self2 = newRuntime();

                let p = new Thread(
                    vm,
                    new Heap(),
                    ctx,
                    [], []);

                ctx.address = 'self';

                vm.state.runtimes['self/0'] = self0;
                vm.state.runtimes['them/1'] = self1;
                vm.state.runtimes['self/2'] = self2;

                vm.state.groups['us'] = ['self/0', 'them/1', 'self/2'];

                assert(p.kill('$us').isLeft()).false();

            });

        });

    })

})

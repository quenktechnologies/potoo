import * as op from '../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';
import { just } from '@quenk/noni/lib/data/maybe';
import { toPromise, attempt } from '@quenk/noni/lib/control/monad/future';

import { NewForeignFunInfo } from '../../../../../lib/actor/system/vm/script/info';
import { StackFrame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Thread } from '../../../../../lib/actor/system/vm/runtime/thread';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { PScript } from '../../../../../lib/actor/system/vm/script';
import { newPlatform } from '../fixtures/vm';
import { newContext } from '../fixtures/context';
import { newRuntime } from '../fixtures/runtime';
import { newInstance } from '../fixtures/instance';

let foreignFunc = new NewForeignFunInfo('func', 0,
    (r: Thread, n: number) => n * n);

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

                assert(frame.data[0]).equal(144);

            })

        })

        describe('kill', () => {

            it('schedule a task', () => {

                let vm = newPlatform();

                let p = new Thread(
                    vm,
                    new Heap(),
                    newContext(),
                    [], []);

                p.kill('self/0');

                assert(vm.mock.wasCalled('runTask')).true();

            });

            describe('die', () => {

                it('should top the actor', () => {

                    let vm = newPlatform();

                    let ctx = newContext();

                    let act = newInstance();

                    ctx.actor = act;

                    let p = new Thread(
                        vm,
                        new Heap(),
                        ctx,
                        [], []);

                    return toPromise(

                        p
                            .die()
                            .chain(() => attempt(() => {

                                assert(act.mock.wasCalled('stop')).true();

                            })));

                });

            });

        });

    })

})

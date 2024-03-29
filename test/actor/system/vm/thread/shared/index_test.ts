import * as op from '../../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';
import { attempt, doFuture, voidPure } from '@quenk/noni/lib/control/monad/future';

import {
    NewFunInfo,
    NewForeignFunInfo
} from '../../../../../../lib/actor/system/vm/script/info';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import { makeFrameName, SharedThread } from '../../../../../../lib/actor/system/vm/thread/shared';
import { SharedScheduler } from '../../../../../../lib/actor/system/vm/thread/shared/scheduler';
import { THREAD_STATE_ERROR } from '../../../../../../lib/actor/system/vm/thread';
import { newPlatform } from '../../fixtures/vm';
import { newContext } from '../../fixtures/context';
import { newInstance } from '../../fixtures/instance';
import { newFrame } from '../../fixtures/frame';

describe('shared', () => {

    describe('SharedThread', () => {

        describe('makeFrameName', () => {

            it('should create the first frame\'s name', () => {

                let vm = newPlatform();

                let script = new PScript('test');

                let ctx = newContext();

                ctx.template.id = "testplate";

                ctx.aid = 1;

                let thread = new SharedThread(vm, script,
                    new SharedScheduler(vm), ctx);

                assert(makeFrameName(thread, 'spin')).equal('testplate@1#spin');
            });

            it('should use the stack for subsequent frame names', () => {

                let vm = newPlatform();

                let script = new PScript('test');

                let ctx = newContext();

                ctx.template.id = "testplate";

                ctx.aid = 1;

                let thread = new SharedThread(vm, script,
                    new SharedScheduler(vm), ctx);

                thread.fstack.push(newFrame('testplate@1#main'));

                assert(makeFrameName(thread, 'second'))
                    .equal('testplate@1#main/second');
            });

        });

        describe('invokeVM', () => {

            it('it should invoke vm functions', () => {

                let vm = newPlatform();

                let script = new PScript('test', undefined, [
                    new NewFunInfo('main', 2, [op.ADDUI32])
                ]);

                let thread = new SharedThread(vm, script,
                    new SharedScheduler(vm), newContext());

                vm.heap.mock.setReturnCallback('intern', (_, val) => val);

                thread.exec('main', [12, 12]);

                assert(thread.rp).equal(24);

            })

        })

        describe('invokeForeign', () => {

            it('it should call foreign functions', () => {

                let vm = newPlatform();

                let wasCalled = false;

                let func = (_: Thread, n: number) => {
                    wasCalled = true;
                    return n * n
                }

                let script = new PScript('test', undefined, [
                    new NewForeignFunInfo('main', 1, func)
                ]);

                let thread = new SharedThread(vm, script,
                    new SharedScheduler(vm), newContext());

                vm.heap.mock.setReturnCallback('intern', (_, val) => val);

                thread.exec('main', [12]);

                assert(wasCalled, 'foreign function called').true();

                assert(thread.rp).equal(144);

            })

        })

        describe('die', () => {

            it('should stop the actor', () => doFuture(function*() {

                let vm = newPlatform();

                let ctx = newContext();

                let act = newInstance();

                ctx.actor = act;

                let thread = new SharedThread(vm, new PScript('main'),
                    new SharedScheduler(vm), ctx);

                yield thread.die();

                yield attempt(() => {

                    assert(act.mock.wasCalled('stop')).true();

                });

                return voidPure;

            }))
        })

        describe('raise', () => {

            it('should set the thread state to THREAD_STATE_ERROR', () => {

                let vm = newPlatform();

                let ctx = newContext();

                let act = newInstance();

                ctx.actor = act;

                let thread = new SharedThread(vm, new PScript('main'),
                    new SharedScheduler(vm), ctx);

                thread.raise(new Error('test'));

                assert(thread.state).equal(THREAD_STATE_ERROR);

            });

        });
    })
})

import * as op from '../../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { nothing } from '@quenk/noni/lib/data/maybe';

import {
    StackFrame
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import {
    SharedThread
} from '../../../../../../lib/actor/system/vm/thread/shared';
import {
    SharedThreadRunner
} from '../../../../../../lib/actor/system/vm/thread/shared/runner';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import {
    ExecutionFrame
} from '../../../../../../lib/actor/system/vm/thread/shared/runner';
import { newPlatform } from '../../fixtures/vm';
import { newContext } from '../../fixtures/context';
import { NewForeignFunInfo } from '../../../../../../lib/actor/system/vm/script/info';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';

describe('runtime', () => {

    describe('Thread', () => {

        describe('run', () => {

            it('should execute instructions', () => {

                let vm = newPlatform();

                let runner = new SharedThreadRunner(vm);

                let thread = new SharedThread(vm, new PScript('main'), runner,
                    newContext());

                let frame = new StackFrame('main', new PScript('main'), thread,
                    nothing(), [

                    op.PUSHUI8 | 0x5,
                    op.PUSHUI16 | 0xc000,
                    op.ADDUI32

                ]);

                runner.enqueue(new ExecutionFrame(thread, [frame]));

                runner.run();

                assert(thread.fstack.length).equal(0);

                assert(thread.rp).equate(0xc005);

            })

            it('should stop execution when the thread raises', () => {

                let vm = newPlatform();

                let ctx = newContext();

                let runner = new SharedThreadRunner(vm);

                let counter = 0;

                let script = new PScript('main', undefined, [

                    new NewForeignFunInfo('main', 0, (thr: Thread) => {

                        counter++;

                        if (counter === 2)
                            thr.raise(new Error('Reached 2'));

                        return counter;

                    })

                ]);

                let thread = new SharedThread(vm, script, runner, ctx);

                let frame = new StackFrame('main', script, thread, nothing(), [

                    op.LDN | 0,
                    op.CALL,
                    op.LDN | 0,
                    op.CALL,
                    op.LDN | 0,
                    op.CALL

                ]);

                runner.enqueue(new ExecutionFrame(thread, [frame]));

                runner.run();

                vm.mock.setReturnCallback('raise', () => undefined);

                assert(vm.mock.wasCalled('raise')).true();

                assert(counter, 'call counter').equal(2);

            })

        })

    })

})

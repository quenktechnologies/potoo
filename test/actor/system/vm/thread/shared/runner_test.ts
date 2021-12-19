import * as op from '../../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { StackFrame } from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import { SharedThread } from '../../../../../../lib/actor/system/vm/thread/shared';
import { SharedThreadRunner } from '../../../../../../lib/actor/system/vm/thread/shared/runner';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import { newPlatform } from '../../fixtures/vm';
import { newContext } from '../../fixtures/context';
import { ExecutionFrame } from '../../../../../../lib/actor/system/vm/thread/shared/runner';

describe('runtime', () => {

    describe('Thread', () => {

        describe('run', () => {

            it('should execute instructions', () => {

                let vm = newPlatform();

                let runner = new SharedThreadRunner(vm);

                let thread = new SharedThread(vm, new PScript('main'), runner,
                    newContext());

                let frame = new StackFrame('main', new PScript('main'), thread, [

                    op.PUSHUI8 | 0x5,
                    op.PUSHUI16 | 0xc000,
                    op.ADDUI32

                ]);

                runner.enqueue(new ExecutionFrame(thread, [frame]));

                runner.run();

                assert(thread.fstack.length).equal(0);

                assert(thread.rp).equate(0xc005);

            })

        })


    })

})

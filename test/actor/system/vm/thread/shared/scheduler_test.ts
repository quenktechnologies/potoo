import * as op from '../../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import {
    SharedThread
} from '../../../../../../lib/actor/system/vm/thread/shared';
import {
    SharedScheduler
} from '../../../../../../lib/actor/system/vm/thread/shared/scheduler';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import {
    Job
} from '../../../../../../lib/actor/system/vm/thread/shared';
import { newPlatform } from '../../fixtures/vm';
import { newContext } from '../../fixtures/context';
import { NewForeignFunInfo, NewFunInfo } from '../../../../../../lib/actor/system/vm/script/info';
import { Thread } from '../../../../../../lib/actor/system/vm/thread';

describe('runtime', () => {

    describe('Thread', () => {

        describe('run', () => {

            it('should execute instructions', () => {

                let vm = newPlatform();

                let runner = new SharedScheduler(vm);

                let thread = new SharedThread(vm, new PScript('main'), runner,
                    newContext());

                let main = new NewFunInfo('main', 0, [

                    op.PUSHUI8 | 0x5,
                    op.PUSHUI16 | 0xc000,
                    op.ADDUI32

                ]);

                runner.postJob(new Job(thread, main, []));

                assert(thread.fstack.length).equal(0);

                assert(thread.rp).equate(0xc005);

            })

            it('should stop execution when the thread raises', () => {

                let vm = newPlatform();

                let ctx = newContext();

                let runner = new SharedScheduler(vm);

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

                let main = new NewFunInfo('main', 0, [

                    op.LDN | 0,
                    op.CALL,
                    op.LDN | 0,
                    op.CALL,
                    op.LDN | 0,
                    op.CALL

                ]);

                runner.postJob(new Job(thread, main));

                vm.mock.setReturnCallback('raise', () => undefined);

                assert(vm.mock.wasCalled('raise')).true();

                assert(counter, 'call counter').equal(2);

            })

        })

    })

})

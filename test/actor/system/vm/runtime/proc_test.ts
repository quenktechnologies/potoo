import * as op from '../../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { StackFrame } from '../../../../../lib/actor/system/vm/runtime/stack/frame';
import { Proc } from '../../../../../lib/actor/system/vm/runtime/proc';
import { Heap } from '../../../../../lib/actor/system/vm/runtime/heap';
import { PScript } from '../../../../../lib/actor/system/vm/script';
import { newPlatform } from '../fixtures/platform';
import { newContext } from '../fixtures/context';

describe('runtime', () => {

    describe('Proc', () => {

        describe('run', () => {

            it('should execute instructions', () => {

                let frm = new StackFrame('main', new PScript(), newContext(),
                    new Heap(), [

                    op.PUSHUI8 | 0x5,
                    op.PUSHUI16 | 0xc000,
                    op.ADDUI32

                ]);

                let p = new Proc(newPlatform(),
                    new Heap(),
                    newContext(),
                    '/',
                    [frm]);

                p.run();

                assert(p.stack.length).equal(0);
                assert(frm.data[0]).equal(0xc005);

            })

        })

    })

})

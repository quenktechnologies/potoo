import * as op from '../../../../lib/actor/system/vm/runtime/op';

import { assert } from '@quenk/test/lib/assert';

import { PScript } from '../../../../lib/actor/system/vm/script';
import { PVM } from '../../../../lib/actor/system/vm';
import { newInstance } from './fixtures/instance';
import { newRuntime } from './fixtures/runtime';
import { newSystem } from './fixtures/system';
import { newContext } from './fixtures/context';

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

    });

});

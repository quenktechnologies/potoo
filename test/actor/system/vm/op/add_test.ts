import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { This } from '../../../../../src/actor/system/vm/runtime/this';
import { Add } from '../../../../../src/actor/system/vm/op/add';

describe('add', () => {

    describe('Add', () => {

        describe('exec', () => {

            it('should add two numbers', () => {

              let f = new Frame('/', newContext(), new Script(), [], [
                    Location.Literal,
                    Type.Number,
                    12,
                    Location.Literal,
                    Type.Number,
                    12
                ]);

              let e = new This('/', new SystemImpl(), [f]);

                new Add().exec(e);

                assert(e.current().get().data).equate([0, 0, 24]);

            });

        });

    })

});

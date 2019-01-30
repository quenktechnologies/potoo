import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Add } from '../../../../../src/actor/system/vm/op/add';

describe('add', () => {

    describe('Add', () => {

        describe('exec', () => {

            it('should add two number', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [                    ], [
                        Location.Literal,
                        Type.Number,
                        12,
                        Location.Literal,
                        Type.Number,
                      12
                    ]));

                new Add().exec(e);

                assert(e.current().get().data).equate([24]);

            });

        });

    })

});

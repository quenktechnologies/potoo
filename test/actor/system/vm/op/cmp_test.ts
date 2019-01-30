import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Cmp } from '../../../../../src/actor/system/vm/op/cmp';

describe('cmp', () => {

    describe('Cmp', () => {

        describe('exec', () => {

            it('should push 1 if equal', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [                    ], [
                        Location.Literal,
                        Type.Number,
                        12,
                        Location.Literal,
                        Type.Number,
                      12
                    ]));

                new Cmp().exec(e);

              assert(e.current().get().data)
                .equate([1,Type.Number,Location.Literal]);

            });

            it('should push zero if not equal', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [                    ], [
                        Location.Literal,
                        Type.Number,
                        12,
                        Location.Literal,
                        Type.Number,
                      10
                    ]));

                new Cmp().exec(e);

              assert(e.current().get().data).equate([
                0,Type.Number,Location.Literal]);

            })

        });

    })

});

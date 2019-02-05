import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { This } from '../../../../../src/actor/system/vm/runtime/this';
import { Cmp } from '../../../../../src/actor/system/vm/op/cmp';

describe('cmp', () => {

    describe('Cmp', () => {

        describe('exec', () => {

            it('should push 1 if equal', () => {

                let f = new Frame('/', newContext(),
                    new Script(), [], [
                        Location.Literal,
                        Type.Number,
                        12,
                        Location.Literal,
                        Type.Number,
                        12
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                new Cmp().exec(e);

                assert(e.current().get().data)
                    .equate([Location.Literal, Type.Number, 1]);

            });

            it('should push zero if not equal', () => {

                let f = new Frame('self', newContext(),
                    new Script(), [], [
                        Location.Literal,
                        Type.Number,
                        12,
                        Location.Literal,
                        Type.Number,
                        10
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                new Cmp().exec(e);

                assert(e.current().get().data).equate([
                    Location.Literal, Type.Number, 0
                ]);

            })

        });

    })

});

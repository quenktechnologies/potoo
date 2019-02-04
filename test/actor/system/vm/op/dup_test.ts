import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Dup } from '../../../../../src/actor/system/vm/op/dup';
import {This} from '../../../../../src/actor/system/vm/runtime/this';

describe('dup', () => {

    describe('Dup', () => {

        describe('exec', () => {

            it('should push a number onto the stack', () => {

              let f =   new Frame('/', newContext(), new Script(), [], [

                        Location.Literal,
                        Type.Number,
                        20

              ]);

              let e = new This('/', new SystemImpl(), [f]);

                new Dup().exec(e);

                assert(e.current().get().data).equate([
                  Location.Literal, 
                  Type.Number,
                  20,
                  Location.Literal,
                  Type.Number,
                    20
                ]);

            });

        });

    });

});

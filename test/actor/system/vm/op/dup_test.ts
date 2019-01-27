import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import {Dup} from '../../../../../src/actor/system/vm/op/dup';

describe('dup', () => {

    describe('Dup', () => {

        describe('exec', () => {

            it('should push a number onto the stack', () => {

              let e = new ExecutorImpl(
                new Frame('self', newContext(), new Script(),[],[

Location.Literal,
                  Type.Number,
                  20
                
                ]));

                new Dup().exec(e);
              assert(e.current.data).equate([
              Location.Literal, Type.Number, 20, Location.Literal, Type.Number,
                20
              
              ]);

            });

        });

    });

});

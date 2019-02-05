import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Store } from '../../../../../src/actor/system/vm/op/store';
import {This} from '../../../../../src/actor/system/vm/runtime/this';

describe('store', () => {

    describe('Store', () => {

        describe('exec', () => {

            it('should create a local entry from the stack', () => {

              let f =                     new Frame('/', newContext(), new Script(), [], [

                      Location.Constants, Type.Template,12

                    ]);

              let e = new This('/', new SystemImpl(), [f]);

                new Store(2).exec(e);

                assert(e.current().get().locals[2]).
                    equate([12, Type.Template, Location.Constants]);

                assert(e.current().get().data.length).be.equal(0);

            });

        });

    });

});

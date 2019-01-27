import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Store } from '../../../../../src/actor/system/vm/op/store';

describe('store', () => {

    describe('Store', () => {

        describe('exec', () => {

            it('should create a local entry from the stack', () => {

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(), [], [

                      Location.Constants, Type.Template,12

                    ]));

                new Store(2).exec(e);

                assert(e.current.locals[2]).
                    equate([12, Type.Template, Location.Constants]);

                assert(e.current.data.length).be.equal(0);

            });

        });

    });

});

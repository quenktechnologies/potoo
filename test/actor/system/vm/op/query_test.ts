import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Query } from '../../../../../src/actor/system/vm/op/query';

describe('query', () => {

    describe('Query', () => {

        describe('exec', () => {

            it('should push 1 if the actor exists', () => {

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script([[],['foo'],[],[],[],[]]),                    [], 
                [Location.Constants, Type.String, 0]));

                e.putContext('foo', newContext());

                new Query().exec(e);

                assert(e.current.data).equate([1, Type.Number, Location.Literal]);

            });

        });

        it('should push 0 if the actor does not exist', () => {

          let e = new ExecutorImpl(new Frame('self', newContext(),
            new Script([[],['foo'],[],[],[],[]]),   [],[
              Location.Constants, Type.String, 0
            ]));

            new Query().exec(e);

            assert(e.current.data).equate([0, Type.Number, Location.Literal]);

        });

    });

});

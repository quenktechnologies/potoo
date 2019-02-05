import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Query } from '../../../../../src/actor/system/vm/op/query';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

describe('query', () => {

    describe('Query', () => {

        describe('exec', () => {

            it('should push 1 if the actor exists', () => {

                let f = new Frame('/', newContext(),
                    new Script([[], ['foo'], [], [], [], []]), [],
                    [Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('foo', newContext());

                new Query().exec(e);

                assert(e.current().get().data)
                    .equate([  Location.Literal, Type.Number, 1]);

            });

        });

        it('should push 0 if the actor does not exist', () => {

            let f = new Frame('/', newContext(),
                new Script([[], ['foo'], [], [], [], []]), [],
                [Location.Constants, Type.String, 0]);

            let e = new This('/', new SystemImpl(), [f]);

            new Query().exec(e);

            assert(e.current().get().data)
                .equate([Location.Literal,Type.Number, 0]);

        });

    });

});

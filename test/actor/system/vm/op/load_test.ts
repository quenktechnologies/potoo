import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Load } from '../../../../../src/actor/system/vm/op/load';

describe('load', () => {

    describe('Load', () => {

        describe('exec', () => {

            it('', () => {

                let e = new ExecutorImpl(
                    new Frame(new Script(), newContext(), [], [], [

                        [12, Type.Template, Location.Constants]

                    ]));

                new Load(0).exec(e);
                assert([e.current.data[0], e.current.data[1], e.current.data[2]]).
                    equate([12, Type.Template, Location.Constants]);

            });

        });

    });

});

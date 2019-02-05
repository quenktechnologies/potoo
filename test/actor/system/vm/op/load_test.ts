import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Load } from '../../../../../src/actor/system/vm/op/load';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

describe('load', () => {

    describe('Load', () => {

        describe('exec', () => {

            it('', () => {

                let f = new Frame('/', newContext(), new Script(), [], [], [

                    [Location.Constants, Type.Template, 12]

                ]);

                let e = new This('/', new SystemImpl(), [f]);

                new Load(0).exec(e);

                assert([
                    e.current().get().data[0],
                    e.current().get().data[1],
                    e.current().get().data[2]
                ]).
                    equate([12, Type.Template, Location.Constants]);

            });

        });

    });

});

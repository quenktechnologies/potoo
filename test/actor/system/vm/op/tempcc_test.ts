import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    Constants,
    Template,
    SystemImpl,
    InstanceImpl,
    newContext
} from '../../../../fixtures/mocks';
import { TempCC } from '../../../../../src/actor/system/vm/op/tempcc';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

const withChilds: Template = {

    id: 'parent',

    create: () => new InstanceImpl(),

    children: [{

        id: 'child0',

        create: () => new InstanceImpl()

    },
    {

        id: 'child1',

        create: () => new InstanceImpl()

    },

    {

        id: 'child2',

        create: () => new InstanceImpl()

    }

    ]

}

describe('tempcc', () => {

    describe('TempCC', () => {

        describe('exec', () => {

            it('should push the child count of a template', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];

                let f = new Frame('/', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                new TempCC().exec(e);

                assert(e.current().get().data)
                    .equate([Location.Literal, Type.Number, 3]);

            });

        });

    });

});

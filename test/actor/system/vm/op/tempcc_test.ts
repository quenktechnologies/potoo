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
    ExecutorImpl,
    SystemImpl,
    InstanceImpl,
    newContext
} from '../../../../fixtures/mocks';
import { TempCC } from '../../../../../src/actor/system/vm/op/tempcc';

const withChilds: Template = {

    id: 'parent',

    create: (_: SystemImpl) => new InstanceImpl(),

    children: [{

        id: 'child0',

        create: (_: SystemImpl) => new InstanceImpl()


    },
    {

        id: 'child1',

        create: (_: SystemImpl) => new InstanceImpl()

    },

    {

        id: 'child2',

        create: (_: SystemImpl) => new InstanceImpl()

    }

    ]

}

describe('tempcc', () => {

    describe('TempCC', () => {

        describe('exec', () => {

            it('should push the child count of a template', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];
                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [],

                        [Location.Constants, Type.Template,0]

                    ));

                new TempCC().exec(e);

                assert(e.current().get().data).equate([3, Type.Number, Location.Literal]);

            });

        });

    });

});

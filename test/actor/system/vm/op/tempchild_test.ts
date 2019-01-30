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
import { TempChild } from '../../../../../src/actor/system/vm/op/tempchild';

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

describe('tempchild', () => {

    describe('TempChild', () => {

        describe('exec', () => {

            it('should put a reference to the child on the stack', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [], [

                        Location.Literal,
                        Type.Number,
                        1,
                        Location.Constants,
                        Type.Template,
                        0

                    ]));

                new TempChild().exec(e);

                assert(e.current().get().data).equate([
                    Location.Heap, Type.Template, 0
                ]);

            });

            it('should raise if the child does not exist', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [], [

                        Location.Literal,
                        Type.Number,
                        122222222222,
                        Location.Constants,
                        Type.Template,
                        0

                    ]));

                new TempChild().exec(e);

                assert(e.MOCK.called()).equate(['current', 'raise']);

            });

        });

    });

});

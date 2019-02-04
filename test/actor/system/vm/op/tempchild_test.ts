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
    RuntimeImpl,
    SystemImpl,
    InstanceImpl,
    newContext
} from '../../../../fixtures/mocks';
import { TempChild } from '../../../../../src/actor/system/vm/op/tempchild';
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

describe('tempchild', () => {

    describe('TempChild', () => {

        describe('exec', () => {

            it('should put a reference to the child on the stack', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];

                let f = new Frame('/', newContext(), new Script(c), [], [
                    Location.Literal,
                    Type.Number,
                    1,
                    Location.Constants,
                    Type.Template,
                    0
                ]);

                let e = new This('/', new SystemImpl(), [f]);

                new TempChild().exec(e);

                assert(e.current().get().data).equate([
                    Location.Heap, Type.Template, 0
                ]);

            });

            it('should raise if the child does not exist', () => {

                let c: Constants = [[], [], [], [withChilds], [], []];

                let thrown = false;

                let ctx = newContext();

                let f = new Frame('/', ctx, new Script(c), [], [

                    Location.Literal,
                    Type.Number,
                    122222222222,
                    Location.Constants,
                    Type.Template,
                    0

                ]);

                let e = new This('/', new SystemImpl(), [f]);

                e.system.state.contexts['/'] = ctx;

                try {

                    new TempChild().exec(e);

                } catch (e) {

                    if (e.message === 'The index ' +
                        '"122222222222" does not exist ' +
                        'in the Template table!')
                        thrown = true;

                }

                assert(thrown).true();

            });

        });

    });

});

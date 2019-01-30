import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    Constants,
    ExecutorImpl,
    SystemImpl,
    InstanceImpl,
    newContext
} from '../../../../fixtures/mocks';
import { Allocate } from '../../../../../src/actor/system/vm/op/allocate';

const withoutChild = {

    id: 'act1',

    create: (_: SystemImpl) => new InstanceImpl(),

}

const badId = {

    id: '/?',

    create: (_: SystemImpl) => new InstanceImpl()
}

describe('allocate', () => {

    describe('Allocate', () => {

        describe('exec', () => {

            it('should put a new context in the system', () => {

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [],

                        [Location.Constants, Type.Template, 0,
                        Location.Constants, Type.String, 0]

                    ));

                new Allocate().exec(e);

                assert(e.contexts['/act1']).be.object();

            });

            it('should not allow duplicates', () => {

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];
                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [],

                        [Location.Constants, Type.Template, 0,
                        Location.Constants, Type.String, 0]

                    ));

                e.contexts['/act1'] = newContext();

                new Allocate().exec(e);

                assert(e.MOCK.called()).equate(['current', 'getContext', 'raise']);

            });

            it('should reject invalid ids', () => {

                let c: Constants = [[], ['/'], [], [badId], [], []];
                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(c), [],

                        [Location.Constants, Type.Template, 0,
                        Location.Constants, Type.String, 0]

                    ));

                e.contexts['/act1'] = newContext();

                new Allocate().exec(e);

                assert(e.MOCK.called()).equate(['current', 'raise']);

            });

        });

        describe('toLog', () => {

            it('should work', () => {

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],

                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]

                );

                assert(new Allocate().toLog(f))
                    .equate(['allocate', [], [
                        [0, Type.String, Location.Constants],
                        [0, Type.Template, Location.Constants]]
                    ]);

            });

        });

    });

});

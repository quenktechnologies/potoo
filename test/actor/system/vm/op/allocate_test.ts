import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    Constants,
    SystemImpl,
    Context,
    InstanceImpl,
    newContext
} from '../../../../fixtures/mocks';
import { This } from '../../../../../src/actor/system/vm/runtime/this';
import { Allocate } from '../../../../../src/actor/system/vm/op/allocate';

const withoutChild = {

    id: 'act1',

    create: () => new InstanceImpl(),

}

const badId = {

    id: '/?',

    create: () => new InstanceImpl()
}

const router = {

    id: 'router',

    create: () => new RouterImpl()

}

const group = {

    id: 'group',

    group: 'mygroup',

    create: () => new InstanceImpl()

}

class RouterImpl extends InstanceImpl {

    init(ctx: Context): Context {

        let c = super.init(ctx);
        c.flags.router = true;

        return c;

    }

}

describe('allocate', () => {

    describe('Allocate', () => {

        describe('exec', () => {

            it('should put a new context in the system', () => {

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                let e = new This('self', new SystemImpl(), [f]);

                new Allocate().exec(e);

                assert(e.system.state.contexts['/act1']).be.object();

            });

            it('should not allow duplicates', () => {

                let thrown = false;

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];

                let f = new Frame('/', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                e.system.state.contexts['/'] = newContext();

                e.system.state.contexts['/act1'] = newContext();

                try {

                    new Allocate().exec(e);

                } catch (e) {

                    if (e.message === 'Duplicate address "/act1" detected!')
                        thrown = true;

                }

                assert(thrown).true();

            });

            it('should reject invalid ids', () => {

                let thrown = false;
                let c: Constants = [[], ['/'], [], [badId], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                let e = new This('self', new SystemImpl(), [f]);

                try {

                    new Allocate().exec(e);

                } catch (e) {

                    thrown = true;

                }

                assert(thrown).true();

            });

            it('should configure routers', () => {

                let c: Constants = [[], ['/'], [], [router], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                let e = new This('self', new SystemImpl(), [f]);

                new Allocate().exec(e);

                assert(e.system.state.contexts['/router']).be.object();
                assert(e.system.state.routers).equate({ '/router': '/router' });

            });

            it('should configure groups', () => {

                let c: Constants = [[], ['/'], [], [group], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                let e = new This('self', new SystemImpl(), [f]);

                new Allocate().exec(e);

                assert(e.system.state.groups['mygroup']).be.array();

                assert(e.system.state.groups).equate({
                    'mygroup': ['/group']
                });

            })

        });

        describe('toLog', () => {

            it('should work', () => {

                let c: Constants = [[], ['/'], [], [withoutChild], [], []];

                let f = new Frame('self', newContext(), new Script(c), [],
                    [Location.Constants, Type.Template, 0,
                    Location.Constants, Type.String, 0]);

                assert(new Allocate().toLog(f))
                    .equate(['allocate', [], [
                        [0, Type.String, Location.Constants],
                        [0, Type.Template, Location.Constants]]
                    ]);

            });

        });

    });

});

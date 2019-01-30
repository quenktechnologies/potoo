import { assert } from '@quenk/test/lib/assert';
import { just } from '@quenk/noni/lib/data/maybe';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import {
    Constants,
    Context,
    InstanceImpl,
    ExecutorImpl
}
    from '../../../../fixtures/mocks';
import { Tell } from '../../../../../src/actor/system/vm/op/tell';

class Msg { stroke = 1 }

const newContext = (): Context => ({

    mailbox: just([]),

    actor: new InstanceImpl(),

    behaviour: [],

    flags: { immutable: true, buffered: true },

    template: { id: 'test', create: () => new InstanceImpl() }

});

describe('tell', () => {

    describe('Tell', () => {

        describe('exec', () => {

            it('should deliver a message', () => {

                let c: Constants = [[], ['foo'], [], [], [new Msg()], []];

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(c),
                    [], [
                        Location.Constants, Type.Message, 0,
                        Location.Constants, Type.String, 0
                    ]));

                e.putContext('foo', newContext());

                new Tell().exec(e);

                assert(
                    e.getContext('foo')
                        .get()
                        .mailbox
                        .get()[0]).equal(c[4][0]);

            });

            it('should use routers', () => {

                let c: Constants = [[], ['/bar/foo/two'], [], [], [new Msg()], []];

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(c),
                    [], [
                        Location.Constants, Type.Message, 0,
                        Location.Constants, Type.String, 0
                    ]));

                e.putContext('/bar/foo', newContext());
                e.routers['/bar'] = '/bar/foo';

                new Tell().exec(e);

                assert(
                    e.getContext('/bar/foo')
                        .get()
                        .mailbox
                        .get()[0].message).equal(c[4][0]);

            });

        });

    });

});

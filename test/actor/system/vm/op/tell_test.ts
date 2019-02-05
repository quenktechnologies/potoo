import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import {
    Constants,
    SystemImpl,
    newContext
}
    from '../../../../fixtures/mocks';
import { Tell } from '../../../../../src/actor/system/vm/op/tell';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

class Msg { stroke = 1 }

describe('tell', () => {

    describe('Tell', () => {

        describe('exec', () => {

            it('should deliver a message', done => {

                let c: Constants = [[], ['foo'], [], [], [new Msg()], []];

                let f = new Frame('/', newContext(),
                    new Script(c),
                    [], [
                        Location.Constants, Type.Message, 0,
                        Location.Constants, Type.String, 0
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('foo', newContext());

                new Tell().exec(e);

                setTimeout(() => {
                    assert(
                        e.getContext('foo')
                            .get()
                            .mailbox
                            .get()[0]).equal(c[4][0]);
                    done();

                }, 100);

            });

            it('should use routers', done => {

                let c: Constants = [[], ['/bar/foo/two'], [], [], [new Msg()], []];

                let f = new Frame('/', newContext(),
                    new Script(c),
                    [], [
                        Location.Constants, Type.Message, 0,
                        Location.Constants, Type.String, 0
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                e.putContext('/bar/foo', newContext());

                e.system.state.routers['/bar'] = '/bar/foo';

                new Tell().exec(e);

              setTimeout(()=> {

                assert(
                    e.getContext('/bar/foo')
                        .get()
                        .mailbox
                  .get()[0].message).equal(c[4][0]);

                done();

              }, 100);

            });

        });

    });

});

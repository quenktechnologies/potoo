import { assert } from '@quenk/test/lib/assert';
import { left, right } from '@quenk/noni/lib/data/either';
import { Constants, Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    SystemImpl,
    newContext
} from '../../../../fixtures/mocks';
import { Receive } from '../../../../../src/actor/system/vm/op/receive';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

const b = (m: string) => {

    return m === 'u' ?
        right(undefined) : left(m);

}

describe('receive', () => {

    describe('Receive', () => {

        describe('exec', () => {

            it('should schedule receives ', () => {

                let c: Constants = [[], [], [], [], [], [b]];

                let f = new Frame('/', newContext(), new Script(c), [], [

                    Location.Constants, Type.Foreign, 0

                ])

                let e = new This('/', new SystemImpl(), [f]);

                e.current().get().context.mailbox.get().push('u', 'are', 'special');

                new Receive().exec(e);

                assert(e.current().get().context.behaviour.length).equal(1);

            })

            it('should notify actors ', () => {

                let c: Constants = [[], [], [], [], [], [b]];

                let f = new Frame('self', newContext(), new Script(c), [], [

                    Location.Constants, Type.Foreign, 0

                ]);

                let e = new This('/', new SystemImpl(), [f]);

                e.current().get().context.mailbox.get().push('u');

                new Receive().exec(e);

                assert((<any>e.current().get().context.actor).MOCK.called())
                    .be.equate(['notify']);

            });

        });

    });

});

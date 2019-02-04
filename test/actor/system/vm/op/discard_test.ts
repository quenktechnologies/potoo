import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {    Frame} from '../../../../../src/actor/system/vm/frame';
import {
    SystemImpl,
    newContext
} from '../../../../fixtures/mocks';
import { Discard } from '../../../../../src/actor/system/vm/op/discard';
import {This} from '../../../../../src/actor/system/vm/runtime/this';

describe('discard', () => {

    describe('Discard', () => {

        describe('exec', () => {

            it('should remove the next message', () => {

              let f =                     new Frame('self', newContext(), new Script());

              let e = new This('/', new SystemImpl(), [f]);

                e.current().get().context.mailbox.get().push(12, 24, 48);

                new Discard().exec(e);

                assert(e.current().get().context.mailbox.get()).equate([24, 48]);

            });

        });

    });

});

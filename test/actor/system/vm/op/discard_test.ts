import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    ExecutorImpl,
    newContext
} from '../../../../fixtures/mocks';
import { Discard } from '../../../../../src/actor/system/vm/op/discard';

describe('discard', () => {

    describe('Discard', () => {

        describe('exec', () => {

            it('should remove the next message', () => {

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script()));

                e.current.context.mailbox.get().push(12, 24, 48);

                new Discard().exec(e);

                assert(e.current.context.mailbox.get()).equate([24, 48]);

            });

        });

    });

});

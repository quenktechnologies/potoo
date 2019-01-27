import { assert } from '@quenk/test/lib/assert';
import { Either, left, right } from '@quenk/noni/lib/data/either';
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
import { Read } from '../../../../../src/actor/system/vm/op/read';

describe('read', () => {

    describe('Read', () => {

        describe('exec', () => {

            it('should consume messages', () => {

                let called = false;

                let b = (m: string): Either<string, void> => {

                    called = true;

                    return m === 'u' ?
                        right(undefined) : left(m);

                }

                let e = new ExecutorImpl(
                    new Frame('self', newContext(), new Script(), [], [

                        Location.Constants, Type.Foreign, 0

                    ]));

                e.current.context.mailbox.get().push('u', 'are', 'special');

                e.current.context.behaviour.push(b);

                new Read().exec(e);

                assert(called).be.true();

                assert(e.current.context.mailbox.get().length).equal(2);

            });

        });

    });

});

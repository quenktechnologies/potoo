import { assert } from '@quenk/test/lib/assert';
import { Either, left, right } from '@quenk/noni/lib/data/either';
import { Script } from '../../../../../src/actor/system/vm/script';
import {
    Type,
    Location,
    Frame
} from '../../../../../src/actor/system/vm/frame';
import {
    SystemImpl,
    newContext
} from '../../../../fixtures/mocks';
import { Read } from '../../../../../src/actor/system/vm/op/read';
import {This} from '../../../../../src/actor/system/vm/runtime/this';

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

              let f =                     new Frame('/', newContext(), new Script(), [], [

                        Location.Constants, Type.Foreign, 0

                    ]);

              let e = new This('/', new SystemImpl(), [f]);

                e.current().get().context.mailbox.get().push('u', 'are', 'special');

                e.current().get().context.behaviour.push(b);

                new Read().exec(e);

                assert(called).be.true();

                assert(e.current().get().context.mailbox.get().length).equal(2);

            });

        });

    });

});

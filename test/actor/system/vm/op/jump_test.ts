import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Log } from '../../../../../src/actor/system/vm/op';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Jump,JumpIfOne } from '../../../../../src/actor/system/vm/op/jump';

class Hit {

    yes = false;

    code = 1000;

    level = 7;

    exec(): void {

        this.yes = true;

    }

    toLog(): Log {

        return ['hit', [], []];

    }

}

describe('jump', () => {

    describe('Jump', () => {

        describe('exec', () => {

            it('should jump', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], []));

                new Jump(1).exec(e);

                assert(e.current().get().ip).equal(1);

            });

            it('should raise if jump is out of bounds', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [                    ], []));

                new Jump(1).exec(e);

                assert(e.MOCK.called()).equate(['current', 'raise']);

            })

        });

    });

    describe('JumpIfOne', () => {

        describe('exec', () => {

            it('should jump if one', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], [
                        Location.Literal,
                        Type.Number,
                        1
                    ]));

                new JumpIfOne(1).exec(e);

                assert(e.current().get().ip).equal(1);

            });

            it('should not jump if not one', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], [
                        Location.Literal,
                        Type.Number,
                        10
                    ]));

                new JumpIfOne(1).exec(e);

                assert(e.current().get().ip).equal(0);

            })

            it('should raise if jump is out of bounds', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                    ], [
                        Location.Literal,
                        Type.Number,
                        1
                    ]));

                new JumpIfOne(1).exec(e);

                assert(e.MOCK.called()).equate(['current', 'raise']);

            })

        });

    })

});

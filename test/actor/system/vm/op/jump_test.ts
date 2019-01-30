import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import {Log} from '../../../../../src/actor/system/vm/op';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { JumpIfZero } from '../../../../../src/actor/system/vm/op/jump';

class Hit {

    yes = false;

    code = 1000;

    level = 7;

    exec(): void {

        this.yes = true;

    }

    toLog() : Log{

        return ['hit', [], []];

    }

}

describe('jump', () => {

    describe('JumpIfZero', () => {

        describe('exec', () => {

            it('should jump if zero', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], [0, Type.Number, Location.Literal]));

                new JumpIfZero(1).exec(e);

                assert(e.current().get().ip).equal(1);

            });

            it('should not jump if not zero', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], [1, Type.Number, Location.Literal]));

                new JumpIfZero(1).exec(e);

                assert(e.current().get().ip).equal(0);

            })

            it('should raise if jump is out of bounds', () => {

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(), [
                    ], [0, Type.Number, Location.Literal]));

                new JumpIfZero(1).exec(e);

                assert(e.MOCK.called()).equate(['current', 'raise']);

            })

        });

    });

});

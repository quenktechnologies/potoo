import { assert } from '@quenk/test/lib/assert';
import { Err } from '@quenk/noni/lib/control/error';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Log } from '../../../../../src/actor/system/vm/op';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { SystemImpl, newContext } from '../../../../fixtures/mocks';
import { Jump, JumpIfOne } from '../../../../../src/actor/system/vm/op/jump';
import { This } from '../../../../../src/actor/system/vm/runtime/this';

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

                let f = new Frame('self', newContext(),
                    new Script(), [
                        one,
                        two,
                        three
                    ], []);

                let e = new This('/', new SystemImpl(), [f]);

                new Jump(1).exec(e);

                assert(e.current().get().ip).equal(1);

            });

            it('should raise if jump is out of bounds', () => {

                let thrown = false;

                let c = newContext();

                let f = new Frame('/', c, new Script(), [], []);

                let e = new This('/', new SystemImpl(), [f]);

                e.system.state.contexts['/'] = c;

                try {

                    new Jump(1).exec(e);

                } catch (e) {

                    if (e.message =
                        'Error: Cannot jump to location "1"! Max location: 0!')
                        thrown = true;

                }

                assert(thrown).true();

            })

        });

    });

    describe('JumpIfOne', () => {

        describe('exec', () => {

            it('should jump if one', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let f = new Frame('self', newContext(), new Script(), [
                    one,
                    two,
                    three
                ], [
                        Location.Literal,
                        Type.Number,
                        1
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                new JumpIfOne(1).exec(e);

                assert(e.current().get().ip).equal(1);

            });

            it('should not jump if not one', () => {

                let one = new Hit();
                let two = new Hit();
                let three = new Hit();

                let f = new Frame('/', newContext(), new Script(), [
                    one,
                    two,
                    three
                ], [
                        Location.Literal,
                        Type.Number,
                        10
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                new JumpIfOne(1).exec(e);

                assert(e.current().get().ip).equal(0);

            })

            it('should raise if jump is out of bounds', () => {

                let thrown = false;

                let c = newContext();

                let f = new Frame('self', c, new Script(), [
                ], [
                        Location.Literal,
                        Type.Number,
                        1
                    ]);

                let e = new This('/', new SystemImpl(), [f]);

                e.system.state.contexts['/'] = c;

                try {

                    new JumpIfOne(1).exec(e);

                } catch (e) {


                    if (e.message =
                        'Error: Cannot jump to location "1"! Max location: 0!')
                        thrown = true;

                }

                assert(thrown).true();

            })

        });

    })

});

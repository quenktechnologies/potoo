import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { Context, Constants, SystemImpl, newContext } from '../../../../fixtures/mocks';
import { This } from '../../../../../src/actor/system/vm/runtime/this';
import { Log } from '../../../../../src/actor/system/vm/op';
import { Call } from '../../../../../src/actor/system/vm/op/call';

class Int {

    code = 1000;

    level = 7;

    exec(): void {


    }

    toLog(): Log {

        return ['int', [], []];

    }

}

describe('call', () => {

    describe('Call', () => {

        describe('exec', () => {

            it('should push a new frame', () => {

                let called = false;

                let func = () => { called = true; return [new Int()]; }

                let c: Constants = [[], [], [func], [], [], []];

                let f = new Frame('/', newContext(), new Script(c), [],
                    [Location.Constants, Type.Function, 0]);

                let e = new This('/', new SystemImpl(), [f]);

                new Call(0).exec(e);

                assert(called).true();

            });

            it('should work with arguments', () => {

                let called = false;

                let func = () => {

                    assert(e.stack[0].data).equate([
                        Location.Literal, Type.Number, 3,
                        Location.Literal, Type.Number, 2,
                        Location.Literal, Type.Number, 1
                    ]);

                    called = true;
                    return [new Int()];

                }

                let c: Constants = [[], [], [func], [], [], []];

                let f = new Frame('/', newContext(),
                    new Script(c), [],
                    [
                        Location.Literal,
                        Type.Number,
                        3,
                        Location.Literal,
                        Type.Number,
                        2,
                        Location.Literal,
                        Type.Number,
                        1,
                        Location.Constants,
                        Type.Function,
                        0
                    ])

                let e = new This('/', new SystemImpl(), [f]);

                new Call(3).exec(e);

                assert(called).true();

            })

        });

        describe('toLog', () => {

            it('should work', () => {

                let c: Constants = [[], [], [() => [new Int()]], [], [], []];

                let f = new Frame('self', newContext(),
                    new Script(c), [],
                    [
                        Location.Literal,
                        Type.Number,
                        3,
                        Location.Literal,
                        Type.Number,
                        2,
                        Location.Literal,
                        Type.Number,
                        1,
                        Location.Constants,
                        Type.Function,
                        0
                    ])

                assert(new Call(3).toLog(f))
                    .equate([
                        'call', [3, Type.Number, Location.Literal],
                        [
                            [0, Type.Function, Location.Constants],
                            [1, Type.Number, Location.Literal],
                            [2, Type.Number, Location.Literal],
                            [3, Type.Number, Location.Literal]
                        ]
                    ]);


            });

        });

    });

});

import { assert } from '@quenk/test/lib/assert';
import { Script } from '../../../../../src/actor/system/vm/script';
import { Frame, Type, Location } from '../../../../../src/actor/system/vm/frame';
import { Constants, ExecutorImpl, newContext } from '../../../../fixtures/mocks';
import { Call } from '../../../../../src/actor/system/vm/op/call';

class Int {

    code = 1000;

    level = 7;

    exec(): void {


    }

    toLog() {

        return 'int';

    }

}

describe('call', () => {

    describe('Call', () => {

        describe('exec', () => {

            it('should push a new frame', () => {

                let c: Constants = [[], [], [() => [new Int()]], [], [], []];

                let e = new ExecutorImpl(new Frame('self', newContext(),
                    new Script(c), [],
                    [Location.Constants, Type.Function, 0]));

                new Call(0).exec(e);

                assert(e.stack.length).equal(2);

            });

            it('should work with arguments', () => {

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
                let e = new ExecutorImpl(f);

                new Call(3).exec(e);

                assert(e.stack.length).equal(2);

                assert(e.stack[0].data).equate([
                    Location.Literal, Type.Number, 3,
                ]);

                assert(e.stack[1].data).equate([
                    Location.Literal, Type.Number, 1,
                    Location.Literal, Type.Number, 2
                ]);

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
                  'call', [3,Type.Number, Location.Literal], 
                  [
                    [0,Type.Function, Location.Constants],
                    [1,Type.Number, Location.Constants],
                    [2,Type.Number, Location.Constants],
                    [3,Type.Number, Location.Constants]
                  ]
                ]);


            });

        });

    });

});

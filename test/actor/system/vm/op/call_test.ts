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

                let c: Constants = [[], [], [() => [new Int()]], [], [],[]];

              let e = new ExecutorImpl(new Frame('self', newContext(),
                new Script(c),  [],
                    [Location.Constants, Type.Function, 0]));

                new Call(0).exec(e);

                assert(e.stack.length).equal(2);

            });

        });

    });

});

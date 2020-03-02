import { assert } from '@quenk/test/lib/assert';

import { Script } from '../../../../../../src/actor/system/vm/runtime/script';
import {
    NullPointerErr
} from '../../../../../../src/actor/system/vm/runtime/error';
import {
    Frame
} from '../../../../../../src/actor/system/vm/runtime/stack/frame';
import {
    Constants,
    newContext
} from '../../../../../fixtures/mocks';


const frame = (c: Constants) =>
    new Frame('self', newContext(), new Script(c));

const newF = () =>
    new Frame('self', newContext(), new Script());

describe('frame', () => {

    describe('Frame', () => {

        describe('push', () => {

            it('should push values onto the stack', () => {

                assert(newF().push(0x10100ff).data).equate([0x10100ff]);

            });

        });

        describe('pushUInt8', () => {

            it('should store properly', () => {

                assert(newF().push(8).data).equate([0x1010008]);

            });

        });

        describe('pushUInt16', () => {

            it('should store properly', () => {

                assert(newF().push(0x8000).data).equate([0x1018000]);

            });

        });

    });

    describe('resolve', () => {

        it('should return immediate values', () => {

            let f = new Frame('self', newContext(), new Script());
            assert(f.resolve(0x1018000).takeRight()).equate(0x8000);

        });

        it('should return values from the constants pool', () => {

            let c: Constants = [[], ['hello'], [], [], [], []];
            let f = frame(c);

            assert(f.resolve(0xf020000).takeRight()).equate('hello');

        });

        it('should resolve locals', () => {

            /*
              let c: Constants = [
                  [], ['hello', 'world'], [], [], [], []
              ];
  
              let f = new Frame('self', newContext(), new Script(c), [], [
                  1, Type.String, Location.Local
              ]);
  
              assert(f.resolve([1, Type.String, Location.Constants]).takeRight())
                  .equal('world');*/

        });

        it('should resolve from the heap', () => {

            /*
              let f = new Frame('self', newContext(), new Script(), [], [], [], [
                  Date
              ]);
  
              assert(f.resolve([0, Type.Message, Location.Heap]).takeRight())
                  .equal(Date);*/

        });

        it('should return an error if the reference does not exist', () => {

            let f = new Frame('self', newContext(), new Script());
            assert(f.resolve(0x1).takeLeft()).be.instance.of(NullPointerErr);

        });

    });

});

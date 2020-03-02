import { assert } from '@quenk/test/lib/assert';

import { Script } from '../../../../../../src/actor/system/vm/script';
import {
    NullPointerErr
} from '../../../../../../src/actor/system/vm/runtime/error';
import {
    Frame,
    DATA_TYPE_STRING,
    DATA_LOCATION_CONSTANTS,
    DATA_TYPE_UINT8,
    DATA_LOCATION_IMMEDIATE,
    DATA_TYPE_UINT16,
    DATA_TYPE_TEMPLATE,
    DATA_TYPE_MESSAGE
} from '../../../../../../src/actor/system/vm/runtime/stack/frame';
import {
    Constants,
    newContext
} from '../../../../../fixtures/mocks';

const newF = (c: Constants = [[], [], [], []]) =>
    new Frame('self', newContext(), new Script(c));

describe('frame', () => {

    describe('Frame', () => {

        describe('push', () => {

            it('should push values onto the stack', () => {

                assert(newF().push(0x10100ff).data).equate([0x10100ff]);

            });

        });

        describe('pushUInt8', () => {

            it('should store properly', () => {

                let addr = 8 | DATA_TYPE_UINT8 | DATA_LOCATION_IMMEDIATE;

                assert(newF().pushUInt8(8).data).equate([addr]);

            });

        });

        describe('pushUInt16', () => {

            it('should store properly', () => {

                let addr = 0x8000 | DATA_TYPE_UINT16 | DATA_LOCATION_IMMEDIATE;

                assert(newF().pushUInt16(0x8000).data).equate([addr]);

            });

        });

        describe('pushString', () => {

            it('should store properly', () => {

                let addr = 1 | DATA_TYPE_STRING | DATA_LOCATION_CONSTANTS;

                assert(newF().pushString(1).data).equate([addr]);

            });

        })

        describe('pushTemplate', () => {

            it('should store properly', () => {

                let addr = 1 | DATA_TYPE_TEMPLATE | DATA_LOCATION_CONSTANTS;

                assert(newF().pushTemplate(1).data).equate([addr]);

            });

        })

        describe('pushMessage', () => {

            it('should store properly', () => {

                let addr = 1 | DATA_TYPE_MESSAGE | DATA_LOCATION_CONSTANTS;

                assert(newF().pushMessage(1).data).equate([addr]);

            });

        })

        describe('resolve', () => {

            it('should return immediate values', () => {

                let f = new Frame('self', newContext(), new Script());
                assert(f.resolve(0x1018000).takeRight()).equate(0x8000);

            });

            it('should return values from the constants pool', () => {

                let c: Constants =
                    [[], ['hello'], [<any>{}], [{ v: 12 }]];

                let f = newF(c);

                let uint8 = 1 | DATA_TYPE_UINT8 | DATA_LOCATION_IMMEDIATE;
                let uint16 = 0x8000 | DATA_TYPE_UINT16 | DATA_LOCATION_IMMEDIATE;
                let str = 0 | DATA_TYPE_STRING | DATA_LOCATION_CONSTANTS;
                let tmpl = 0 | DATA_TYPE_TEMPLATE | DATA_LOCATION_CONSTANTS;
                let msg = 0 | DATA_TYPE_MESSAGE | DATA_LOCATION_CONSTANTS;

                assert(f.resolve(uint8).takeRight()).equal(1);
                assert(f.resolve(uint16).takeRight()).equal(0x8000);
                assert(f.resolve(str).takeRight()).equal(c[1][0]);
                assert(f.resolve(tmpl).takeRight()).equal(c[2][0]);
                assert(f.resolve(msg).takeRight()).equal(c[3][0]);

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

            })

        })

    })

})

import { assert } from '@quenk/test/lib/assert';

import {
    Frame
} from '../../../../../../src/actor/system/vm/runtime/stack/frame';
import {
    newContext
} from '../../../../../fixtures/context';
import { Heap } from '../../../../../../lib/actor/system/vm/runtime/heap';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import { Constants } from '../../../../../../src/actor/system/vm/script';

const newF = (c: Constants = [[], []]) =>
    new Frame('main', new PScript(c), newContext(), new Heap());

describe('frame', () => {

    describe('Frame', () => {

        describe('push', () => {

            it('should push values onto the stack', () => {

                assert(newF().push(0x10100ff).data).equate([0x10100ff]);

            });

        });
        /*
                xdescribe('pushUInt8', () => {
        
                    it('should store properly', () => {
        
                        let addr = 8 | DATA_TYPE_UINT8;
        
                        assert(newF().pushUInt8(8).data).equate([addr]);
        
                    });
        
                });
        
                xdescribe('pushUInt16', () => {
        
                    it('should store properly', () => {
        
                        let addr = 0x8000 | DATA_TYPE_UINT16;
        
                        assert(newF().pushUInt16(0x8000).data).equate([addr]);
        
                    });
        
                });
        
                xdescribe('pushString', () => {
        
                    it('should store properly', () => {
        
                        let addr = 1 | DATA_TYPE_STRING;
        
                        assert(newF().pushString(1).data).equate([addr]);
        
                    });
        
                })
        
                describe('pushMessage', () => {
        
                    it('should store properly', () => {
        
                        let addr = 0 | DATA_TYPE_MESSAGE;
        
                        assert(newF().pushMessage().data).equate([addr]);
        
                    });
        
                })
        
                xdescribe('resolve', () => {
        
                    it('should return immediate values', () => {
        
                        let f = new Frame('self', newContext(), new Script());
                        assert(f.resolve(0x1018000).takeRight()).equate(0x8000);
        
                    });
        */
        it('should return values from the constants pool', () => {

            /*              let c: Constants =
                              [[], ['hello']];
          
                          let f = newF(c);
          
                          let uint8 = 1 | DATA_TYPE_UINT8;
                          let uint16 = 0x8000 | DATA_TYPE_UINT16;
                          let str = 0 | DATA_TYPE_STRING;
                          let msg = 0 | DATA_TYPE_MESSAGE;
          
                          assert(f.resolve(uint8).takeRight()).equal(1);
                          assert(f.resolve(uint16).takeRight()).equal(0x8000);
                          assert(f.resolve(str).takeRight()).equal(c[1][0]);*/

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

            /*              let f = new Frame('self', newContext(), new Script());
                          assert(f.resolve(0x1).takeLeft()).be.instance.of(NullPointerErr);
          */
        })

    })

})

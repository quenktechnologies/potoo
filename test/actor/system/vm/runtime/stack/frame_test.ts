import { assert } from '@quenk/test/lib/assert';

import {
    DATA_TYPE_STRING,
    Frame,
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
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

            xit('should chop down integers > 2^32', () => {

                let data = Number.MAX_SAFE_INTEGER;

                assert(newF().push(data).data).equate([0xffffffff]);

            });

        });

        describe('pushUInt8', () => {

            it('should store properly', () => {

                let op = 8;

                assert(newF().pushUInt8(op).data).equate([op]);

            });

            xit('should force values to be unsigned', () => {

                let data = 0x80000000;

                assert(newF().push(data).data).equate([data]);

            });

            it('should zero out un-needed bits', () => {

                let value = 0x41100026;
                let op = 38;

                assert(newF().pushUInt8(value).data[0]).equal(op);

            });

        });

        describe('pushUInt16', () => {

            it('should store properly', () => {

                let addr = 0x8000;

                assert(newF().pushUInt16(addr).data).equate([addr]);

            });

        });

        describe('pushUInt32', () => {

            it('should store properly', () => {

                let op = 0x7fffffff;

                assert(newF().pushUInt32(op).data).equate([op]);

            });

            it('should only push 32 bit numbers', () => {

                let op = 0xffffffff;
                let op2 = 0x8300404002000100;

                assert(newF().pushUInt32(op).data).equate([0xffffffff]);
                assert(newF().pushUInt32(op2).data).equate([0x2000000]);

            });

        });

        describe('pushString', () => {

            it('should store properly', () => {

                let addr = 1 | DATA_TYPE_STRING;

                assert(newF().pushString(1).data).equate([addr]);

            });

        })


    })

})

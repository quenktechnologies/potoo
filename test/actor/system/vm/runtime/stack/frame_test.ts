import { assert } from '@quenk/test/lib/assert';

import {
    DATA_TYPE_STRING,
    StackFrame
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import {
    newContext
} from '../../fixtures/context';
import { Heap } from '../../../../../../lib/actor/system/vm/runtime/heap';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import { Constants } from '../../../../../../src/actor/system/vm/script';
import {
    Info,
    stringType
} from '../../../../../../lib/actor/system/vm/script/info';
import {
    DATA_TYPE_INFO
} from '../../../../../../src/actor/system/vm/runtime/stack/frame';
import { newHeapObject } from '../heap/fixtures/object';

const newF = (c: Constants = [[], []], i: Info[] = []) =>
    new StackFrame('main', new PScript('test', c, i), newContext(), new Heap());

describe('frame', () => {

    describe('StackFrame', () => {

        describe('push', () => {

            it('should push values onto the stack', () => {

                assert(newF().push(0x10100ff).data).equate([0x10100ff]);

            });

        });

        describe('pushUInt8', () => {

            it('should store properly', () => {

                let op = 8;

                assert(newF().pushUInt8(op).data).equate([op]);

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

        describe('popString', () => {

            it('should resolve strings from the constants pool', () => {

                let f = newF([[], ['hello', 'world']]);

                f.push(DATA_TYPE_STRING | 1);

                let eres = f.popString()

                assert(eres.isRight()).true();

                assert(eres.takeRight()).equal('world');

            });

            it('should resolve heap strings', () => {

                let heap = new Heap();

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), heap);

                heap.addString('foo');

                let r = heap.addString('bar');

                f.push(r);

                let eres = f.popString();

                assert(eres.isRight()).true();
                assert(eres.takeRight()).equal('bar');

            });

        })

        describe('popName', () => {

            it('should resolve named constants', () => {

                let foo = { name: 'foo', type: stringType, descriptor: 0 }
                let bar = { name: 'bar', type: stringType, descriptor: 0 }

                let f = newF([[], []], [foo, bar]);

                f.push(DATA_TYPE_INFO | 1);

                let eres = f.popName();

                assert(eres.isRight()).true();

                assert(eres.takeRight()).equal(bar);

            });

        })

        describe('popObject', () => {

            it('should resolve heap objects', () => {

                let heap = new Heap();

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), heap);

                let foo = newHeapObject();
                let bar = newHeapObject();

                heap.addObject(foo);

                let r = heap.addObject(bar);

                f.push(r);

                let eres = f.popObject();

                assert(eres.isRight()).true();
                assert(eres.takeRight()).equal(bar);

            });

        });

        describe('popValue', function() {

            it('should be left if the there is nothing on the stack ', () => {

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), new Heap());

                assert(f.popValue().isLeft()).true();

            });

        });

        describe('seek', () => {

            it('should change the ip', () => {

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), new Heap());

                f.seek(12);

                assert(f.ip).equal(12);

            });

        });

    })

})

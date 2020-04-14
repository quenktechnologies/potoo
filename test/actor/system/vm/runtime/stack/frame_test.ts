import { assert } from '@quenk/test/lib/assert';

import {
    DATA_TYPE_STRING,
    StackFrame,
    DATA_TYPE_HEAP,
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';
import {
    newContext
} from '../../fixtures/context';
import { Heap, HeapEntry } from '../../../../../../lib/actor/system/vm/runtime/heap';
import { PScript } from '../../../../../../lib/actor/system/vm/script';
import { Constants } from '../../../../../../src/actor/system/vm/script';
import { Info, PVMValueInfo } from '../../../../../../lib/actor/system/vm/script/info';
import { TYPE_STRING, TYPE_OBJECT } from '../../../../../../src/actor/system/vm/script/info';
import { DATA_TYPE_INFO, DATA_TYPE_HEAP_STRING } from '../../../../../../src/actor/system/vm/runtime/stack/frame';

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

        describe('resolve', () => {

            it('should resolve strings from the constants pool', () => {

                let f = newF([[], ['hello', 'world']]);

                let eres = f.resolve(DATA_TYPE_STRING | 1);

                assert(eres.isRight()).true();

                assert(eres.takeRight()).equal('world');

            });

            it('should resolve strings from the constants pool', () => {

                let foo = new PVMValueInfo('foo', TYPE_STRING, false, []);
                let bar = new PVMValueInfo('bar', TYPE_STRING, false, []);

                let f = newF([[], []], [foo, bar]);

                let eres = f.resolve(DATA_TYPE_INFO | 1);

                assert(eres.isRight()).true();

                assert(eres.takeRight()).equal(bar);

            });

            it('should resolve heap objects', () => {

                let heap = new Heap();

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), heap);

                let foo = { a: 1 };
                let bar = { b: 2 };

                heap.add(new HeapEntry(TYPE_OBJECT, true, foo));
                heap.add(new HeapEntry(TYPE_OBJECT, true, bar));

                let eres = f.resolve(DATA_TYPE_HEAP | 1);

                assert(eres.isRight()).true();
                assert(eres.takeRight()).equal(bar);

            });

            it('should resolve heap strings', () => {

                let heap = new Heap();

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), heap);

                heap.addString('foo');
                heap.addString('bar');

                let eres = f.resolve(DATA_TYPE_HEAP_STRING | 1);

                assert(eres.isRight()).true();
                assert(eres.takeRight()).equal('bar');

            });

        });

        describe('popValue', function() {

            it('should be left if the there is nothing on the stack ', () => {

                let f = new StackFrame('main', new PScript('test'),
                    newContext(), new Heap());

                assert(f.popValue().isLeft()).true();

            });

        });

    })

})

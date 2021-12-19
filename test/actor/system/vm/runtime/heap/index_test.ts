import { assert } from '@quenk/test/lib/assert';

import { VMHeap } from '../../../../../../lib/actor/system/vm/runtime/heap';
import { newHeapObject } from './fixtures/object';
import {
    DATA_TYPE_HEAP_OBJECT
} from '../../../../../../lib/actor/system/vm/runtime/stack/frame';

describe('heap', () => {

    describe('VMHeap', () => {

        describe('addObject', () => {

            it('should add objects to the pool', () => {

                let heap = new VMHeap();

                let o = newHeapObject();

                heap.addObject(o);

                assert(heap.objects[0]).equal(o);

            })

        })

        describe('addString', () => {

            it('should add strings to the pool', () => {

                let heap = new VMHeap();

                heap.addString('foo');

                assert(heap.strings[0]).equal('foo');

            });

            it('should not duplicate', () => {

                let heap = new VMHeap();

                heap.addString('foo');
                heap.addString('foo');

                assert(heap.strings.length).equal(1);

            });

        });

        describe('getObject', () => {

            it('should retrieve a value from a reference', () => {

                let o = newHeapObject();

                let heap = new VMHeap();

                let ref = heap.addObject(o);

                assert(heap.getObject(ref).get()).equal(o);

            });

        })

        describe('getString', () => {

            it('should retrieve a string from a reference', () => {

                let heap = new VMHeap();

                let ref = heap.addString('foo');

                assert(heap.getString(ref)).equal('foo');

            });

        })

        describe('getAddress', () => {

            it('should intern strings automatically', () => {

                let heap = new VMHeap();

                let str = 'ibis';

                assert(heap.getAddress(str)).not.equal(0);

                assert(heap.strings[0]).equal(str);

            });

            it('should provide references for objects', () => {

                let heap = new VMHeap();

                let obj = newHeapObject();

                heap.objects[1] = obj;

                assert(heap.getAddress(obj)).equal(DATA_TYPE_HEAP_OBJECT | 1);

            });

            it('should return numeric values', () => {

                let heap = new VMHeap();

                let n = 22;

                assert(heap.getAddress(n)).equal(n);

            });

            it('should not rely on HeapObject#toAddress', () => {

                let heap = new VMHeap();

                let obj = newHeapObject();

                heap.getAddress(obj);

                assert(obj.mock.wasCalled('toAddress')).false();

            });

        });

        describe('exists', () => {

            it('should tell if an object is on the heap', () => {

                let heap = new VMHeap();

                let o = newHeapObject();

                heap.addObject(o);

                assert(heap.exists(o)).true();
                assert(heap.exists(newHeapObject())).false();

            });

        });

    })

});

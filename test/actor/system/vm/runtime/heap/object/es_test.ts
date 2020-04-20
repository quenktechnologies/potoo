import { assert } from '@quenk/test/lib/assert';
import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';

import {
    NewTypeInfo,
    uint8Type,
    booleanType,
    stringType,
    NewArrayTypeInfo
} from '../../../../../../../lib/actor/system/vm/script/info';
import {
    ESObject,
    ESArray
} from '../../../../../../../lib/actor/system/vm/runtime/heap/object/es';
import { newHeap } from '../../../fixtures/heap';

const typeInfo = new NewTypeInfo('JSO', 0, [

    { name: 'a', type: uint8Type },

    { name: 'b', type: booleanType },

    { name: 'c', type: stringType },

    { name: 'd', type: new NewArrayTypeInfo('JSA', uint8Type) },

    {
        name: 'e', type: new NewTypeInfo('JSO2', 0, [

            { name: 'a', type: uint8Type }

        ])

    }

]);

describe('es', () => {

    describe('ESObject', () => {

        describe('set', () => {

            it('should store values on the object', () => {

                let o: Record<Type> = {};

                let ho = new ESObject(newHeap(), typeInfo, o);

                ho.set(0, 12);

                assert(o['a']).equate(12);

            });

            it('should not store unknown properties', () => {

                let ho = new ESObject(newHeap(), typeInfo, {});

                ho.set(144, 12);

                assert(ho.value).equate({});

            });

        });

        describe('get', () => {

            it('should provide values', () => {

                let ho = new ESObject(newHeap(), typeInfo, { a: 12 });

                let mval = ho.get(0);

                assert(mval.isJust()).true();

                assert(mval.get()).equal(12);

            });

            it('should cast booleans', () => {

                let ho = new ESObject(newHeap(), typeInfo, { b: true });

                let mval = ho.get(1);

                assert(mval.isJust()).true();

                assert(mval.get()).equal(1);

            });

            it('should add strings to heap automatically', () => {

                let heap = newHeap();

                let ho = new ESObject(heap, typeInfo, { c: 'foo' });

                let mval = ho.get(2);

                assert(mval.isJust()).true();

                assert(mval.get()).equal('foo');

                assert(heap.mock.wasCalled('addString')).true();

            });

            it('should dynamically create arrays', () => {

                let heap = newHeap();

                let ho = new ESObject(heap, typeInfo, { d: [1, 2, 3] });

                let mval = ho.get(3);

                assert(mval.isJust()).true();

                let val = <ESArray>mval.get();

                assert(val.value).equate([1, 2, 3]);

                assert(heap.mock.wasCalled('addObject')).true();

            });

            it('should dynamically create objects', () => {

                let heap = newHeap();

                let ho = new ESObject(heap, typeInfo, { e: { a: 1 } });

                let mval = ho.get(4);

                assert(mval.isJust()).true();

                let val = <ESObject>mval.get();

                assert(val.value).equate({ a: 1 });

                assert(heap.mock.wasCalled('addObject')).true();

            });


            it('should not provide unknown property values', () => {

                let ho = new ESObject(newHeap(), typeInfo, { c: 'foo' });

                let mval = ho.get(12);

                assert(mval.isJust()).false();

            });

        });

        describe('getCount', () => {

            it('should provide the count of items of the underlying value',
                () => {

                    let ho = new ESObject(newHeap(), typeInfo, { a: 1, c: 'foo' });

                    assert(ho.getCount()).equal(2);

                });

        });

        describe('promote', () => {

            it('should provide the underlying value', () => {

                let ho = new ESObject(newHeap(), typeInfo, { a: 1, c: 'foo' });

                assert(ho.promote()).equate({ a: 1, c: 'foo' });

            });

        });

        describe('toAddress', () => {

            it('should provide a heap reference', () => {

                let heap = newHeap();

                heap.mock.setReturnValue('getAddress', 12);

                let ho = new ESObject(heap, typeInfo, {});

                assert(ho.toAddress()).equate(12);

            });

        });

    });

    describe('ESArray', () => {

        describe('set', () => {

            it('should store values on the array', () => {

                let a: number[] = [];

                let ha = new ESArray(newHeap(),
                    new NewArrayTypeInfo('JSA', uint8Type), a);

                ha.set(0, 12);

                assert(a[0]).equate(12);

            });

        });

        describe('get', () => {

            it('should provide values', () => {

                let ha = new ESArray(newHeap(),
                    new NewArrayTypeInfo('JSA', uint8Type), [12]);

                let mval = ha.get(0);

                assert(mval.isJust()).true();

                assert(mval.get()).equal(12);

            });

            it('should cast booleans', () => {

                let ha = new ESArray(newHeap(),
                    new NewArrayTypeInfo('JSA', booleanType), [true]);

                let mval = ha.get(0);

                assert(mval.isJust()).true();

                assert(mval.get()).equal(1);

            });

            it('should add strings to heap automatically', () => {

                let heap = newHeap();

                let ha = new ESArray(heap,
                    new NewArrayTypeInfo('JSA', stringType), ['foo']);

                let mval = ha.get(0);

                assert(mval.isJust()).true();

                assert(mval.get()).equal('foo');

                assert(heap.mock.wasCalled('addString')).true();

            });

            it('should dynamically create arrays', () => {

                let heap = newHeap();

                let ha = new ESArray(heap, new NewArrayTypeInfo('JSA',
                    new NewArrayTypeInfo('JSA', stringType)), [['foo']]);

                let mval = ha.get(0);

                assert(mval.isJust()).true();

                let val = <ESArray>mval.get();

                assert(val.value).equate(['foo']);

                assert(heap.mock.wasCalled('addObject')).true();

            });

            it('should dynamically create objects', () => {

                let heap = newHeap();

                let ha = new ESArray(heap,
                    new NewArrayTypeInfo('JSA', typeInfo), [{ a: 1 }]);

                let mval = ha.get(0);

                assert(mval.isJust()).true();

                let val = <ESObject>mval.get();

                assert(val.value).equate({ a: 1 });

                assert(heap.mock.wasCalled('addObject')).true();

            });


            it('should not provide unknown property values', () => {

                let ha = new ESArray(newHeap(),
                    new NewArrayTypeInfo('JSA', typeInfo), []);

                let mval = ha.get(12);

                assert(mval.isJust()).false();

            });

        });

        describe('getCount', () => {

            it('should provide the count of items of the underlying value',
                () => {

                    let ha = new ESArray(newHeap(),
                        new NewArrayTypeInfo('JSA', uint8Type), [1, 2, 3]);

                    assert(ha.getCount()).equal(3);

                });

        });

        describe('promote', () => {

            it('should provide the underlying value', () => {

                let ha = new ESArray(newHeap(),
                    new NewArrayTypeInfo('JSA', uint8Type), [1, 2, 3]);

                assert(ha.promote()).equate([1, 2, 3]);

            });

        });

        describe('toAddress', () => {

            it('should provide a heap reference', () => {

                let heap = newHeap();

                heap.mock.setReturnValue('getAddress', 12);

                let ha = new ESArray(heap,
                    new NewArrayTypeInfo('JSA', uint8Type), []);

                assert(ha.toAddress()).equate(12);

            });

        });

    });

});

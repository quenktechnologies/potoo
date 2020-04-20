import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
import { TypeInfo, ArrayTypeInfo } from '../../../script/info';
import { PTValue } from '../../../type';
import { Heap, HeapAddress } from '../';
import { HeapObject } from './';
/**
 * ESObject is a HeapObject for ECMAScript objects.
 */
export declare class ESObject implements HeapObject {
    heap: Heap;
    cons: TypeInfo;
    value: Record<Type>;
    constructor(heap: Heap, cons: TypeInfo, value: Record<Type>);
    set(idx: number, value: PTValue): void;
    get(idx: number): Maybe<PTValue>;
    getCount(): number;
    toAddress(): HeapAddress;
    promote(): Record<any>;
}
/**
 * ESArray is a HeapObject for ECMAScript arrays.
 */
export declare class ESArray implements HeapObject {
    heap: Heap;
    cons: ArrayTypeInfo;
    value: Type[];
    constructor(heap: Heap, cons: ArrayTypeInfo, value: Type[]);
    set(key: number, value: PTValue): void;
    get(idx: number): Maybe<PTValue>;
    getCount(): number;
    toAddress(): HeapAddress;
    promote(): Type[];
}

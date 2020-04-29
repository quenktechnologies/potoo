import * as types from '../../../type';

import {
    Maybe,
    just,
    nothing
} from '@quenk/noni/lib/data/maybe';
import { Record, count } from '@quenk/noni/lib/data/record';
import { isObject, Type } from '@quenk/noni/lib/data/type';

import { TypeInfo, ArrayTypeInfo } from '../../../script/info';
import { PTValue, getType } from '../../../type';
import { Heap, HeapAddress } from '../';
import { HeapObject } from './';

/**
 * ESObject is a HeapObject for ECMAScript objects.
 */
export class ESObject implements HeapObject {

    constructor(
        public heap: Heap,
        public cons: TypeInfo,
        public value: Record<Type>) { }

    set(idx: number, value: PTValue) {

        let key = this.cons.properties[idx];

        if (key != null)
            this.value[key.name] = value;

    }

    get(idx: number): Maybe<PTValue> {

        let prop = this.cons.properties[idx];

        if (prop == null) return nothing();

        return marshal(this.heap, prop.type, this.value[prop.name]);

    }

    getCount(): number {

        return count(this.value);

    }

    toAddress(): HeapAddress {

        return this.heap.getAddress(this);

    }

    promote() {

        return this.value;

    }

}

/**
 * ESArray is a HeapObject for ECMAScript arrays.
 */
export class ESArray implements HeapObject {

    constructor(
        public heap: Heap,
        public cons: ArrayTypeInfo,
        public value: Type[]) { }

    set(key: number, value: PTValue) {

        this.value[key] = value;

    }

    get(idx: number): Maybe<PTValue> {

        return marshal(this.heap, this.cons.elements, this.value[idx]);

    }

    getCount(): number {

        return this.value.length;

    }

    toAddress(): HeapAddress {

        return this.heap.getAddress(this);

    }

    promote(): Type[] {

        return this.value.slice();

    }

}

const marshal = (heap: Heap, typ: TypeInfo, val?: Type): Maybe<PTValue> => {

    if (val == null) return nothing();

    switch (getType(typ.descriptor)) {

        case types.TYPE_UINT8:
        case types.TYPE_UINT16:
        case types.TYPE_UINT32:
        case types.TYPE_INT8:
        case types.TYPE_INT16:
        case types.TYPE_INT32:
            return just(Number(val));

        case types.TYPE_BOOLEAN:
            return just(Boolean(val) === true ? 1 : 0);

        case types.TYPE_STRING:
            heap.addString(String(val));
            return just(val);

        //TODO: This will actually create a new ESArray/ESObject every time as
        // Heap#exists only checks whether the HeapObject is in the pool not
        // the underlying objects.
        //
        // This could be resolved by having Heap#exists delegate the check to
        // the actual objects however, I'm considering whether ES objects even
        // need to be in the heap in the first place?
        case types.TYPE_ARRAY:

            let ea = new ESArray(heap, <ArrayTypeInfo>typ,
                Array.isArray(val) ? val : [])

            if (!heap.exists(ea))
                heap.addObject(ea);

            return just(ea);

        case types.TYPE_OBJECT:

            let eo = new ESObject(heap, typ, isObject(val) ?
                val : {});

            if (!heap.exists(eo))
                heap.addObject(eo);

            return just(eo);

        default:
            return nothing();
            break;

    }

}


import {
    Maybe,
    fromNullable,
} from '@quenk/noni/lib/data/maybe';
import { isObject, isString, isNumber, Type } from '@quenk/noni/lib/data/type';

import {
    DATA_TYPE_HEAP_OBJECT,
    DATA_TYPE_HEAP_STRING,
    DATA_MASK_VALUE24,
    Data,
    DATA_MASK_TYPE,
    DATA_TYPE_HEAP_FOREIGN,
    DATA_TYPE_HEAP_FUN
} from '../stack/frame';
import { PTValue } from '../../type';
import { HeapObject } from './object';
import { FunInfo } from '../../script/info';

/**
 * HeapAddress identifies an object in the heap.
 */
export type HeapAddress = number;

/**
 * Heap stores objects in use by the script.
 */
export interface Heap {

    /**
     * addString to the heap.
     */
    addString(value: string): HeapAddress

    /**
     * addObject to the heap
     */
    addObject(obj: HeapObject): HeapAddress

    /**
     * addForeign adds an opaque JavaScript value to the heap.
     */
    addForeign(obj: Type): HeapAddress

    /**
     * addFun adds a function (vm or foreign) to the heap.
     *
     * This is meant to support high order functions.
     */
    addFun(fun: FunInfo): HeapAddress

    /**
     * getString from the strings pool.
     *
     * If no string exists at the reference and empty string is provided.
     */
    getString(r: HeapAddress): string

    /**
     * getObject an object from the heap.
     */
    getObject(r: HeapAddress): Maybe<HeapObject>

    /**
     * getForeign object from the heap.
     */
    getForeign(ref: HeapAddress): Maybe<Type>

    /**
     * getFun from the heap.
     */
    getFun(ref: HeapAddress): Maybe<FunInfo>

    /**
     * getAddress of an PTValue that may be on the heap.
     *
     * For objects that are not on the heap a null reference is returned.
     * Strings are automatically added while numbers and booleans simply return
     * themselves.
     */
    getAddress(v: PTValue): HeapAddress

    /**
     * exists tests whether an object exists in the heap.
     */
    exists(o: HeapObject): boolean

    /**
     * release an object (or string) from the heap.
     */
    release(ref: Data): void

}

/**
 * Heap stores objects in use by the script.
 */
export class VMHeap {

    constructor(
        public strings: string[] = [],
        public objects: HeapObject[] = [],
        public foreigns: Type[] = [],
        public funs: FunInfo[] = []) { }

    addString(value: string): HeapAddress {

        let idx = this.strings.indexOf(value);

        if (idx === -1) {

            this.strings.push(value);

            idx = this.strings.length - 1;

        }

        return idx | DATA_TYPE_HEAP_STRING;

    }

    addObject(obj: HeapObject): HeapAddress {

        let idx = this.objects.indexOf(obj);

        if (idx === -1) {

            this.objects.push(obj);

            idx = this.objects.length - 1;

        }


        //TODO: what if heap size is > 24bits?
        return idx | DATA_TYPE_HEAP_OBJECT;

    }

    addForeign(obj: Type): HeapAddress {

        let idx = this.foreigns.indexOf(obj);

        if (idx === -1) {

            this.foreigns.push(obj);

            idx = this.foreigns.length - 1;

        }

        return idx | DATA_TYPE_HEAP_FOREIGN;

    }

    addFun(fun: FunInfo): HeapAddress {

        let idx = this.funs.indexOf(fun);

        if (idx === -1) {

            this.funs.push(fun);

            idx = this.funs.length - 1;

        }

        return idx | DATA_TYPE_HEAP_FUN;

    }

    getString(r: HeapAddress): string {

        let value = this.strings[r & DATA_MASK_VALUE24];

        return (value != null) ? value : '';

    }

    getObject(r: HeapAddress): Maybe<HeapObject> {

        return fromNullable(this.objects[r & DATA_MASK_VALUE24]);

    }

    getForeign(ref: HeapAddress): Maybe<Type> {

        return fromNullable(this.foreigns[ref & DATA_MASK_VALUE24]);

    }

    getFun(ref: HeapAddress): Maybe<FunInfo> {

        return fromNullable(this.funs[ref & DATA_MASK_VALUE24]);

    }

    getAddress(v: PTValue): HeapAddress {

        if (isString(v)) {

            return this.addString(v);

        } else if (isObject(v)) {

            let idx = this.objects.indexOf(v);

            return idx !== -1 ? DATA_TYPE_HEAP_OBJECT | idx : 0;

        } else if (isNumber(v)) {

            return v;

        } else {

            return 0;

        }

    }

    exists(o: HeapObject): boolean {

        return this.objects.some(eo => o === eo);

    }

    release(ref: Data): void {

        let typ = ref & DATA_MASK_TYPE;

        let ptr = ref & DATA_MASK_VALUE24;

        if (typ === DATA_TYPE_HEAP_STRING) {

            this.strings.splice(ptr, 1);

        } else if (typ === DATA_TYPE_HEAP_OBJECT) {

            this.objects.splice(ptr, 1);

        }

    }

}

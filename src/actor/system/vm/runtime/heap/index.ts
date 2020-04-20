
import {
    Maybe,
    fromNullable,
} from '@quenk/noni/lib/data/maybe';
import { isObject, isString, isNumber } from '@quenk/noni/lib/data/type';

import {
    DATA_TYPE_HEAP_OBJECT,
    DATA_TYPE_HEAP_STRING,
    DATA_MASK_VALUE24
} from '../stack/frame';
import { PTValue } from '../../type';
import { HeapObject } from './object';

/**
 * HeapAddress identifies an object in the heap.
 */
export type HeapAddress = number;

/**
 * Heap stores objects in use by the script.
 */
export class Heap {

    constructor(
        public objects: HeapObject[] = [],
        public strings: string[] = []) { }

    /**
     * addObject to the heap
     */
    addObject(h: HeapObject): HeapAddress {

        //TODO: what if heap size is > 24bits?
        return (this.objects.push(h) - 1) | DATA_TYPE_HEAP_OBJECT;

    }

    /**
     * addString to the heap.
     */
    addString(value: string): HeapAddress {

        let idx = this.strings.indexOf(value);

        if (idx === -1) {

            this.strings.push(value);
            idx = this.strings.length - 1;

        }

        return idx | DATA_TYPE_HEAP_STRING;

    }

    /**
     * getObject an object from the heap.
     */
    getObject(r: HeapAddress): Maybe<HeapObject> {

        return fromNullable(this.objects[r & DATA_MASK_VALUE24]);

    }

    /**
     * getString from the strings pool.
     *
     * If no string exists at the reference and empty string is provided.
     */
    getString(r: HeapAddress): string {

        let value = this.strings[r & DATA_MASK_VALUE24];

        return (value != null) ? value : '';

    }

    /**
     * getAddress of an PTValue that may be on the heap.
     *
     * For objects that are not on the heap a null reference is returned.
     * Strings are automatically added while numbers and booleans simply return
     * themselves.
     *
     * TODO: In the future it may be more appropriate to represent ALL PTValues
     * as objects with their own toAddress() style method.
     */
    getAddress(v: PTValue): HeapAddress {

        if (isString(v)) {

            return this.addString(v);

        } else if (isObject(v)) {

            return v.toAddress();

        } else if (isNumber(v)) {

            return v;

        } else {

            return 0;

        }

    }

    /**
     * exists tests whether an object exists in the heap.
     */
    exists(o: HeapObject): boolean {

        return this.objects.some(eo => o === eo);

    }

    /**
     * release all objects and strings in the heap.
     */
    release(): void {

        this.objects = [];
        this.strings = [];

    }

}

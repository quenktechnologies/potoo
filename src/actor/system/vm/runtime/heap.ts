import {
    Maybe,
    fromNullable,
    just,
    nothing
} from '@quenk/noni/lib/data/maybe';

import { DATA_TYPE_HEAP, DATA_MASK_VALUE24 } from './stack/frame';

/**
 * HeapReference identifies an object in the heap.
 */
export type HeapReference = number;

/**
 * HeapValue
 */
export type HeapValue
    = number
    | string
    | HeapObject
    | HeapValue[]
    ;

/**
 * HeapObject
 */
export interface HeapObject {

    [key: string]: any

}

/**
 * HeapEntry contains info about an object on the heap and the object itself.
 * @param type    - type is a pointer to a function in the cons section that 
 *                  produced the object.
 *
 * @param builtin - indicates whether the type is one of the builtin types.
 *
 * @param value - value of the entry.
 */
export class HeapEntry {

    constructor(
        public type: number,
        public builtin: boolean,
        public value: HeapValue) { }

}

/**
 * Heap stores objects in use by the script.
 */
export class Heap {

    constructor(public pool: HeapEntry[] = []) { }

    /**
     * add an entry to the heap
     */
    add(h: HeapEntry): HeapReference {

        //TODO: what if heap size is > 24bits?
        return (this.pool.push(h) - 1) | DATA_TYPE_HEAP;

    }

    /**
     * get an object from the heap.
     */
    get(r: HeapReference): Maybe<HeapEntry> {

        return fromNullable(this.pool[r & DATA_MASK_VALUE24]);

    }

    /**
     * ref returns a reference for an entry in the pool.
     */
    ref(v: HeapValue): Maybe<HeapReference> {

        return this.pool.reduce((p, e, i) =>
            (e.value === v) ? just(DATA_TYPE_HEAP | i) : p,
            <Maybe<HeapReference>>nothing());

    }

}

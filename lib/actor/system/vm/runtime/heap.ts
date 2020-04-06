import {
    Maybe,
    fromNullable,
    just,
    nothing
} from '@quenk/noni/lib/data/maybe';

import {
    DATA_TYPE_HEAP,
    DATA_MASK_VALUE24,
    DATA_TYPE_HEAP_STRING
} from './stack/frame';

/**
 * HeapReference identifies an object in the heap.
 */
export type HeapReference = number;

/**
 * StringReference identifies a string in the heap.
 */
export type StringReference = number;

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

    constructor(
        public pool: HeapEntry[] = [],
        public strings: string[] = []) { }

    /**
     * add an entry to the heap
     */
    add(h: HeapEntry): HeapReference {

        //TODO: what if heap size is > 24bits?
        return (this.pool.push(h) - 1) | DATA_TYPE_HEAP;

    }

    /**
     * addString value to the heap.
     *
     * Strings are stored in a separate pool/
     */
    addString(value: string): HeapReference {

        let idx = this.strings.indexOf(value);

        if (idx === -1) {

            this.strings.push(value);
            idx = this.strings.length - 1;

        }

        return idx | DATA_TYPE_HEAP_STRING

    }

    /**
     * get an object from the heap.
     */
    get(r: HeapReference): Maybe<HeapEntry> {

        return fromNullable(this.pool[r & DATA_MASK_VALUE24]);

    }

    /**
     * getString from the strings pool.
     *
     * If no string exists at the reference and empty string is provided.
     */
    getString(r: StringReference): string {

        let value = this.strings[r & DATA_MASK_VALUE24];

        return (value != null) ? value : '';

    }

    /**
     * ref returns a reference for an entry in the pool.
     */
    ref(v: HeapValue): Maybe<HeapReference> {

        return this.pool.reduce((p, e, i) =>
            (e.value === v) ? just(DATA_TYPE_HEAP | i) : p,
            <Maybe<HeapReference>>nothing());

    }

    /**
     * release old objects in the heap.
     */
    release(): void {

        this.pool = [];

    }

}

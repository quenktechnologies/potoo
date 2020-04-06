import { Maybe } from '@quenk/noni/lib/data/maybe';
/**
 * HeapReference identifies an object in the heap.
 */
export declare type HeapReference = number;
/**
 * HeapValue
 */
export declare type HeapValue = number | string | HeapObject | HeapValue[];
/**
 * HeapObject
 */
export interface HeapObject {
    [key: string]: any;
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
export declare class HeapEntry {
    type: number;
    builtin: boolean;
    value: HeapValue;
    constructor(type: number, builtin: boolean, value: HeapValue);
}
/**
 * Heap stores objects in use by the script.
 */
export declare class Heap {
    pool: HeapEntry[];
    constructor(pool?: HeapEntry[]);
    /**
     * add an entry to the heap
     */
    add(h: HeapEntry): HeapReference;
    /**
     * get an object from the heap.
     */
    get(r: HeapReference): Maybe<HeapEntry>;
    /**
     * ref returns a reference for an entry in the pool.
     */
    ref(v: HeapValue): Maybe<HeapReference>;
    /**
     * release old objects in the heap.
     */
    release(): void;
}

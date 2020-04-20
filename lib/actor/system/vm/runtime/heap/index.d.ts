import { Maybe } from '@quenk/noni/lib/data/maybe';
import { PTValue } from '../../type';
import { HeapObject } from './object';
/**
 * HeapAddress identifies an object in the heap.
 */
export declare type HeapAddress = number;
/**
 * Heap stores objects in use by the script.
 */
export declare class Heap {
    objects: HeapObject[];
    strings: string[];
    constructor(objects?: HeapObject[], strings?: string[]);
    /**
     * addObject to the heap
     */
    addObject(h: HeapObject): HeapAddress;
    /**
     * addString to the heap.
     */
    addString(value: string): HeapAddress;
    /**
     * getObject an object from the heap.
     */
    getObject(r: HeapAddress): Maybe<HeapObject>;
    /**
     * getString from the strings pool.
     *
     * If no string exists at the reference and empty string is provided.
     */
    getString(r: HeapAddress): string;
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
    getAddress(v: PTValue): HeapAddress;
    /**
     * exists tests whether an object exists in the heap.
     */
    exists(o: HeapObject): boolean;
    /**
     * release all objects and strings in the heap.
     */
    release(): void;
}

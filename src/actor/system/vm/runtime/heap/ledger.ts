import { fromNullable, Maybe } from '@quenk/noni/lib/data/maybe';
import { Record, filter, mapTo, pickKey } from '@quenk/noni/lib/data/record';
import { Type, isNumber, isString, isObject } from '@quenk/noni/lib/data/type';

import { FunInfo, NewForeignFunInfo, NewFunInfo } from '../../script/info';
import {
    DATA_MASK_TYPE,
    DATA_TYPE_HEAP_FUN,
    DATA_TYPE_HEAP_OBJECT,
    DATA_TYPE_HEAP_STRING,
    Frame,
    FrameName
} from '../stack/frame';
import { VMThread } from '../../thread';
import { Foreign, PTObject } from '../../type';
import { HeapAddress } from './';

/**
 * HeapValue is any value that can be stored on the heap.
 */
export type HeapValue
    = HeapObject
    | HeapString
    ;

/**
 * HeapObject is an object value that can be stored or allocated on the heap.
 */
export type HeapObject
    = PTObject
    | FunInfo
    | Foreign
    ;

/**
 * HeapString are strings stored on the heap due to the need for dynamic
 * manipulation or use.
 */
export type HeapString = string;

/**
 * HeapMap contains the heap objects and strings of the VM heap.
 */
export interface HeapMap {

    [key: number]: HeapValue

}

/**
 * A mapping of heap addresses to the frame's that created them.
 */
export interface Owners extends Record<FrameName> { }

/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
export interface HeapLedger {

    /**
     * string adds a string to the heap without specifying an owner.
     *
     * This string will remain on the heap until it is removed or assigned an
     * owner.
     */
    string(value: string): HeapAddress

    /**
     * object adds a object to the heap without specifying an owner.
     *
     * This object will remain on the heap until it is removed or assigned an
     * owner.
     */
    object(value: Foreign): HeapAddress

    /**
     * fun adds a fun to the heap without specifying an owner.
     *
     * This fun will remain on the heap until it is removed or assigned an
     * owner.
     */
    fun(value: FunInfo): HeapAddress

    /**
     * addString to the heap on behalf of a frame.
     */
    addString(frame: Frame, value: string): HeapAddress

    /**
     * addObject to the heap on behalf of a frame.
     */
    addObject(frame: Frame, obj: HeapObject): HeapAddress

    /**
     * addFun to the heap on behalf of a frame.
     */
    addFun(frame: Frame, obj: FunInfo): HeapAddress

    /**
     * getString from the heap given its address.
     */
    getString(ref: HeapAddress): string

    /**
     * getObject from the heap given its address.
     */
    getObject(ref: HeapAddress): Maybe<HeapObject>

    /**
     * getFrameRefs provides a list of all heap addresses that are owned by a 
     * Frame.
     */
    getFrameRefs(frame: Frame): HeapAddress[]

    /**
     * getThreadRefs provides a list of all heap addresses owned by the VMThread.
     */
    getThreadRefs(thread: VMThread): HeapAddress[]

    /**
     * intern a value into the heap returning the existing address if it already
     * exists or a new one.
     *
     * This method will add new objects and string to the heap, return the value
     * provied for regular numbers or a null pointer (0) for everything else.
     */
    intern(frame: Frame, value: Type): HeapAddress

    /**
     * move a HeapAddress from one owner to another.
     *
     * This method assumes the address is valid.
     */
    move(ref: HeapAddress, newOwner: FrameName): HeapAddress

    /**
     * frameExit is called whenever a Frame has finished execution and ready
     * to return its value (if any) to its parent frame.
     *
     * When this method is called, the HeapLedger transfers ownership of the return
     * value to the parent frame if it is a HeapAddress. All other objects owned
     * by the Frame are then removed.
     */
    frameExit(frame: Frame): void

    /**
     * threadExit is called when a VMThread dies and is no longer part of the 
     * system.
     *
     * This "should" mean it is safe to clean up all its refrences.
     */
    threadExit(thread: VMThread): void

}

/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
export class DefaultHeapLedger implements HeapLedger {

    constructor(public objects: HeapMap = {}, public owners: Owners = {}) { }

    counter = 0;

    _addItem(name: FrameName, value: Type, flag: number) {

        let addr = (this.counter++) | flag;

        this.objects[addr] = value;

        if (name !== '')
            this.owners[addr] = name;

        return addr;

    }

    string(value: string): HeapAddress {

        return this._addItem('', value, DATA_TYPE_HEAP_STRING);

    }

    object(value: HeapObject): HeapAddress {

        return this._addItem('', value, DATA_TYPE_HEAP_OBJECT);

    }

    fun(value: FunInfo): HeapAddress {

        return this._addItem('', value, DATA_TYPE_HEAP_FUN);

    }

    addString(frame: Frame, value: string): HeapAddress {

        return this._addItem(frame.name, value, DATA_TYPE_HEAP_STRING);

    }

    addObject(frame: Frame, obj: HeapObject): HeapAddress {

        return this._addItem(frame.name, obj, DATA_TYPE_HEAP_OBJECT);

    }

    addFun(frame: Frame, obj: FunInfo): HeapAddress {

        return this._addItem(frame.name, obj, DATA_TYPE_HEAP_FUN);

    }

    getString(ref: HeapAddress): string {

        let value = <string>this.objects[ref];

        return (value != null) ? value : '';

    }

    getObject(ref: HeapAddress): Maybe<HeapObject> {

        return fromNullable(<HeapObject>this.objects[ref]);

    }

    getFrameRefs(frame: Frame): HeapAddress[] {

        return mapTo(filter(this.owners, owner => owner === frame.name),
            (_, k) => Number(k));

    }

    getThreadRefs(thread: VMThread): HeapAddress[] {

        return mapTo(filter(this.owners, owner =>
            threadId(owner) === thread.context.aid), (_, k) => Number(k));

    }

    intern(frame: Frame, value: Type): HeapAddress {

        let maddr = pickKey<Type>(this.objects, val => val === value);

        if (maddr.isJust()) return Number(maddr.get());

        if (isNumber(value))
            return value;
        else if (isString(value))
            return this.addString(frame, value);
        else if (isObject(value))
            return ((value instanceof NewFunInfo) ||
                (value instanceof NewForeignFunInfo)) ?
                this.addFun(frame, value) : this.addObject(frame, value);
        else
            return 0;

    }

    move(ref: HeapAddress, newOwner: FrameName): HeapAddress {

        this.owners[ref] = newOwner;

        return ref;

    }

    frameExit(frame: Frame) {

        if (frame.parent.isJust() && isHeapAddress(frame.thread.rp))
            this.move(frame.thread.rp, frame.parent.get().name);

        this.getFrameRefs(frame).forEach(ref => {

            if (ref !== frame.thread.rp) {
                delete this.objects[ref];
                delete this.owners[ref];
            }

        });

    }

    threadExit(thread: VMThread) {

        this.getThreadRefs(thread).forEach(ref => {
            delete this.objects[ref];
            delete this.owners[ref];
        });

    }

}

export const isHeapAddress = (ref: number) => {

    let kind = ref & DATA_MASK_TYPE;

    return (kind === DATA_TYPE_HEAP_STRING) || (kind === DATA_TYPE_HEAP_OBJECT);

}

const threadId = (name: FrameName) => Number((name.split('@')[1]).split('#')[0]);

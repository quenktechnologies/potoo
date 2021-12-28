import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Record } from '@quenk/noni/lib/data/record';
import { Type } from '@quenk/noni/lib/data/type';
import { FunInfo } from '../../script/info';
import { Frame, FrameName } from '../stack/frame';
import { VMThread } from '../../thread';
import { Foreign, PTObject } from '../../type';
import { HeapAddress } from './';
/**
 * HeapValue is any value that can be stored on the heap.
 */
export declare type HeapValue = HeapObject | HeapString;
/**
 * HeapObject is an object value that can be stored or allocated on the heap.
 */
export declare type HeapObject = PTObject | FunInfo | Foreign;
/**
 * HeapString are strings stored on the heap due to the need for dynamic
 * manipulation or use.
 */
export declare type HeapString = string;
/**
 * HeapMap contains the heap objects and strings of the VM heap.
 */
export interface HeapMap {
    [key: number]: HeapValue;
}
/**
 * A mapping of heap addresses to the frame's that created them.
 */
export interface Owners extends Record<FrameName> {
}
/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
export interface HeapLedger {
    /**
     * addString to the heap on behalf of a frame.
     */
    addString(frame: Frame, value: string): HeapAddress;
    /**
     * addObject to the heap on behalf of a frame.
     */
    addObject(frame: Frame, obj: HeapObject): HeapAddress;
    /**
     * addFun to the heap on behalf of a frame.
     */
    addFun(frame: Frame, obj: FunInfo): HeapAddress;
    /**
     * getString from the heap given its address.
     */
    getString(ref: HeapAddress): string;
    /**
     * getObject from the heap given its address.
     */
    getObject(ref: HeapAddress): Maybe<HeapObject>;
    /**
     * getFrameRefs provides a list of all heap addresses that are owned by a
     * Frame.
     */
    getFrameRefs(frame: Frame): HeapAddress[];
    /**
     * getThreadRefs provides a list of all heap addresses owned by the VMThread.
     */
    getThreadRefs(thread: VMThread): HeapAddress[];
    /**
     * intern a value into the heap returning the existing address if it already
     * exists or a new one.
     *
     * This method will add new objects and string to the heap, return the value
     * provied for regular numbers or a null pointer (0) for everything else.
     */
    intern(frame: Frame, value: Type): HeapAddress;
    /**
     * frameExit is called whenever a Frame has finished execution and ready
     * to return its value (if any) to its parent frame.
     *
     * When this method is called, the HeapLedger transfers ownership of the return
     * value to the parent frame if it is a HeapAddress. All other objects owned
     * by the Frame are then removed.
     */
    frameExit(frame: Frame): void;
    /**
     * threadExit is called when a VMThread dies and is no longer part of the
     * system.
     *
     * This "should" mean it is safe to clean up all its refrences.
     */
    threadExit(thread: VMThread): void;
}
/**
 * HeapLedger keeps track of objects created on the heap and their ownership.
 */
export declare class DefaultHeapLedger implements HeapLedger {
    objects: HeapMap;
    owners: Owners;
    constructor(objects?: HeapMap, owners?: Owners);
    counter: number;
    _addItem(frame: Frame, value: Type, flag: number): number;
    addString(frame: Frame, value: string): HeapAddress;
    addObject(frame: Frame, obj: HeapObject): HeapAddress;
    addFun(frame: Frame, obj: FunInfo): HeapAddress;
    getString(ref: HeapAddress): string;
    getObject(ref: HeapAddress): Maybe<HeapObject>;
    getFrameRefs(frame: Frame): HeapAddress[];
    getThreadRefs(thread: VMThread): HeapAddress[];
    intern(frame: Frame, value: Type): HeapAddress;
    move(ref: HeapAddress, newOwner: FrameName): void;
    frameExit(frame: Frame): void;
    threadExit(thread: VMThread): void;
}

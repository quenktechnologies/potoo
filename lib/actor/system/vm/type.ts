import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Type } from '@quenk/noni/lib/data/type';

import { HeapAddress } from './runtime/heap';
import { Data } from './runtime/stack/frame';
import { TypeInfo } from './script/info';

import { Thread } from './thread';

export const TYPE_STEP = 0x1000000;

export const BYTE_TYPE = 0xFF000000;
export const BYTE_INDEX = 0xFFFFFF;

export const TYPE_VOID = 0x0;
export const TYPE_UINT8 = TYPE_STEP;
export const TYPE_UINT16 = TYPE_STEP * 2;
export const TYPE_UINT32 = TYPE_STEP * 3;
export const TYPE_INT8 = TYPE_STEP * 4;
export const TYPE_INT16 = TYPE_STEP * 5;
export const TYPE_INT32 = TYPE_STEP * 6;
export const TYPE_BOOLEAN = TYPE_STEP * 7;
export const TYPE_STRING = TYPE_STEP * 8;
export const TYPE_OBJECT = TYPE_STEP * 9;
export const TYPE_ARRAY = TYPE_STEP * 10;
export const TYPE_FUN = TYPE_STEP * 11;
export const TYPE_CONS = TYPE_STEP * 12;

/**
 * TypeDescriptor
 */
export type TypeDescriptor = number;

/**
 * PTValue
 */
export type PTValue
    = PTVoid
    | PTNumber
    | PTBoolean
    | PTString
    | PTObject
    ;

/**
 * PTNumber
 */
export type PTNumber
    = PTInt8
    | PTInt16
    | PTInt32
    | PTUInt8
    | PTUInt16
    | PTUInt32
    ;

/**
 * PTVoid
 */
export type PTVoid = 0;

/**
 * PTInt8
 */
export type PTInt8 = number;

/**
 * PTInt16
 */
export type PTInt16 = number;

/**
 * PTInt32
 */
export type PTInt32 = number;

/**
 * PTUInt8
 */
export type PTUInt8 = number;

/**
 * PTUInt16
 */
export type PTUInt16 = number;

/**
 * PTUInt32
 */
export type PTUInt32 = number;

/**
 * PTBoolean
 */
export type PTBoolean = 1 | 0;

/**
 * PTString
 */
export type PTString = string;

/**
 * Foreign value opaque to the VM.
 */
export type Foreign = Type;

/**
 * ForeignFun
 */
export type ForeignFun = (r: Thread, ...args: Type[]) => Data;

/**
 * PTObject is the interface of objects stored in the object pool.
 */
export interface PTObject {

    /**
     * cons is the constructor for the object.
     */
    cons: TypeInfo

    /**
     * get a property from the object by name.
     */
    get(key: number): Maybe<PTValue>

    /**
     * getCount of items in the object.
     *
     * This method is intended for arrays.
     */
    getCount(): number;

    /**
     * set a property on the object by name.
     */
    set(key: number, value: PTValue): void

    /**
     * toAddress converts a PTObject into its heap address.
     *
     * If the object is not on the heap the address is void.
     */
    toAddress(): HeapAddress

    /**
     * promote this PTObject to an opaque ECMAScript object.
     */
    promote(): Foreign

}

/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
export const getType = (d: TypeDescriptor): number =>
    d & BYTE_TYPE;

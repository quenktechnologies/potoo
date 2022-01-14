import { Maybe } from '@quenk/noni/lib/data/maybe';
import { Type } from '@quenk/noni/lib/data/type';
import { HeapAddress } from './runtime/heap';
import { Data } from './runtime/stack/frame';
import { TypeInfo } from './script/info';
import { Thread } from './thread';
export declare const TYPE_STEP = 16777216;
export declare const BYTE_TYPE = 4278190080;
export declare const BYTE_INDEX = 16777215;
export declare const TYPE_VOID = 0;
export declare const TYPE_UINT8 = 16777216;
export declare const TYPE_UINT16: number;
export declare const TYPE_UINT32: number;
export declare const TYPE_INT8: number;
export declare const TYPE_INT16: number;
export declare const TYPE_INT32: number;
export declare const TYPE_BOOLEAN: number;
export declare const TYPE_STRING: number;
export declare const TYPE_OBJECT: number;
export declare const TYPE_ARRAY: number;
export declare const TYPE_FUN: number;
export declare const TYPE_CONS: number;
/**
 * TypeDescriptor
 */
export declare type TypeDescriptor = number;
/**
 * PTValue
 */
export declare type PTValue = PTVoid | PTNumber | PTBoolean | PTString | PTObject;
/**
 * PTNumber
 */
export declare type PTNumber = PTInt8 | PTInt16 | PTInt32 | PTUInt8 | PTUInt16 | PTUInt32;
/**
 * PTVoid
 */
export declare type PTVoid = 0;
/**
 * PTInt8
 */
export declare type PTInt8 = number;
/**
 * PTInt16
 */
export declare type PTInt16 = number;
/**
 * PTInt32
 */
export declare type PTInt32 = number;
/**
 * PTUInt8
 */
export declare type PTUInt8 = number;
/**
 * PTUInt16
 */
export declare type PTUInt16 = number;
/**
 * PTUInt32
 */
export declare type PTUInt32 = number;
/**
 * PTBoolean
 */
export declare type PTBoolean = 1 | 0;
/**
 * PTString
 */
export declare type PTString = string;
/**
 * Foreign value opaque to the VM.
 */
export declare type Foreign = Type;
/**
 * ForeignFun
 */
export declare type ForeignFun = (r: Thread, ...args: Type[]) => Data;
/**
 * PTObject is the interface of objects stored in the object pool.
 */
export interface PTObject {
    /**
     * cons is the constructor for the object.
     */
    cons: TypeInfo;
    /**
     * get a property from the object by name.
     */
    get(key: number): Maybe<PTValue>;
    /**
     * getCount of items in the object.
     *
     * This method is intended for arrays.
     */
    getCount(): number;
    /**
     * set a property on the object by name.
     */
    set(key: number, value: PTValue): void;
    /**
     * toAddress converts a PTObject into its heap address.
     *
     * If the object is not on the heap the address is void.
     */
    toAddress(): HeapAddress;
    /**
     * promote this PTObject to an opaque ECMAScript object.
     */
    promote(): Foreign;
}
/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
export declare const getType: (d: TypeDescriptor) => number;

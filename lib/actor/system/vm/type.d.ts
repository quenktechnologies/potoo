import { HeapObject } from './runtime/heap/object';
import { Runtime } from './runtime';
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
 * PTObject
 */
export declare type PTObject = HeapObject;
/**
 * ForeignFun
 */
export declare type ForeignFun = (r: Runtime, ...args: PTValue[]) => PTValue;
/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
export declare const getType: (d: TypeDescriptor) => number;

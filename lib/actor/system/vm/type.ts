import { HeapObject } from './runtime/heap/object';
import { Runtime } from './runtime';

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
 * PTObject
 */
export type PTObject = HeapObject;

/**
 * ForeignFun
 */
export type ForeignFun = (r: Runtime, ...args: PTValue[]) => PTValue;

/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
export const getType = (d: TypeDescriptor): number =>
    d & BYTE_TYPE;

/**
 * This module contains the type of objects used by the VM.
 *
 * The high byte of a stack instruction is used to indicate the type of value.
 * Therefore we can have a max of 255 types. In practice, far less is needed
 * and most non-primitive types should be an object.
 */
import { Type } from '@quenk/noni/lib/data/type';

import { PTObject } from './object';
import { Thread } from './thread';

export const BYTE_TYPE = 0xff000000;
export const BYTE_INDEX = 0xffffff;

export const TYPE_STEP = 0x1000000;

export const TYPE_UINT8 = TYPE_STEP;
export const TYPE_UINT16 = TYPE_STEP * 2;
export const TYPE_UINT32 = TYPE_STEP * 3;
export const TYPE_INT8 = TYPE_STEP * 4;
export const TYPE_INT16 = TYPE_STEP * 5;
export const TYPE_INT32 = TYPE_STEP * 6;
export const TYPE_BOOLEAN = TYPE_STEP * 7;
export const TYPE_STRING = TYPE_STEP * 8;
export const TYPE_OBJECT = TYPE_STEP * 9;
export const TYPE_LIST = TYPE_STEP * 10;
export const TYPE_FUN = TYPE_STEP * 11;
export const TYPE_CONS = TYPE_STEP * 12;
export const TYPE_FOREIGN = TYPE_STEP * 13;
export const TYPE_VOID = 0xf0000000;

export const TYPE_MASK = 0xff000000;

/**
 * TypeDescriptor
 */
export type TypeDescriptor = number;

/**
 * PTValue types.
 */
export type PTValue = PTVoid | PTNumber | PTBoolean | PTString | PTObject;

/**
 * PTNumber types.
 */
export type PTNumber =
    | PTInt8
    | PTInt16
    | PTInt32
    | PTUInt8
    | PTUInt16
    | PTUInt32;

/**
 * PTVoid is the absence of a value.
 */
export type PTVoid = typeof TYPE_VOID;

/**
 * PTInt8 is a signed 8bit integer.
 */
export type PTInt8 = number;

/**
 * PTInt16 is a signed 16bit integer.
 */
export type PTInt16 = number;

/**
 * PTInt32 is a signed 32bit integer.
 */
export type PTInt32 = number;

/**
 * PTUInt8 is an unsigned 8bit integer.
 */
export type PTUInt8 = number;

/**
 * PTUInt16 is an unsigned 16bit integer.
 */
export type PTUInt16 = number;

/**
 * PTUInt32 is an unsigned 32bit integer.
 */
export type PTUInt32 = number;

/**
 * PTBoolean is a boolean value.
 *
 * Zero=false, non-zero=true.
 */
export type PTBoolean = number;

/**
 * PTString
 */
export type PTString = string;

/**
 * ForeignFun type.
 *
 * To make the return value available to the VM, push a value onto the stack.
 */
export type ForeignFun = (r: Thread, ...args: Type[]) => Type;

/**
 * getType from a TypeDescriptor.
 *
 * The highest byte of the 32bit descriptor indicates its type.
 */
export const getType = (d: TypeDescriptor): number => d & BYTE_TYPE;

import { Frame } from '../stack/frame';
import { Runtime } from '../';
/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
export declare const nop: (_: Runtime, __: Frame, ___: number) => void;
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
export declare const pushui8: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
export declare const pushui16: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * Stack:
 *  -> <uint32>
 */
export declare const pushui32: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushstr pushes a string onto the stack.
 *
 * Stack:
 *  -> <string>
 */
export declare const pushstr: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushsym pushes the symbol at the specified index in the info section onto
 * the stack.
 *
 * Stack:
 *
 * -> <value>
 */
export declare const pushsym: (_: Runtime, f: Frame, idx: number) => void;
/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
export declare const dup: (_: Runtime, f: Frame, __: number) => void;
/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> ->
 */
export declare const store: (_: Runtime, f: Frame, idx: number) => void;
/**
 * load the value stored at idx in the variables array onto the top of the
 * stack.
 *
 * If the variable is undefined 0 is placed on the stack.
 *
 * Stack:
 *  -> <any>
 */
export declare const load: (_: Runtime, f: Frame, idx: number) => void;
/**
 * ceq compares two values for equality.
 *
 * Pushes 1 if true, 0 otherwise.
 *
 * Stack:
 *
 * <val1>,<val2> -> <unint32>
 */
export declare const ceq: (r: Runtime, f: Frame, __: number) => void;
/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them.
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an
 * IntergerOverflowErr will be raised.
 */
export declare const addui32: (r: Runtime, f: Frame, _: number) => void;
/**
 * call a function placing its result on the heap.
 *
 * Stack:
 *
 * <arg>...? -> <result>
 */
export declare const call: (r: Runtime, f: Frame, n: number) => void;
/**
 * ret ends execution of the current frame and places the TOS in the return
 * stack.
 *
 * Stack:
 *
 * <value> ->
 */
export declare const ret: (_: Runtime, f: Frame, __: number) => void;

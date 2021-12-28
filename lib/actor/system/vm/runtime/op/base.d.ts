import { Frame } from '../stack/frame';
import { VMThread } from '../../thread';
import { Operand } from '../';
/**
 * nop does nothing.
 *
 * Stack:
 *  ->
 */
export declare const nop: (_: VMThread, __: Frame, ___: Operand) => void;
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 *
 * Stack:
 * -> <uint8>
 */
export declare const pushui8: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 *
 * Stack:
 *  -> <uint16>
 */
export declare const pushui16: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * pushui32 pushes an unsigned 32bit integer onto the stack.
 *
 * NOTE: In a future revision, the operand may be treated as an index.
 * Stack:
 *  -> <uint32>
 */
export declare const pushui32: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * lds loads a string from the constant pool onto the stack.
 *
 * Stack:
 *  -> <string>
 */
export declare const lds: (_: VMThread, f: Frame, idx: Operand) => void;
/**
 * ldn loads an info object from the compiled script.
 *
 * -> <value>
 */
export declare const ldn: (_: VMThread, f: Frame, idx: Operand) => void;
/**
 * dup duplicates the value on top of the data stack.
 *
 * Stack:
 * <any> -> <any>,<any>
 */
export declare const dup: (_: VMThread, f: Frame, __: Operand) => void;
/**
 * store the value at the top of the data stack in the variable indicated
 * by idx.
 *
 * Stack:
 * <any> ->
 */
export declare const store: (_: VMThread, f: Frame, idx: Operand) => void;
/**
 * load the value stored at idx in the variables array onto the top of the
 * stack.
 *
 * If the variable is undefined 0 is placed on the stack.
 *
 * Stack:
 *  -> <any>
 */
export declare const load: (_: VMThread, f: Frame, idx: Operand) => void;
/**
 * ceq compares two values for equality.
 *
 * Pushes 1 if true, 0 otherwise.
 *
 * Stack:
 *
 * <val1>,<val2> -> <unint32>
 */
export declare const ceq: (r: VMThread, f: Frame, __: Operand) => void;
/**
 * addui32 treats the top two operands on the data stack as uint32s and adds
 * them.
 *
 * The result is a 32 bit value. If the result is more than MAX_SAFE_INTEGER an
 * IntergerOverflowErr will be raised.
 */
export declare const addui32: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * call a function placing its result on the heap.
 *
 * Stack:
 *
 * <arg>...? -> <result>
 */
export declare const call: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * raise an exception.
 *
 * Stack:
 *
 * <message> ->
 */
export declare const raise: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
export declare const jmp: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> ->
 */
export declare const ifzjmp: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
export declare const ifnzjmp: (_: VMThread, f: Frame, oper: Operand) => void;
/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export declare const ifeqjmp: (r: VMThread, f: Frame, oper: Operand) => void;
/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export declare const ifneqjmp: (r: VMThread, f: Frame, oper: Operand) => void;

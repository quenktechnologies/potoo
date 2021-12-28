import { Frame } from '../stack/frame';
import { Operand } from '../';
import { VMThread } from '../../thread';
/**
 * getprop retrieves a property from an object.
 *
 * Stack:
 *  <objectref> -> <value>
 */
export declare const getprop: (r: VMThread, f: Frame, idx: Operand) => void;
/**
 * arlength pushes the length of an array on the top of the stack onto
 * the stack.
 *
 * If the reference at the top of the stack is not an array the value will
 * always be zero.
 *
 * Stack:
 * <arrayref> -> <uint32>
 */
export declare const arlength: (r: VMThread, f: Frame, _: Operand) => void;
/**
 * arelm provides the array element at the specified index.
 *
 * If the element is not a primitive it will be placed on the heap.
 *
 * Stack:
 *
 * <arrayref>,<index> -> <element>
 */
export declare const arelm: (r: VMThread, f: Frame, _: Operand) => void;

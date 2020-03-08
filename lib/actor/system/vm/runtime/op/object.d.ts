import { Frame } from '../stack/frame';
import { Runtime } from '../';
/**
 * getprop retrieves a property from an object.
 *
 * If the property is not already on the stack it will be entered there.
 *
 * Stack:
 *  <objectref> -> <value>
 */
export declare const getprop: (r: Runtime, f: Frame, idx: number) => number | void | Frame;
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
export declare const arlength: (r: Runtime, f: Frame, _: number) => void;
/**
 * arelm provides the array element at the specified index.
 *
 * If the element is not a primitive it will be placed on the heap.
 *
 * Stack:
 *
 * <arrayref>,<index> -> <element>
 */
export declare const arelm: (r: Runtime, f: Frame, _: number) => void;

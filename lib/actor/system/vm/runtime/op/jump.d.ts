import { Frame } from '../stack/frame';
import { Runtime } from '../';
/**
 * jmp jumps to the instruction at the specified address.
 *
 * Stack:
 *  ->
 */
export declare const jmp: (_: Runtime, f: Frame, args: number) => void;
/**
 * ifzjmp jumps to the instruction at the specified address if the top
 * of the stack is === 0.
 *
 * Stack:
 *
 * <uint32> ->
 */
export declare const ifzjmp: (_: Runtime, f: Frame, args: number) => void;
/**
 * ifnzjmp jumps to the instruction at the specified address if the top
 * of the stack is !== 0.
 *
 * Stack:
 * <uint32> ->
 */
export declare const ifnzjmp: (_: Runtime, f: Frame, args: number) => void;
/**
 * ifeqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export declare const ifeqjmp: (r: Runtime, f: Frame, args: number) => void;
/**
 * ifneqjmp jumps to the instruction at the specified address if the top
 * two elements of the stack are not strictly equal to each other.
 * Stack:
 * <any><any> ->
 */
export declare const ifneqjmp: (r: Runtime, f: Frame, args: number) => void;

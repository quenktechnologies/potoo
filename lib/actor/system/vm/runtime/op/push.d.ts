import { Frame } from '../stack/frame';
import { Runtime } from '../';
/**
 * pushui8 pushes an unsigned 8bit integer onto the stack.
 */
export declare const pushui8: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushui16 pushes an unsigned 16bit integer onto the stack.
 */
export declare const pushui16: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushstr pushes a string onto the stack.
 */
export declare const pushstr: (_: Runtime, f: Frame, args: number) => void;
/**
 * pushTmpl pushes a template onto the stack.
 */
export declare const pushtmpl: (_: Runtime, f: Frame, args: number) => void;

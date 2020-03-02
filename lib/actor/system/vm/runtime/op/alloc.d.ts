import { Frame } from '../stack/frame';
import { Runtime } from '../';
/**
 * alloc a Context for a new actor.
 *
 * The context is stored in the vm's state table.
 *
 * Stack:
 * <template>,<address> -> <address>
 */
export declare const alloc: (r: Runtime, f: Frame, _: number) => void;

import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * TempChild copies a template's child onto the heap.
 *
 * Pops:
 * 1: Pointer to the template.
 * 2: Index of the child template.
 */
export declare class TempChild implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Op, Level } from './';
/**
 * TempChild copies a template's child onto the heap.
 *
 * Pops:
 * 1: Pointer to the template.
 * 2: Index of the child template.
 */
export declare class TempChild<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

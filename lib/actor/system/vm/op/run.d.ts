import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Run invokes the run method of an actor given the address.
 *
 * Pops
 * 1. The address of the current actor or child to be run.
 */
export declare class Run<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

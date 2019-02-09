import { Context } from '../../../context';
import { Runtime } from '../runtime';
import { Frame } from '../frame';
import { System } from '../../';
import { Log, Op, Level } from './';
/**
 * Drop an unwanted message.
 *
 * Pops:
 *
 * 1. The message to be dropped.
 */
export declare class Drop<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

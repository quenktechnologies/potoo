import { Context } from '../../../context';
import { System } from '../../';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Stop an actor, all of it's children will also be stopped.
 *
 * Pops:
 * 1. Address of actor to stop.
 */
export declare class Stop<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(f: Frame<C, S>): Log;
}

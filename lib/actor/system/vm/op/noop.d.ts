import { Context } from '../../../context';
import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { System } from '../../';
import { Log, Level, Op } from './';
/**
 * Noop does nothing.
 */
export declare class Noop<C extends Context, S extends System<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(_: Runtime<C, S>): void;
    toLog(_: Frame<C, S>): Log;
}

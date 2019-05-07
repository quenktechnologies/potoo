import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level, Op } from './';
/**
 * Noop does nothing.
 */
export declare class Noop implements Op {
    code: number;
    level: Level;
    exec(_: Runtime): void;
    toLog(_: Frame): Log;
}

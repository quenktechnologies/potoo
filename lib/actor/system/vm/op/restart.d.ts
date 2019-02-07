import { Context } from '../../../context';
import { Runtime } from '../runtime';
import { Platform } from '../';
import { Log, Op, Level } from './';
/**
 * Restart the current actor.
 */
export declare class Restart<C extends Context, S extends Platform<C>> implements Op<C, S> {
    code: number;
    level: Level;
    exec(e: Runtime<C, S>): void;
    toLog(): Log;
}

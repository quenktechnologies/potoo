import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Restart the current actor.
 */
export declare class Restart implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(): Log;
}

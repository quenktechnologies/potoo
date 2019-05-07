import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Level } from './';
/**
 * TempCC counts the number of child templates a template has.
 *
 * Pops:
 *
 * 1: Reference to the template to count.
 */
export declare class TempCC {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

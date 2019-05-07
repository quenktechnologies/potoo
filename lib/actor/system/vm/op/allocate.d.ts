import { Frame } from '../frame';
import { Runtime } from '../runtime';
import { Log, Op, Level } from './';
/**
 * Allocate a new Context frame for an actor from a template.
 *
 * Pops:
 * 1: Address of the parent actor.
 * 2: Pointer to the template to use from the templates table.
 *
 * Raises:
 * InvalidIdErr
 * UnknownParentAddressErr
 * DuplicateAddressErr
 */
export declare class Allocate implements Op {
    code: number;
    level: Level;
    exec(e: Runtime): void;
    toLog(f: Frame): Log;
}

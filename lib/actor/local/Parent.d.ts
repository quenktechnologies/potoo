import { Envelope } from '../../system';
import { Result } from '..';
import { Resident } from '.';
/**
 * Parent actor only spanws child actors.
 */
export declare class Parent extends Resident {
    accept(e: Envelope): Result;
}

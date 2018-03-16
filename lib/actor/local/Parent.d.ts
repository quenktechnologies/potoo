import { Envelope } from '../../system';
import { Resident } from '.';
/**
 * Parent actor only spanws child actors.
 */
export declare class Parent extends Resident {
    accept<M>(e: Envelope<M>): Parent;
    run(): this;
}

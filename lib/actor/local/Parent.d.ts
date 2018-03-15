import { Envelope } from '../../system';
import { Local } from '.';
/**
 * Parent actor only spanws child actors.
 */
export declare class Parent extends Local {
    accept<M>(e: Envelope<M>): Parent;
    run(): this;
}

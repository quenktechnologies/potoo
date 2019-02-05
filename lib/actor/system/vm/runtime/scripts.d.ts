import { Context } from '../../../context';
import { System } from '../../';
import { Address } from '../../../address';
import { Script } from '../script';
/**
 * StopScript for stopping actors.
 */
export declare class StopScript<C extends Context, S extends System<C>> extends Script<C, S> {
    addr: Address;
    constructor(addr: Address);
}
/**
 * RestartScript for restarting actors.
 */
export declare class RestartScript<C extends Context, S extends System<C>> extends Script<C, S> {
    constructor();
}

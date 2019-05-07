import { Address } from '../../../address';
import { Script } from '../script';
/**
 * StopScript for stopping actors.
 */
export declare class StopScript extends Script {
    addr: Address;
    constructor(addr: Address);
}
/**
 * RestartScript for restarting actors.
 */
export declare class RestartScript extends Script {
    constructor();
}

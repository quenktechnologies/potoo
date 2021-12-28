import { Info, NewFunInfo } from '../script/info';
import { Script, Constants } from '../script';
/**
 * commonFunctions used by both the VM script and the resident ones.
 */
export declare const commonFunctions: NewFunInfo[];
/**
 * BaseScript providing sane defaults for all our Script instances.
 */
export declare class BaseScript implements Script {
    constants: Constants;
    name: string;
    info: Info[];
    code: never[];
}
/**
 * NoScript is used for actors that do not execute any code.
 */
export declare class NoScript extends BaseScript {
}
/**
 * VMActorScript is the script used by the VM for its own actor (the $ actor).
 *
 * This script provides VM functions for:
 * 1. Sending messages
 * 2. Retrieving messages.
 * 3. Killing other actors.
 * 4. Racing exceptions.
 */
export declare class VMActorScript extends BaseScript {
    info: NewFunInfo[];
}

import * as op from '../runtime/op';

import { Info, NewFunInfo } from '../script/info';
import { Script, Constants } from '../script';

/**
 * commonFunctions used by both the VM script and the resident ones.
 */
export const commonFunctions = [

    // $0: Message 1: Address
    new NewFunInfo('tell', 2, [op.SEND])
 
];

/**
 * BaseScript providing sane defaults for all our Script instances.
 */
export class BaseScript implements Script {

    constants = <Constants>[[], []];

    name = '<main>';

    info: Info[] = [];

    code = [];

}

/**
 * NoScript is used for actors that do not execute any code.
 */
export class NoScript extends BaseScript { }

/**
 * VMActorScript is the script used by the VM for its own actor (the $ actor).
 *
 * This script provides VM functions for:
 * 1. Sending messages
 * 2. Retrieving messages.
 * 3. Killing other actors.
 * 4. Racing exceptions.
 */
export class VMActorScript extends BaseScript {

    info = commonFunctions;

}
